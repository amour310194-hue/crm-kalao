import { NextRequest } from "next/server";
import { crmMailHeaders, crmMailHtml, fromAddress } from "@/lib/mail-deliverability";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_FROM } from "@/lib/org";

type MailboxKey = "noreply" | "contact" | "personal";

function resolveFrom(mailbox: MailboxKey | undefined, requested?: string) {
  if (mailbox === "contact") return `Contact Kalao <${KALAO_CONTACT_EMAIL}>`;
  if (mailbox === "personal") {
    const raw = String(requested ?? "").trim();
    if (/@groupe-kalao\.com>/i.test(raw) || /@groupe-kalao\.com$/i.test(raw)) {
      return raw;
    }
  }
  return process.env.RESEND_FROM || KALAO_NOREPLY_FROM;
}

async function requireUser(request: NextRequest) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, anon);
  const { data } = await supabase.auth.getUser(token);
  return data.user ?? null;
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) {
    return Response.json(
      { ok: false, dispatched: false, reason: "unauthorized" },
      { status: 401 }
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
    mailbox?: MailboxKey;
    from?: string;
    attachments?: { filename?: string; content?: string; contentType?: string }[];
  } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json(
      { ok: false, dispatched: false, reason: "bad_payload" },
      { status: 400 }
    );
  }

  const to = String(payload.to ?? "").trim();
  const subject = String(payload.subject ?? "CRM Kalao").trim();
  const text = String(payload.body ?? "").trim();
  if (!to || !text) {
    return Response.json({ ok: true, dispatched: false, reason: "missing_to" });
  }

  const from = resolveFrom(payload.mailbox, payload.from);
  const automatic = payload.mailbox !== "contact" && payload.mailbox !== "personal";
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

  return Response.json({
    ok: res.ok,
    dispatched: res.ok,
    reason: res.ok ? "sent" : "resend_error",
    detail,
    id,
  });
}
