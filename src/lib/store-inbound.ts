import { createClient } from "@supabase/supabase-js";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";
import {
  expandInboundAliases,
  extractAddresses,
  fetchReceivedEmail,
  type InboundResolved,
} from "@/lib/inbound-mail";

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function resolveMailbox(addresses: string[]): Promise<InboundResolved | null> {
  const targets = expandInboundAliases(addresses);
  if (targets.some((addr) => addr === KALAO_CONTACT_EMAIL)) {
    return { mailbox: "contact", toEmail: KALAO_CONTACT_EMAIL, ownerId: null };
  }
  if (targets.some((addr) => addr === KALAO_NOREPLY_EMAIL)) {
    return { mailbox: "noreply", toEmail: KALAO_NOREPLY_EMAIL, ownerId: null };
  }
  const supabase = service();
  if (!supabase || !targets.length) return null;
  const { data: employee } = await supabase
    .from("employees")
    .select("email, profile_id")
    .in("email", targets)
    .not("profile_id", "is", null)
    .maybeSingle();
  if (!employee?.profile_id) return null;
  return {
    mailbox: "personal",
    toEmail: String(employee.email ?? targets[0]).toLowerCase(),
    ownerId: employee.profile_id,
  };
}

export async function storeInboundEmail(input: {
  from: string;
  to: string[];
  receivedFor?: string[];
  subject: string;
  body: string;
  resendId?: string | null;
}): Promise<{ stored: boolean; reason: string; mailbox?: string }> {
  const supabase = service();
  if (!supabase) return { stored: false, reason: "inbound_store_missing" };
  const from = extractAddresses(input.from)[0] || input.from.trim();
  const body = input.body.trim() || "(sans contenu)";
  if (!from) return { stored: false, reason: "empty" };

  if (input.resendId) {
    const { data: existing } = await supabase
      .from("crm_emails")
      .select("id")
      .eq("resend_id", input.resendId)
      .maybeSingle();
    if (existing) return { stored: true, reason: "duplicate" };
  }

  const resolved = await resolveMailbox([...(input.to ?? []), ...(input.receivedFor ?? [])]);
  if (!resolved) return { stored: false, reason: "unknown_mailbox" };

  const { error } = await supabase.from("crm_emails").insert({
    mailbox: resolved.mailbox,
    owner_id: resolved.ownerId,
    direction: "in",
    from_email: from,
    to_email: resolved.toEmail,
    subject: input.subject.trim() || "Sans objet",
    body,
    resend_id: input.resendId ?? null,
    status: "stored",
    folder: "inbox",
    starred: false,
    important: false,
  });
  if (error) return { stored: false, reason: error.message };
  return { stored: true, reason: "stored", mailbox: resolved.mailbox };
}

export async function ingestReceivedEmail(emailId: string) {
  const email = await fetchReceivedEmail(emailId);
  if (!email) return { stored: false, reason: "fetch_failed" };
  return storeInboundEmail({
    from: email.from,
    to: email.to,
    receivedFor: email.receivedFor,
    subject: email.subject,
    body: email.text,
    resendId: emailId,
  });
}
