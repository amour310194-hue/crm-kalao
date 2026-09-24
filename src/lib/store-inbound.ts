import { createClient } from "@supabase/supabase-js";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";
import {
  expandInboundAliases,
  extractAddresses,
  fetchReceivedEmail,
  type InboundResolved,
} from "@/lib/inbound-mail";
import { repairMailText } from "@/lib/mail-text";

const INGEST_SECRET =
  process.env.INBOUND_INGEST_SECRET || "kloa_inb_v17_9f3c2a7e1b84d0c6e5a2f8b1d4c7e0a3";

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isPlaceholderBody(body: string) {
  return !body || body === "(sans contenu)" || body === "(contenu à récupérer)";
}

export async function resolveMailbox(addresses: string[]): Promise<InboundResolved | null> {
  const targets = expandInboundAliases(addresses);
  if (
    targets.some((addr) => addr === KALAO_CONTACT_EMAIL || addr.startsWith("contact@"))
  ) {
    return { mailbox: "contact", toEmail: KALAO_CONTACT_EMAIL, ownerId: null };
  }
  if (
    targets.some(
      (addr) =>
        addr === KALAO_NOREPLY_EMAIL ||
        addr.startsWith("no-reply@") ||
        addr.startsWith("noreply@")
    )
  ) {
    return { mailbox: "noreply", toEmail: KALAO_NOREPLY_EMAIL, ownerId: null };
  }
  const supabase = service();
  if (supabase && targets.length) {
    const { data: employee } = await supabase
      .from("employees")
      .select("email, profile_id")
      .in("email", targets)
      .not("profile_id", "is", null)
      .limit(1)
      .maybeSingle();
    if (employee?.profile_id) {
      return {
        mailbox: "personal",
        toEmail: String(employee.email ?? targets[0]).toLowerCase(),
        ownerId: employee.profile_id,
      };
    }
  }
  if (targets.length) {
    return { mailbox: "contact", toEmail: KALAO_CONTACT_EMAIL, ownerId: null };
  }
  return null;
}

export async function storeInboundEmail(input: {
  from: string;
  to: string[];
  receivedFor?: string[];
  subject: string;
  body: string;
  resendId?: string | null;
}): Promise<{ stored: boolean; reason: string; mailbox?: string }> {
  const from = extractAddresses(input.from)[0] || input.from.trim();
  const body = repairMailText(input.body.trim()) || "(sans contenu)";
  const subject = repairMailText(input.subject.trim()) || "Sans objet";
  if (!from) return { stored: false, reason: "empty" };

  const supabase = service();
  if (supabase) {
    if (input.resendId) {
      const { data: existing } = await supabase
        .from("crm_emails")
        .select("id, body")
        .eq("resend_id", input.resendId)
        .maybeSingle();
      if (existing) {
        if (!isPlaceholderBody(body) && isPlaceholderBody(String(existing.body ?? ""))) {
          await supabase.from("crm_emails").update({ body }).eq("id", existing.id);
        }
        return { stored: true, reason: "duplicate" };
      }
    }

    const resolved = await resolveMailbox([...(input.to ?? []), ...(input.receivedFor ?? [])]);
    if (!resolved) return { stored: false, reason: "unknown_mailbox" };

    const { data: contact } = await supabase
      .from("contacts")
      .select("id, company_id")
      .ilike("email", from)
      .limit(1)
      .maybeSingle();

    const { error } = await supabase.from("crm_emails").insert({
      mailbox: resolved.mailbox,
      owner_id: resolved.ownerId,
      direction: "in",
      from_email: from,
      to_email: resolved.toEmail,
      subject,
      body,
      company_id: contact?.company_id ?? null,
      contact_id: contact?.id ?? null,
      resend_id: input.resendId ?? null,
      status: "stored",
      folder: "inbox",
      starred: false,
      important: false,
      unread: true,
    });
    if (error) return { stored: false, reason: error.message };
    return { stored: true, reason: "stored", mailbox: resolved.mailbox };
  }

  const anon = anonClient();
  if (!anon) return { stored: false, reason: "inbound_store_missing" };
  const { data, error } = await anon.rpc("ingest_inbound_email", {
    p_secret: INGEST_SECRET,
    p_from: from,
    p_to: input.to ?? [],
    p_received_for: input.receivedFor ?? [],
    p_subject: subject,
    p_body: body,
    p_resend_id: input.resendId ?? null,
  });
  if (error) return { stored: false, reason: error.message };
  const reason = String(data ?? "stored");
  return { stored: reason === "stored" || reason === "duplicate", reason };
}

export async function ingestReceivedEmail(
  emailId: string,
  fallback?: {
    from?: string;
    to?: string[] | string;
    receivedFor?: string[] | string;
    subject?: string;
    body?: string;
  }
) {
  const email = await fetchReceivedEmail(emailId);
  if (email) {
    return storeInboundEmail({
      from: email.from,
      to: email.to,
      receivedFor: email.receivedFor,
      subject: email.subject,
      body: email.text,
      resendId: emailId,
    });
  }
  const from = String(fallback?.from ?? "").trim();
  const to = extractAddresses(fallback?.to);
  const receivedFor = extractAddresses(fallback?.receivedFor);
  if (from && (to.length || receivedFor.length)) {
    return storeInboundEmail({
      from,
      to,
      receivedFor,
      subject: String(fallback?.subject ?? "Sans objet"),
      body: String(fallback?.body ?? "").trim() || "(contenu à récupérer)",
      resendId: emailId,
    });
  }
  return { stored: false, reason: "fetch_failed" };
}
