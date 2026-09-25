/** Préparation d'un mail sortant (brouillon ou envoi) : droits, fil, destinataires, rattachement. */

import { randomUUID } from "crypto";
import { authorizeSender } from "@/lib/mail-send-auth";
import { makeMessageId, textToHtml } from "@/lib/mail/html";
import { isMailboxKey, MAIL_BUCKET, type ComposeInput, type MailboxKey } from "@/lib/mail/types";
import { MailHttpError, type MailContext } from "@/lib/mail/server/context";
import { linkParty } from "@/lib/mail/server/store";
import {
  cleanRecipients,
  outgoingSummary,
  recipientErrors,
  replaceAttachmentRows,
  resolveAttachments,
  type AttachmentRow,
  type Recipients,
  type SenderKind,
} from "@/lib/mail/server/send";

export type RawCompose = Partial<ComposeInput> & { body?: string; from?: string };

export type PreparedOutgoing = {
  id: string;
  isNew: boolean;
  threadId: string;
  mailbox: Exclude<MailboxKey, "triage">;
  kind: SenderKind;
  from: string;
  fromAddress: string;
  recipients: Recipients;
  subject: string;
  html: string;
  messageId: string;
  inReplyTo: string | null;
  references: string[];
  attachments: AttachmentRow[];
  row: Record<string, unknown>;
};

type ParentRow = {
  id: string;
  thread_id: string | null;
  message_id: string | null;
  references_header: string[] | null;
  contact_id: string | null;
  company_id: string | null;
  dossier_id: string | null;
};

export async function prepareOutgoing(
  ctx: MailContext,
  raw: RawCompose,
  mode: "draft" | "send"
): Promise<PreparedOutgoing> {
  const requested = isMailboxKey(raw.mailbox) ? raw.mailbox : "personal";
  if (requested === "triage") throw new MailHttpError(403, "La file « À trier » ne peut pas envoyer : déplacez d'abord le mail vers une boîte.");
  const authz = authorizeSender({
    mailbox: requested,
    requestedFrom: raw.from,
    workEmail: ctx.workEmail,
    fullName: ctx.fullName,
    allowedShared: ctx.allowedShared,
  });
  if (!authz.ok) throw new MailHttpError(403, "Cette boîte ne vous est pas ouverte.");
  const mailbox = authz.mailbox;
  const fromAddress = (authz.from.match(/<([^>]+)>/)?.[1] ?? authz.from).trim().toLowerCase();

  const recipients = cleanRecipients({ to: raw.to, cc: raw.cc, bcc: raw.bcc });
  if (mode === "send") {
    const errors = recipientErrors(recipients);
    if (errors.length) throw new MailHttpError(400, errors.join(" "));
  }

  let existing: { id: string; thread_id: string | null; message_id: string | null; created_by: string | null; folder: string } | null = null;
  if (raw.draftId) {
    const { data } = await ctx.userDb
      .from("crm_emails")
      .select("id, thread_id, message_id, created_by, folder")
      .eq("id", raw.draftId)
      .maybeSingle();
    if (!data || data.folder !== "drafts" || (data.created_by && data.created_by !== ctx.userId)) {
      throw new MailHttpError(404, "Brouillon introuvable.");
    }
    existing = data;
  }

  let parent: ParentRow | null = null;
  if (raw.inReplyToId) {
    const { data } = await ctx.userDb
      .from("crm_emails")
      .select("id, thread_id, message_id, references_header, contact_id, company_id, dossier_id")
      .eq("id", raw.inReplyToId)
      .maybeSingle();
    parent = (data as ParentRow | null) ?? null;
  }

  const id = existing?.id ?? randomUUID();
  const threadId = parent ? parent.thread_id ?? parent.id : existing?.thread_id ?? raw.threadId ?? id;
  const messageId = existing?.message_id || makeMessageId(id);
  const inReplyTo = parent?.message_id ?? null;
  const references = parent ? [...(parent.references_header ?? []), ...(parent.message_id ? [parent.message_id] : [])] : [];

  const html = (raw.html ?? "").trim() || (raw.body ? textToHtml(raw.body) : "");
  if (mode === "send" && !html.replace(/<[^>]+>/g, "").trim() && !(raw.attachments ?? []).length) {
    throw new MailHttpError(400, "Le message est vide.");
  }
  const subject = String(raw.subject ?? "").trim().slice(0, 500);
  const attachments = await resolveAttachments(ctx, raw.attachments ?? []);
  const party = await linkParty(ctx.admin, [...recipients.to, ...recipients.cc], {
    contact_id: raw.contactId ?? parent?.contact_id ?? null,
    company_id: raw.companyId ?? parent?.company_id ?? null,
    dossier_id: raw.dossierId ?? parent?.dossier_id ?? null,
  });
  const summary = outgoingSummary(html);

  const row: Record<string, unknown> = {
    id,
    thread_id: threadId,
    mailbox,
    owner_id: mailbox === "personal" ? ctx.userId : null,
    direction: "out",
    from_email: fromAddress,
    from_name: mailbox === "personal" ? ctx.fullName : mailbox === "contact" ? "Contact Kalao" : "CRM Kalao",
    to_email: recipients.to[0] ?? recipients.cc[0] ?? recipients.bcc[0] ?? "",
    to_emails: recipients.to,
    cc_emails: recipients.cc,
    bcc_emails: recipients.bcc,
    subject: subject || "(sans objet)",
    body: summary.text || "",
    html,
    snippet: summary.snippet,
    message_id: messageId,
    in_reply_to: parent?.id ?? null,
    in_reply_to_header: inReplyTo,
    references_header: references,
    has_attachments: attachments.length > 0,
    ...party,
    invoice_id: raw.invoiceId ?? null,
    created_by: ctx.userId,
    unread: false,
    starred: false,
    important: false,
  };

  return {
    id,
    isNew: !existing,
    threadId,
    mailbox,
    kind: mailbox,
    from: authz.from,
    fromAddress,
    recipients,
    subject: subject || "(sans objet)",
    html,
    messageId,
    inReplyTo,
    references,
    attachments,
    row,
  };
}

export async function persistOutgoing(
  ctx: MailContext,
  prepared: PreparedOutgoing,
  extra: Record<string, unknown>
): Promise<void> {
  const row = { ...prepared.row, ...extra };
  const { error } = prepared.isNew
    ? await ctx.admin.from("crm_emails").insert(row)
    : await ctx.admin.from("crm_emails").update(row).eq("id", prepared.id);
  if (error) throw new MailHttpError(500, error.message);
  await replaceAttachmentRows(ctx.admin, prepared.id, prepared.attachments);
}

/** Supprime un brouillon et les fichiers qu'il était seul à utiliser. */
export async function discardDraft(ctx: MailContext, draftId: string): Promise<void> {
  const { data } = await ctx.userDb
    .from("crm_emails")
    .select("id, folder, created_by")
    .eq("id", draftId)
    .maybeSingle();
  if (!data || data.folder !== "drafts" || (data.created_by && data.created_by !== ctx.userId)) {
    throw new MailHttpError(404, "Brouillon introuvable.");
  }
  const { data: files } = await ctx.admin
    .from("crm_email_attachments")
    .select("storage_path")
    .eq("email_id", draftId);
  const { error } = await ctx.admin.from("crm_emails").delete().eq("id", draftId);
  if (error) throw new MailHttpError(500, error.message);
  const own = (files ?? [])
    .map((f) => String(f.storage_path))
    .filter((p) => p.startsWith(`outgoing/${ctx.userId}/`));
  const orphans: string[] = [];
  for (const path of own) {
    const { count } = await ctx.admin
      .from("crm_email_attachments")
      .select("id", { count: "exact", head: true })
      .eq("storage_path", path);
    if (!count) orphans.push(path);
  }
  if (orphans.length) await ctx.admin.storage.from(MAIL_BUCKET).remove(orphans);
}
