import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";

function mailboxFor(addresses: string[]): "noreply" | "contact" | null {
  const hay = addresses.join(" ").toLowerCase();
  if (hay.includes(KALAO_CONTACT_EMAIL)) return "contact";
  if (hay.includes(KALAO_NOREPLY_EMAIL)) return "noreply";
  return null;
}

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    return Response.json({ ok: false, reason: "inbound_store_missing" }, { status: 503 });
  }

  let payload: {
    type?: string;
    data?: {
      from?: string;
      to?: string[] | string;
      subject?: string;
      text?: string;
      html?: string;
    };
  };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }

  const data = payload.data ?? {};
  const toList = Array.isArray(data.to) ? data.to : data.to ? [data.to] : [];
  const mailbox = mailboxFor(toList);
  if (!mailbox) {
    return Response.json({ ok: true, stored: false, reason: "not_shared_mailbox" });
  }
  const from = String(data.from ?? "").trim();
  const body = String(data.text || data.html || "").trim();
  if (!from || !body) {
    return Response.json({ ok: true, stored: false, reason: "empty" });
  }

  const supabase = createClient(url, service);
  const { error } = await supabase.from("crm_emails").insert({
    mailbox,
    owner_id: null,
    direction: "in",
    from_email: from,
    to_email: toList[0] ?? (mailbox === "contact" ? KALAO_CONTACT_EMAIL : KALAO_NOREPLY_EMAIL),
    subject: String(data.subject ?? "Sans objet").trim(),
    body,
    status: "stored",
  });
  if (error) {
    return Response.json({ ok: false, reason: error.message }, { status: 500 });
  }
  return Response.json({ ok: true, stored: true });
}
