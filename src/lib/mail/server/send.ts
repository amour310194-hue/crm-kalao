/** Envoi : validation, construction du message Resend, pièces jointes, persistance. */

import type { SupabaseClient } from "@supabase/supabase-js";
import { isValidEmail, uniqueEmails } from "@/lib/mail/format";
import { htmlToText, makeMessageId, makeSnippet, wrapOutgoingHtml } from "@/lib/mail/html";
import {
  MAIL_BUCKET,
  MAX_ATTACHMENT_BYTES,
  MAX_RECIPIENTS,
  MAX_TOTAL_ATTACHMENT_BYTES,
  type ComposeInput,
} from "@/lib/mail/types";
import { resendSend, type ResendSendBody } from "@/lib/mail/server/resend";
import type { MailContext } from "@/lib/mail/server/context";
import { MailHttpError } from "@/lib/mail/server/context";

export type Recipients = { to: string[]; cc: string[]; bcc: string[] };

export function cleanRecipients(input: { to?: unknown; cc?: unknown; bcc?: unknown }): Recipients {
  const list = (value: unknown) =>
    uniqueEmails((Array.isArray(value) ? value : typeof value === "string" ? [value] : []).map(String));
  const to = list(input.to);
  const cc = list(input.cc).filter((e) => !to.includes(e));
  const bcc = list(input.bcc).filter((e) => !to.includes(e) && !cc.includes(e));
  return { to, cc, bcc };
}

export function recipientErrors(r: Recipients): string[] {
  const errors: string[] = [];
  const all = [...r.to, ...r.cc, ...r.bcc];
  if (!r.to.length && !r.cc.length && !r.bcc.length) errors.push("Ajoutez au moins un destinataire.");
  const bad = all.filter((e) => !isValidEmail(e));
  if (bad.length) errors.push(`Adresse invalide : ${bad.join(", ")}`);
  if (all.length > MAX_RECIPIENTS) errors.push(`${MAX_RECIPIENTS} destinataires au maximum par envoi.`);
  return errors;
}

/** Date d'envoi programmé : dans le futur (≥ 1 min) et au plus 30 jours. */
export function checkScheduledAt(value: string | null | undefined, now = Date.now()): string | null {
  if (!value) return null;
  const t = new Date(value).getTime();
  if (!Number.isFinite(t)) throw new MailHttpError(400, "Date d'envoi programmé invalide.");
  if (t < now + 60 * 1000) return null;
  if (t > now + 30 * 86400 * 1000) throw new MailHttpError(400, "L'envoi programmé est limité à 30 jours.");
  return new Date(t).toISOString();
}

export type AttachmentRow = {
  id?: string;
  filename: string;
  content_type: string | null;
  size_bytes: number;
  storage_path: string;
};

/**
 * Pièces jointes autorisées : fichiers envoyés par l'utilisateur lui-même (outgoing/<uid>/…)
 * ou pièces d'un mail qu'il peut lire (transfert).
 */
export async function resolveAttachments(
  ctx: MailContext,
  items: ComposeInput["attachments"]
): Promise<AttachmentRow[]> {
  const rows: AttachmentRow[] = [];
  const sourceIds = items.map((i) => i.sourceAttachmentId).filter((v): v is string => Boolean(v));
  const sources = new Map<string, AttachmentRow>();
  if (sourceIds.length) {
    const { data, error } = await ctx.userDb
      .from("crm_email_attachments")
      .select("id, filename, content_type, size_bytes, storage_path")
      .in("id", sourceIds);
    if (error) throw new MailHttpError(500, error.message);
    for (const row of data ?? []) sources.set(row.id, row as AttachmentRow);
  }
  const prefix = `outgoing/${ctx.userId}/`;
  for (const item of items.slice(0, 20)) {
    if (item.sourceAttachmentId) {
      const src = sources.get(item.sourceAttachmentId);
      if (!src) throw new MailHttpError(403, "Pièce jointe inaccessible.");
      rows.push({ filename: src.filename, content_type: src.content_type, size_bytes: src.size_bytes, storage_path: src.storage_path });
      continue;
    }
    const path = String(item.path ?? "");
    if (!path.startsWith(prefix) || path.includes("..")) throw new MailHttpError(403, "Pièce jointe refusée.");
    const size = Number(item.size) || 0;
    if (size > MAX_ATTACHMENT_BYTES) throw new MailHttpError(413, `${item.filename} dépasse 25 Mo.`);
    rows.push({
      filename: String(item.filename || "fichier").slice(0, 200),
      content_type: item.contentType || null,
      size_bytes: size,
      storage_path: path,
    });
  }
  const total = rows.reduce((sum, r) => sum + (r.size_bytes || 0), 0);
  if (total > MAX_TOTAL_ATTACHMENT_BYTES) {
    throw new MailHttpError(413, "Les pièces jointes dépassent 25 Mo au total. Partagez un lien pour les gros fichiers.");
  }
  return rows;
}

/**
 * Synchronise les pièces jointes enregistrées d'un mail (brouillon ou envoi).
 * Les lignes déjà présentes gardent leur id : un brouillon rouvert peut être réenregistré sans perdre ses pièces.
 */
export async function replaceAttachmentRows(
  admin: SupabaseClient,
  emailId: string,
  rows: AttachmentRow[]
): Promise<void> {
  const { data: existing } = await admin
    .from("crm_email_attachments")
    .select("id, storage_path")
    .eq("email_id", emailId);
  const wanted = new Set(rows.map((r) => r.storage_path));
  const have = new Set((existing ?? []).map((r) => String(r.storage_path)));
  const stale = (existing ?? []).filter((r) => !wanted.has(String(r.storage_path))).map((r) => r.id);
  if (stale.length) await admin.from("crm_email_attachments").delete().in("id", stale);
  const fresh = rows.filter((r) => !have.has(r.storage_path));
  if (!fresh.length) return;
  const { error } = await admin.from("crm_email_attachments").insert(
    fresh.map((r) => ({
      email_id: emailId,
      filename: r.filename,
      content_type: r.content_type,
      size_bytes: r.size_bytes,
      storage_path: r.storage_path,
    }))
  );
  if (error) throw new MailHttpError(500, error.message);
}

export type SenderKind = "personal" | "contact" | "noreply";

export function buildResendBody(input: {
  kind: SenderKind;
  from: string;
  replyTo: string;
  recipients: Recipients;
  subject: string;
  bodyHtml: string;
  messageId: string;
  inReplyTo?: string | null;
  references?: string[];
  attachments?: { filename: string; path: string; content_type?: string }[];
  scheduledAt?: string | null;
  emailId: string;
}): ResendSendBody {
  const html = wrapOutgoingHtml(input.bodyHtml, input.kind);
  const headers: Record<string, string> = { "Message-ID": input.messageId };
  if (input.inReplyTo) headers["In-Reply-To"] = input.inReplyTo;
  const refs = [...(input.references ?? []), ...(input.inReplyTo ? [input.inReplyTo] : [])];
  const uniqueRefs = [...new Set(refs)].slice(-20);
  if (uniqueRefs.length) headers.References = uniqueRefs.join(" ");
  if (input.kind === "noreply") {
    headers["Auto-Submitted"] = "auto-generated";
    headers["X-Auto-Response-Suppress"] = "All";
  }
  const body: ResendSendBody = {
    from: input.from,
    to: input.recipients.to,
    subject: input.subject || "(sans objet)",
    html,
    text: htmlToText(input.bodyHtml),
    reply_to: input.replyTo,
    headers,
    tags: [{ name: "crm_email_id", value: input.emailId }],
  };
  if (input.recipients.cc.length) body.cc = input.recipients.cc;
  if (input.recipients.bcc.length) body.bcc = input.recipients.bcc;
  if (input.attachments?.length) {
    body.attachments = input.attachments.map((a) => ({
      filename: a.filename,
      path: a.path,
      content_type: a.content_type,
    }));
  }
  if (input.scheduledAt) body.scheduled_at = input.scheduledAt;
  return body;
}

/** URL signées que Resend télécharge au moment de l'envoi (valables jusqu'au lendemain de l'envoi programmé). */
export async function signedAttachmentUrls(
  admin: SupabaseClient,
  rows: AttachmentRow[],
  scheduledAt?: string | null
): Promise<{ filename: string; path: string; content_type?: string }[]> {
  const base = scheduledAt ? Math.max(0, (new Date(scheduledAt).getTime() - Date.now()) / 1000) : 0;
  const expires = Math.ceil(base + 86400);
  const out: { filename: string; path: string; content_type?: string }[] = [];
  for (const row of rows) {
    const { data, error } = await admin.storage.from(MAIL_BUCKET).createSignedUrl(row.storage_path, expires);
    if (error || !data?.signedUrl) throw new MailHttpError(500, `Pièce jointe introuvable : ${row.filename}`);
    out.push({ filename: row.filename, path: data.signedUrl, content_type: row.content_type ?? undefined });
  }
  return out;
}

/** Envoie ; si Resend refuse l'en-tête Message-ID personnalisé, on réessaie sans. */
export async function deliver(body: ResendSendBody, emailId: string) {
  let res = await resendSend(body, emailId);
  if (!res.ok && res.status === 422 && /header|message-id/i.test(res.detail) && body.headers?.["Message-ID"]) {
    const headers = { ...body.headers };
    delete headers["Message-ID"];
    res = await resendSend({ ...body, headers }, `${emailId}-2`);
  }
  return res;
}

export function outgoingSummary(html: string) {
  const text = htmlToText(html);
  return { text, snippet: makeSnippet(text) };
}

export { makeMessageId };
