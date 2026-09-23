import { NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text, reply_to: from }),
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
