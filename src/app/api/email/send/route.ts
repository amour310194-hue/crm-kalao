import { NextRequest } from "next/server";
import { enforceRateLimits, supabaseRateLimitStore } from "@/lib/rate-limit";
import { getMailContext, jsonError, readJson } from "@/lib/mail/server/context";
import { persistOutgoing, prepareOutgoing, type RawCompose } from "@/lib/mail/server/outgoing";
import { buildResendBody, checkScheduledAt, deliver, signedAttachmentUrls } from "@/lib/mail/server/send";
import { resendConfigured } from "@/lib/mail/server/resend";

export const maxDuration = 60;

const SEND_MAX = 100;
const SEND_WINDOW = 60 * 60;

/**
 * Envoi d'un mail. L'historique est écrit ici, côté serveur, avant l'appel à Resend :
 * un mail parti a toujours sa trace, et le navigateur ne peut plus inventer d'historique.
 */
export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const limited = await enforceRateLimits(supabaseRateLimitStore(), [
      { key: `mail-send:user:${ctx.userId}`, windowSeconds: SEND_WINDOW, max: SEND_MAX },
    ]);
    if (limited.limited) {
      return Response.json(
        { ok: false, dispatched: false, reason: "too_many_requests", detail: "Limite de 100 envois par heure atteinte." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const raw = await readJson<RawCompose & { force?: boolean }>(request);
    const scheduledAt = checkScheduledAt(raw.scheduledAt);
    const prepared = await prepareOutgoing(ctx, raw, "send");

    const all = [...prepared.recipients.to, ...prepared.recipients.cc, ...prepared.recipients.bcc];
    if (!raw.force && all.length) {
      const { data: blocked } = await ctx.admin
        .from("crm_mail_suppressions")
        .select("email, reason")
        .in("email", all);
      if (blocked?.length) {
        return Response.json(
          { ok: false, dispatched: false, reason: "suppressed", suppressed: blocked },
          { status: 409 }
        );
      }
    }

    if (!resendConfigured()) {
      await persistOutgoing(ctx, prepared, {
        folder: "drafts",
        status: "failed",
        delivery_status: "failed",
        delivery_detail: "Resend n'est pas configuré (RESEND_API_KEY).",
        delivery_updated_at: new Date().toISOString(),
      });
      return Response.json({ ok: false, dispatched: false, reason: "resend_missing", id: prepared.id, threadId: prepared.threadId });
    }

    await persistOutgoing(ctx, prepared, {
      folder: scheduledAt ? "scheduled" : "sent",
      status: "queued",
      delivery_status: "queued",
      scheduled_at: scheduledAt,
    });

    const body = buildResendBody({
      kind: prepared.kind,
      from: prepared.from,
      replyTo: prepared.fromAddress,
      recipients: prepared.recipients,
      subject: prepared.subject,
      bodyHtml: prepared.html,
      messageId: prepared.messageId,
      inReplyTo: prepared.inReplyTo,
      references: prepared.references,
      attachments: await signedAttachmentUrls(ctx.admin, prepared.attachments, scheduledAt),
      scheduledAt,
      emailId: prepared.id,
    });
    const res = await deliver(body, prepared.id);
    const now = new Date().toISOString();

    if (res.ok) {
      await ctx.admin
        .from("crm_emails")
        .update({
          status: scheduledAt ? "scheduled" : "sent",
          delivery_status: scheduledAt ? "scheduled" : "sent",
          delivery_updated_at: now,
          resend_id: res.data?.id ?? null,
          sent_at: scheduledAt ? null : now,
        })
        .eq("id", prepared.id);
    } else {
      await ctx.admin
        .from("crm_emails")
        .update({
          folder: "drafts",
          status: "failed",
          delivery_status: "failed",
          delivery_detail: res.detail,
          delivery_updated_at: now,
          scheduled_at: null,
        })
        .eq("id", prepared.id);
    }

    await ctx.admin.from("mail_send_log").insert({
      actor_id: ctx.userId,
      mailbox: prepared.mailbox,
      from_email: prepared.fromAddress,
      to_email: all.join(", ").slice(0, 1000),
      subject: prepared.subject,
      resend_id: res.ok ? res.data?.id ?? null : null,
      ok: res.ok,
    });

    return Response.json({
      ok: res.ok,
      dispatched: res.ok,
      scheduled: Boolean(scheduledAt && res.ok),
      reason: res.ok ? (scheduledAt ? "scheduled" : "sent") : "resend_error",
      detail: res.ok ? undefined : res.detail,
      id: prepared.id,
      threadId: prepared.threadId,
      to: prepared.recipients.to[0] ?? "",
    });
  } catch (err) {
    return jsonError(err);
  }
}
