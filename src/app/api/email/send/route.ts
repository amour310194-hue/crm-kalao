import { NextRequest } from "next/server";
import { crmMailHeaders, crmMailHtml, fromAddress } from "@/lib/mail-deliverability";
import { getServiceSupabase, getUserSupabase } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/require-user";
import { authorizeSender, isSharedMailbox, type SharedMailbox } from "@/lib/mail-send-auth";
import {
  enforceRateLimits,
  supabaseRateLimitStore,
} from "@/lib/rate-limit";

const SEND_MAX = 100;
const SEND_WINDOW = 60 * 60;

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) {
    return Response.json({ ok: false, dispatched: false, reason: "unauthorized" }, { status: 401 });
  }
  const { user, token } = authed;

  const limited = await enforceRateLimits(supabaseRateLimitStore(), [
    { key: `mail-send:user:${user.id}`, windowSeconds: SEND_WINDOW, max: SEND_MAX },
  ]);
  if (limited.limited) {
    return Response.json(
      { ok: false, dispatched: false, reason: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ ok: true, dispatched: false, reason: "resend_missing" });
  }

  let payload: {
    to?: string;
    subject?: string;
    body?: string;
    mailbox?: string;
    from?: string;
    attachments?: { filename?: string; content?: string; contentType?: string }[];
  } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, dispatched: false, reason: "bad_payload" }, { status: 400 });
  }

  const to = String(payload.to ?? "").trim();
  const subject = String(payload.subject ?? "CRM Kalao").trim();
  const text = String(payload.body ?? "").trim();
  if (!to || !text) {
    return Response.json({ ok: true, dispatched: false, reason: "missing_to" });
  }

  const admin = getServiceSupabase();
  const [{ data: profile }, { data: employee }] = await Promise.all([
    admin.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle(),
    admin.from("employees").select("email, full_name").eq("profile_id", user.id).maybeSingle(),
  ]);
  const asUser = getUserSupabase(token);
  let allowedShared: SharedMailbox[] = [];
  if (asUser) {
    const { data } = await asUser.rpc("shared_mailboxes_for_me");
    allowedShared = (Array.isArray(data) ? data : []).filter(isSharedMailbox);
  }

  const workEmail = String(employee?.email || user.email || "").toLowerCase();
  const authz = authorizeSender({
    mailbox: payload.mailbox,
    requestedFrom: payload.from,
    workEmail,
    fullName: String(employee?.full_name || profile?.full_name || workEmail),
    allowedShared,
  });
  if (!authz.ok) {
    return Response.json({ ok: false, dispatched: false, reason: authz.reason }, { status: 403 });
  }

  const from = authz.from;
  const automatic = authz.mailbox === "noreply";
  const replyTo = fromAddress(from);
  const attachments = (payload.attachments ?? [])
    .filter((file) => file.filename && file.content)
    .slice(0, 8)
    .map((file) => ({
      filename: String(file.filename),
      content: String(file.content),
      content_type: file.contentType || undefined,
    }));
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: crmMailHtml(text),
      reply_to: replyTo,
      attachments: attachments.length ? attachments : undefined,
      headers: automatic
        ? {
            "Auto-Submitted": "auto-generated",
            "X-Auto-Response-Suppress": "All",
            ...crmMailHeaders(from),
          }
        : crmMailHeaders(from),
    }),
  });

  let detail: string | undefined;
  let id: string | undefined;
  const raw = await res.text();
  try {
    const parsed = JSON.parse(raw) as { message?: string; name?: string; id?: string };
    id = parsed.id;
    if (!res.ok) {
      detail = [parsed.name, parsed.message].filter(Boolean).join(": ") || raw.slice(0, 280);
    }
  } catch {
    if (!res.ok) detail = raw.slice(0, 280);
  }

  const { error: logErr } = await admin.from("mail_send_log").insert({
    actor_id: user.id,
    mailbox: authz.mailbox,
    from_email: replyTo,
    to_email: to,
    subject,
    resend_id: id ?? null,
    ok: res.ok,
  });
  void logErr;

  return Response.json({
    ok: res.ok,
    dispatched: res.ok,
    reason: res.ok ? "sent" : "resend_error",
    detail,
    id,
  });
}
