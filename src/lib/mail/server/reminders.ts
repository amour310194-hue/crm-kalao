/** Relances automatiques de factures : règles explicites, une seule relance par facture et par règle. */

import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { KALAO_NOREPLY_EMAIL, KALAO_NOREPLY_FROM } from "@/lib/org";
import { makeMessageId, textToHtml } from "@/lib/mail/html";
import { buildResendBody, deliver, outgoingSummary } from "@/lib/mail/server/send";

export type ReminderKind = "invoice_due_3d" | "invoice_overdue_7d";

export type InvoiceForReminder = {
  id: string;
  number: string | null;
  amount: number;
  paid_amount: number;
  due_date: string | null;
  status: string;
  is_conditional?: boolean | null;
  contact_id: string | null;
  company_id: string | null;
  dossier_id: string | null;
  companies?: { name: string | null; email: string | null } | null;
  contacts?: { first_name: string | null; last_name: string | null; email: string | null } | null;
};

export type ReminderResult = { kind: ReminderKind; invoice: string; to: string; sent: boolean; detail?: string };

/** Date du jour à Douala, décalée de `days`, au format AAAA-MM-JJ. */
export function doualaDay(days = 0, now = new Date()): string {
  const shifted = new Date(now.getTime() + days * 86400 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Douala" }).format(shifted);
}

export function reminderKindFor(invoice: InvoiceForReminder, now = new Date()): ReminderKind | null {
  const rest = Number(invoice.amount) - Number(invoice.paid_amount);
  if (!invoice.due_date || rest <= 0) return null;
  if (invoice.is_conditional) return null;
  if (["cancelled", "paid", "draft"].includes(invoice.status)) return null;
  const due = invoice.due_date.slice(0, 10);
  if (due === doualaDay(3, now)) return "invoice_due_3d";
  if (due === doualaDay(-7, now)) return "invoice_overdue_7d";
  return null;
}

const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const SPACES = /[  ]/g;
const fcfa = (n: number) => `${money.format(Math.round(n)).replace(SPACES, " ")} FCFA`;

export function reminderContent(kind: ReminderKind, invoice: InvoiceForReminder) {
  const name =
    [invoice.contacts?.first_name, invoice.contacts?.last_name].filter(Boolean).join(" ") ||
    invoice.companies?.name ||
    "Madame, Monsieur";
  const number = invoice.number ?? "";
  const rest = fcfa(Number(invoice.amount) - Number(invoice.paid_amount));
  const due = new Date(`${String(invoice.due_date).slice(0, 10)}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const subject =
    kind === "invoice_due_3d"
      ? `Rappel : la facture ${number} arrive à échéance le ${due}`
      : `Relance : facture ${number} en attente de règlement`;
  const lines =
    kind === "invoice_due_3d"
      ? [
          `Bonjour ${name},`,
          "",
          `Nous vous rappelons que la facture ${number} arrive à échéance le ${due}.`,
          `Reste à payer : ${rest}.`,
          "",
          "Si le règlement est déjà en cours, merci de ne pas tenir compte de ce message.",
          "",
          "Cordialement,",
          "Groupe Kalao",
        ]
      : [
          `Bonjour ${name},`,
          "",
          `Sauf erreur de notre part, la facture ${number}, échue le ${due}, reste impayée.`,
          `Reste à payer : ${rest}.`,
          "",
          "Merci de procéder au règlement ou de nous contacter pour convenir d'un échéancier.",
          "",
          "Cordialement,",
          "Groupe Kalao",
        ];
  return { subject, html: textToHtml(lines.join("\n")) };
}

export async function runInvoiceReminders(
  admin: SupabaseClient,
  options: { send: boolean; now?: Date }
): Promise<ReminderResult[]> {
  const now = options.now ?? new Date();
  const days = [doualaDay(3, now), doualaDay(-7, now)];
  const { data } = await admin
    .from("invoices")
    .select(
      "id, number, amount, paid_amount, due_date, status, is_conditional, contact_id, company_id, dossier_id, companies(name, email), contacts(first_name, last_name, email)"
    )
    .in("due_date", days);
  const out: ReminderResult[] = [];
  for (const invoice of (data ?? []) as unknown as InvoiceForReminder[]) {
    const kind = reminderKindFor(invoice, now);
    if (!kind) continue;
    const label = invoice.number ?? invoice.id;
    const to = (invoice.contacts?.email || invoice.companies?.email || "").trim().toLowerCase();
    if (!to) {
      out.push({ kind, invoice: label, to: "", sent: false, detail: "pas d'e-mail client" });
      continue;
    }
    const { data: already } = await admin
      .from("crm_mail_reminders")
      .select("id")
      .eq("kind", kind)
      .eq("ref_id", invoice.id)
      .maybeSingle();
    if (already) continue;
    const { data: blocked } = await admin.from("crm_mail_suppressions").select("email").eq("email", to).maybeSingle();
    if (blocked) {
      out.push({ kind, invoice: label, to, sent: false, detail: "adresse rejetée précédemment" });
      continue;
    }
    if (!options.send) {
      out.push({ kind, invoice: label, to, sent: false, detail: "simulation (MAIL_REMINDERS_ENABLED absent)" });
      continue;
    }
    // Réserve la relance d'abord : deux exécutions simultanées n'envoient pas deux fois.
    const { error: lockErr } = await admin.from("crm_mail_reminders").insert({ kind, ref_id: invoice.id, sent_to: to });
    if (lockErr) continue;

    const id = randomUUID();
    const content = reminderContent(kind, invoice);
    const summary = outgoingSummary(content.html);
    await admin.from("crm_emails").insert({
      id,
      thread_id: id,
      mailbox: "noreply",
      direction: "out",
      from_email: KALAO_NOREPLY_EMAIL,
      from_name: "CRM Kalao",
      to_email: to,
      to_emails: [to],
      subject: content.subject,
      body: summary.text,
      html: content.html,
      snippet: summary.snippet,
      message_id: makeMessageId(id),
      contact_id: invoice.contact_id,
      company_id: invoice.company_id,
      dossier_id: invoice.dossier_id,
      invoice_id: invoice.id,
      folder: "sent",
      status: "queued",
      delivery_status: "queued",
      unread: false,
    });
    const res = await deliver(
      buildResendBody({
        kind: "noreply",
        from: process.env.RESEND_FROM || KALAO_NOREPLY_FROM,
        replyTo: KALAO_NOREPLY_EMAIL,
        recipients: { to: [to], cc: [], bcc: [] },
        subject: content.subject,
        bodyHtml: content.html,
        messageId: makeMessageId(id),
        emailId: id,
      }),
      id
    );
    const stamp = new Date().toISOString();
    await admin
      .from("crm_emails")
      .update(
        res.ok
          ? { status: "sent", delivery_status: "sent", resend_id: res.data?.id ?? null, sent_at: stamp, delivery_updated_at: stamp }
          : { status: "failed", delivery_status: "failed", delivery_detail: res.detail, delivery_updated_at: stamp }
      )
      .eq("id", id);
    await admin.from("crm_mail_reminders").update({ email_id: id }).eq("kind", kind).eq("ref_id", invoice.id);
    out.push({ kind, invoice: label, to, sent: res.ok, detail: res.ok ? undefined : res.detail });
  }
  return out;
}
