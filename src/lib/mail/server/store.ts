/** Écritures serveur partagées : fil de discussion, rattachement client/dossier, extraits. */

import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeSubject } from "@/lib/mail/html";

export type PartyLink = {
  contact_id: string | null;
  company_id: string | null;
  dossier_id: string | null;
};

const CLOSED_DOSSIER = ["done", "cancelled"];

/** Rattache une adresse à un contact, sinon une entreprise, puis au dossier ouvert le plus récent. */
export async function linkParty(
  admin: SupabaseClient,
  emails: string[],
  preset?: Partial<PartyLink>
): Promise<PartyLink> {
  let contactId = preset?.contact_id ?? null;
  let companyId = preset?.company_id ?? null;
  const list = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter((e) => e.includes("@")))];
  if (!contactId && list.length) {
    for (const email of list) {
      const { data } = await admin
        .from("contacts")
        .select("id, company_id")
        .ilike("email", email)
        .limit(1)
        .maybeSingle();
      if (data) {
        contactId = data.id;
        companyId = companyId ?? data.company_id ?? null;
        break;
      }
    }
  }
  if (!companyId && list.length) {
    for (const email of list) {
      const { data } = await admin.from("companies").select("id").ilike("email", email).limit(1).maybeSingle();
      if (data) {
        companyId = data.id;
        break;
      }
    }
  }
  let dossierId = preset?.dossier_id ?? null;
  if (!dossierId && (contactId || companyId)) {
    let q = admin
      .from("dossiers")
      .select("id, status")
      .not("status", "in", `(${CLOSED_DOSSIER.join(",")})`)
      .order("updated_at", { ascending: false })
      .limit(1);
    q = contactId ? q.eq("contact_id", contactId) : q.eq("company_id", companyId as string);
    const { data } = await q.maybeSingle();
    dossierId = data?.id ?? null;
  }
  return { contact_id: contactId, company_id: companyId, dossier_id: dossierId };
}

/**
 * Retrouve le fil d'un message : d'abord par en-têtes (In-Reply-To / References → message_id connus),
 * sinon par objet normalisé (« Re: … ») avec le même correspondant dans les 60 derniers jours.
 */
export async function resolveThreadId(
  admin: SupabaseClient,
  input: {
    mailbox: string;
    subject: string;
    inReplyTo?: string | null;
    references?: string[];
    correspondent: string;
  }
): Promise<string | null> {
  const ids = [input.inReplyTo, ...(input.references ?? [])]
    .map((v) => (v ?? "").trim())
    .filter(Boolean)
    .slice(-20);
  if (ids.length) {
    const { data } = await admin
      .from("crm_emails")
      .select("id, thread_id")
      .in("message_id", ids)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data.thread_id ?? data.id;
  }
  const normalized = normalizeSubject(input.subject);
  const isReply = normalized !== input.subject.trim().toLowerCase();
  if (!isReply || normalized.length < 3 || !input.correspondent) return null;
  const since = new Date(Date.now() - 60 * 86400 * 1000).toISOString();
  const who = input.correspondent.toLowerCase();
  const { data } = await admin
    .from("crm_emails")
    .select("id, thread_id, subject, from_email, to_email, to_emails")
    .eq("mailbox", input.mailbox)
    .gte("created_at", since)
    .ilike("subject", `%${normalized.replace(/[%_]/g, "")}%`)
    .order("created_at", { ascending: false })
    .limit(30);
  const match = (data ?? []).find(
    (row) =>
      normalizeSubject(String(row.subject)) === normalized &&
      (String(row.from_email).toLowerCase() === who ||
        String(row.to_email).toLowerCase() === who ||
        ((row.to_emails as string[] | null) ?? []).map((e) => e.toLowerCase()).includes(who))
  );
  return match ? match.thread_id ?? match.id : null;
}

/** Enregistre (ou met à jour) l'état personnel d'une liste de mails. */
export async function upsertUserState(
  admin: SupabaseClient,
  userId: string,
  emailIds: string[],
  patch: { read?: boolean; starred?: boolean; important?: boolean; snoozed_until?: string | null }
): Promise<void> {
  if (!emailIds.length) return;
  const rows = emailIds.map((email_id) => ({
    email_id,
    user_id: userId,
    ...patch,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await admin
    .from("crm_email_user_state")
    .upsert(rows, { onConflict: "email_id,user_id", ignoreDuplicates: false });
  if (error) throw new Error(error.message);
}
