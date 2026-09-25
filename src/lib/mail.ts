/**
 * Envoi simple depuis le reste du CRM (relance de facture, etc.).
 * Passe par la même API serveur que la messagerie : l'historique est écrit côté serveur.
 */

import { createSupabaseMailApi } from "@/lib/mail/client";
import { textToHtml } from "@/lib/mail/html";
import type { MailboxKey } from "@/lib/mail/types";

export type { MailboxKey };

export type SendCrmResult = {
  dispatched: boolean;
  to: string;
  reason: string;
  detail?: string;
  id?: string;
};

export async function sendCrmEmail(input: {
  mailbox: Exclude<MailboxKey, "triage">;
  to: string;
  subject: string;
  body: string;
  companyId?: string | null;
  contactId?: string | null;
  invoiceId?: string | null;
}): Promise<SendCrmResult> {
  const to = input.to.trim();
  if (!to) return { dispatched: false, to, reason: "missing_to" };
  const res = await createSupabaseMailApi().send({
    mailbox: input.mailbox,
    to: [to],
    cc: [],
    bcc: [],
    subject: input.subject,
    html: textToHtml(input.body),
    companyId: input.companyId ?? null,
    contactId: input.contactId ?? null,
    invoiceId: input.invoiceId ?? null,
    attachments: [],
  });
  return { dispatched: res.dispatched, to, reason: res.reason, detail: res.detail, id: res.id };
}

export function explainSend(result: SendCrmResult): string {
  if (result.reason === "missing_to") return "Ce client n'a pas d'e-mail.";
  if (result.dispatched) return `Envoyé vers ${result.to}.`;
  if (result.detail) return `Envoi refusé : ${result.detail}`;
  return `Envoi non parti vers ${result.to}.`;
}
