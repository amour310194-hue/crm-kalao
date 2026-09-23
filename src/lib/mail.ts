import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  KALAO_CONTACT_EMAIL,
  KALAO_NOREPLY_EMAIL,
  KALAO_NOREPLY_FROM,
} from "@/lib/org";

export type MailboxKey = "noreply" | "contact" | "personal";
export type MailFolder = "inbox" | "sent" | MailboxKey;

export type CrmEmailRow = {
  id: string;
  mailbox: MailboxKey;
  owner_id: string | null;
  direction: "in" | "out";
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  company_id: string | null;
  contact_id: string | null;
  invoice_id: string | null;
  resend_id: string | null;
  status: "stored" | "sent" | "failed";
  created_at: string;
  companies?: { name: string | null } | null;
  contacts?: { first_name: string; last_name: string; email: string | null } | null;
};

export type SessionMail = {
  userId: string;
  fullName: string;
  loginEmail: string;
  workEmail: string;
};

export type SendCrmResult = {
  dispatched: boolean;
  to: string;
  reason: string;
  detail?: string;
  id?: string;
};

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export function mailboxLabel(key: MailboxKey): string {
  if (key === "contact") return "Contact";
  if (key === "personal") return "Ma boîte";
  return "No-reply";
}

export function folderLabel(folder: MailFolder): string {
  if (folder === "inbox") return "Reçus";
  if (folder === "sent") return "Envoyés";
  return mailboxLabel(folder);
}

export function mailboxFrom(key: MailboxKey, session: SessionMail): { from: string; address: string } {
  if (key === "contact") {
    return { from: `Contact Kalao <${KALAO_CONTACT_EMAIL}>`, address: KALAO_CONTACT_EMAIL };
  }
  if (key === "personal") {
    return { from: `${session.fullName} <${session.workEmail}>`, address: session.workEmail };
  }
  return { from: KALAO_NOREPLY_FROM, address: KALAO_NOREPLY_EMAIL };
}

export function emailParty(row: CrmEmailRow): string {
  const contact = row.contacts
    ? `${row.contacts.first_name} ${row.contacts.last_name}`.trim()
    : "";
  return contact || row.companies?.name || (row.direction === "out" ? row.to_email : row.from_email);
}

export function filterEmails(rows: CrmEmailRow[], folder: MailFolder): CrmEmailRow[] {
  if (folder === "inbox") return rows.filter((row) => row.direction === "in");
  if (folder === "sent") return rows.filter((row) => row.direction === "out");
  return rows.filter((row) => row.mailbox === folder);
}

export async function fetchSessionMail(): Promise<SessionMail | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const [{ data: profile }, { data: employee }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", auth.user.id).maybeSingle(),
    supabase.from("employees").select("email, full_name").eq("profile_id", auth.user.id).maybeSingle(),
  ]);
  const loginEmail = auth.user.email ?? KALAO_NOREPLY_EMAIL;
  const workEmail = employee?.email?.trim() || loginEmail;
  return {
    userId: auth.user.id,
    fullName: employee?.full_name || profile?.full_name || loginEmail.split("@")[0],
    loginEmail,
    workEmail,
  };
}

export async function fetchCrmEmails(): Promise<CrmEmailRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("crm_emails")
    .select("*, companies(name), contacts(first_name, last_name, email)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as CrmEmailRow[];
}

export async function fetchCrmEmail(id: string): Promise<CrmEmailRow | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("crm_emails")
    .select("*, companies(name), contacts(first_name, last_name, email)")
    .eq("id", id)
    .maybeSingle();
  throwIf(error);
  return (data as CrmEmailRow | null) ?? null;
}

export async function fetchPartyEmails(input: {
  companyId?: string | null;
  contactId?: string | null;
}): Promise<CrmEmailRow[]> {
  const rows = await fetchCrmEmails();
  if (!rows) return [];
  return rows.filter(
    (row) =>
      (input.contactId && row.contact_id === input.contactId) ||
      (input.companyId && row.company_id === input.companyId)
  );
}

export async function sendCrmEmail(input: {
  mailbox: MailboxKey;
  to: string;
  subject: string;
  body: string;
  companyId?: string | null;
  contactId?: string | null;
  invoiceId?: string | null;
}): Promise<SendCrmResult> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const session = await fetchSessionMail();
  if (!session) throw new Error("Session expirée");
  const to = input.to.trim();
  const subject = input.subject.trim() || "Sans objet";
  const body = input.body.trim();
  if (!to) return { dispatched: false, to, reason: "missing_to" };
  if (!body) throw new Error("Message vide");
  const box = mailboxFrom(input.mailbox, session);
  const res = await fetch("/api/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject,
      body,
      mailbox: input.mailbox,
      from: box.from,
    }),
  });
  const json = (await res.json()) as {
    dispatched?: boolean;
    reason?: string;
    detail?: string;
    id?: string;
  };
  const dispatched = Boolean(json.dispatched);
  const { data, error } = await supabase
    .from("crm_emails")
    .insert({
      mailbox: input.mailbox,
      owner_id: input.mailbox === "personal" ? session.userId : null,
      direction: "out",
      from_email: box.address,
      to_email: to,
      subject,
      body,
      company_id: input.companyId || null,
      contact_id: input.contactId || null,
      invoice_id: input.invoiceId || null,
      resend_id: json.id ?? null,
      status: dispatched ? "sent" : "failed",
    })
    .select("id")
    .single();
  throwIf(error);
  return {
    dispatched,
    to,
    reason: json.reason ?? (dispatched ? "sent" : "resend_error"),
    detail: json.detail,
    id: data?.id,
  };
}

export function explainSend(result: SendCrmResult): string {
  if (result.reason === "missing_to") return "Ce client n'a pas d'e-mail.";
  if (result.dispatched) return `Envoyé vers ${result.to}.`;
  if (result.detail) return `Envoi refusé : ${result.detail}`;
  return `Envoi non parti vers ${result.to}.`;
}
