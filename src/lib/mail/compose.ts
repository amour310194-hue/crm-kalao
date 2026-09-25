/** Préparation des fenêtres de rédaction : nouveau, répondre, répondre à tous, transférer, reprendre un brouillon. */

import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";
import { forwardHtml, forwardSubject, replyQuoteHtml, replySubject } from "@/lib/mail/html";
import type { ComposeAttachment, ComposeInput, MailboxKey, MailMessage } from "@/lib/mail/types";

export type SeedBase = {
  key: string;
  draftId?: string | null;
  mailbox: MailboxKey;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  threadId?: string | null;
  inReplyToId?: string | null;
  contactId?: string | null;
  companyId?: string | null;
  dossierId?: string | null;
  invoiceId?: string | null;
  attachments: ComposeAttachment[];
  title?: string;
};

let counter = 0;
export function seedKey(): string {
  counter += 1;
  return `c${Date.now().toString(36)}${counter}`;
}

export function signatureBlock(signature: string): string {
  return signature.trim() ? `<br><div class="kalao_signature">-- <br>${signature}</div>` : "";
}

/** Boîte d'envoi par défaut : celle du mail d'origine si on peut l'utiliser, sinon la boîte perso. */
export function sendingMailbox(preferred: MailboxKey, available: MailboxKey[]): MailboxKey {
  if (preferred !== "triage" && available.includes(preferred)) return preferred;
  return available.includes("personal") ? "personal" : available.find((b) => b !== "triage") ?? "personal";
}

export function newSeed(input: {
  mailbox: MailboxKey;
  available: MailboxKey[];
  signature: string;
  to?: string[];
  subject?: string;
  contactId?: string | null;
  companyId?: string | null;
  dossierId?: string | null;
  invoiceId?: string | null;
}): SeedBase {
  return {
    key: seedKey(),
    mailbox: sendingMailbox(input.mailbox, input.available),
    to: input.to ?? [],
    cc: [],
    bcc: [],
    subject: input.subject ?? "",
    html: `<br>${signatureBlock(input.signature)}`,
    contactId: input.contactId ?? null,
    companyId: input.companyId ?? null,
    dossierId: input.dossierId ?? null,
    invoiceId: input.invoiceId ?? null,
    attachments: [],
  };
}

export function ownAddresses(workEmail: string): string[] {
  return [workEmail.toLowerCase(), KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL, "noreply@groupe-kalao.com"];
}

export function replySeed(
  msg: MailMessage,
  mode: "reply" | "replyAll",
  ctx: { available: MailboxKey[]; signature: string; workEmail: string }
): SeedBase {
  const own = ownAddresses(ctx.workEmail);
  const original = msg.to_emails.length ? msg.to_emails : [msg.to_email];
  // Répondre à un message qu'on a soi-même envoyé : on écrit aux mêmes destinataires.
  const primary = msg.direction === "out" ? original : [msg.from_email];
  let to = primary.filter((e) => !own.includes(e.toLowerCase()));
  if (!to.length) to = primary;
  let cc: string[] = [];
  if (mode === "replyAll") {
    const others = [...(msg.direction === "out" ? [] : original), ...msg.cc_emails];
    cc = others.filter((e) => !own.includes(e.toLowerCase()) && !to.includes(e));
  }
  return {
    key: seedKey(),
    mailbox: sendingMailbox(msg.mailbox, ctx.available),
    to,
    cc,
    bcc: [],
    subject: replySubject(msg.subject),
    html: `<br>${signatureBlock(ctx.signature)}${replyQuoteHtml(msg)}`,
    threadId: msg.thread_id,
    inReplyToId: msg.id,
    contactId: msg.contact_id,
    companyId: msg.company_id,
    dossierId: msg.dossier_id,
    attachments: [],
    title: replySubject(msg.subject),
  };
}

export function forwardSeed(msg: MailMessage, ctx: { available: MailboxKey[]; signature: string }): SeedBase {
  return {
    key: seedKey(),
    mailbox: sendingMailbox(msg.mailbox, ctx.available),
    to: [],
    cc: [],
    bcc: [],
    subject: forwardSubject(msg.subject),
    html: `<br>${signatureBlock(ctx.signature)}${forwardHtml(msg)}`,
    threadId: msg.thread_id,
    inReplyToId: msg.id,
    contactId: msg.contact_id,
    companyId: msg.company_id,
    dossierId: msg.dossier_id,
    attachments: msg.attachments
      .filter((a) => !a.inline)
      .map((a) => ({
        key: `src-${a.id}`,
        filename: a.filename,
        size: a.size_bytes,
        contentType: a.content_type ?? undefined,
        sourceAttachmentId: a.id,
      })),
    title: forwardSubject(msg.subject),
  };
}

export function draftSeed(msg: MailMessage): SeedBase {
  return {
    key: seedKey(),
    draftId: msg.id,
    mailbox: msg.mailbox,
    to: msg.to_emails.length ? msg.to_emails : msg.to_email ? [msg.to_email] : [],
    cc: msg.cc_emails,
    bcc: msg.bcc_emails,
    subject: msg.subject === "(sans objet)" ? "" : msg.subject,
    html: msg.html ?? "",
    threadId: msg.thread_id,
    inReplyToId: msg.in_reply_to,
    contactId: msg.contact_id,
    companyId: msg.company_id,
    dossierId: msg.dossier_id,
    invoiceId: msg.invoice_id,
    attachments: msg.attachments.map((a) => ({
      key: `src-${a.id}`,
      filename: a.filename,
      size: a.size_bytes,
      contentType: a.content_type ?? undefined,
      sourceAttachmentId: a.id,
    })),
    title: "Brouillon",
  };
}

/** Rouvre une fenêtre à partir d'un envoi annulé ou raté. */
export function seedFromInput(input: ComposeInput): SeedBase {
  return {
    key: seedKey(),
    draftId: input.draftId ?? null,
    mailbox: input.mailbox,
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    subject: input.subject,
    html: input.html,
    threadId: input.threadId ?? null,
    inReplyToId: input.inReplyToId ?? null,
    contactId: input.contactId ?? null,
    companyId: input.companyId ?? null,
    dossierId: input.dossierId ?? null,
    invoiceId: input.invoiceId ?? null,
    attachments: input.attachments.map((a, i) => ({
      key: `re-${i}-${a.filename}`,
      filename: a.filename,
      size: a.size,
      contentType: a.contentType,
      path: a.path,
      sourceAttachmentId: a.sourceAttachmentId,
    })),
  };
}
