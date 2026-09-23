import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";

function extractAddresses(value: string[] | string | undefined): string[] {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .flatMap((item) => item.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])
    .map((item) => item.toLowerCase());
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
  const toList = extractAddresses(data.to);
  const fromMatch = extractAddresses(data.from);
  const from = fromMatch[0] || String(data.from ?? "").trim();
  const body = String(data.text || data.html || "").trim();
  if (!from || !body) {
    return Response.json({ ok: true, stored: false, reason: "empty" });
  }

  const supabase = createClient(url, service);
  let mailbox: "noreply" | "contact" | "personal" | null = null;
  let ownerId: string | null = null;
  let toEmail = toList[0] ?? "";

  if (toList.some((addr) => addr === KALAO_CONTACT_EMAIL)) {
    mailbox = "contact";
    toEmail = KALAO_CONTACT_EMAIL;
  } else if (toList.some((addr) => addr === KALAO_NOREPLY_EMAIL)) {
    mailbox = "noreply";
    toEmail = KALAO_NOREPLY_EMAIL;
  } else if (toList.length) {
    const { data: employee } = await supabase
      .from("employees")
      .select("email, profile_id")
      .in("email", toList)
      .not("profile_id", "is", null)
      .maybeSingle();
    if (employee?.profile_id) {
      mailbox = "personal";
      ownerId = employee.profile_id;
      toEmail = String(employee.email ?? toEmail).toLowerCase();
    }
  }

  if (!mailbox) {
    return Response.json({ ok: true, stored: false, reason: "unknown_mailbox" });
  }

  const { error } = await supabase.from("crm_emails").insert({
    mailbox,
    owner_id: ownerId,
    direction: "in",
    from_email: from,
    to_email: toEmail,
    subject: String(data.subject ?? "Sans objet").trim(),
    body,
    status: "stored",
    folder: "inbox",
    starred: false,
    important: false,
  });
  if (error) {
    return Response.json({ ok: false, reason: error.message }, { status: 500 });
  }
  return Response.json({ ok: true, stored: true, mailbox });
}
