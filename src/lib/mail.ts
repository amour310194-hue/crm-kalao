import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  KALAO_CONTACT_EMAIL,
  KALAO_NOREPLY_EMAIL,
  KALAO_NOREPLY_FROM,
} from "@/lib/org";
import { repairMailText } from "@/lib/mail-text";

export type MailboxKey = "noreply" | "contact" | "personal";
export type MailTray = "inbox" | "sent" | "drafts" | "deleted" | "spam";
export type MailFolder =
  | "inbox"
  | "starred"
  | "sent"
  | "drafts"
  | "deleted"
  | "spam"
  | "important"
  | "all";

export const MAILBOXES: { key: MailboxKey; label: string }[] = [
  { key: "contact", label: "Contact (partagée)" },
  { key: "noreply", label: "No-reply (partagée)" },
  { key: "personal", label: "Ma boîte (privée)" },
];

export const EMAIL_FOLDERS: {
  key: MailFolder;
  label: string;
  icon: string;
  dummy: string;
  extra?: boolean;
}[] = [
  { key: "inbox", label: "Inbox", icon: "ti ti-inbox text-gray me-2", dummy: "56" },
  { key: "starred", label: "Starred", icon: "ti ti-star text-gray me-2", dummy: "46" },
  { key: "sent", label: "Sent", icon: "ti ti-rocket text-gray me-2", dummy: "14" },
  { key: "drafts", label: "Drafts", icon: "ti ti-file text-gray me-2", dummy: "12" },
  { key: "deleted", label: "Deleted", icon: "ti ti-trash text-gray me-2", dummy: "08" },
  { key: "spam", label: "Spam", icon: "ti ti-info-octagon text-gray me-2", dummy: "0" },
  { key: "important", label: "Important", icon: "ti ti-location-up text-gray me-2", dummy: "12", extra: true },
  { key: "all", label: "All Emails", icon: "ti ti-transition-top text-gray me-2", dummy: "34", extra: true },
];

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
  folder: MailTray;
  starred: boolean;
  important: boolean;
  unread?: boolean;
  in_reply_to?: string | null;
  created_at: string;
  companies?: { name: string | null } | null;
  contacts?: { first_name: string; last_name: string; email: string | null } | null;
};

export type MailAttachmentPayload = {
  filename: string;
  content: string;
  contentType?: string;
};

function decorateEmail(row: CrmEmailRow): CrmEmailRow {
  return {
    ...row,
    subject: repairMailText(row.subject),
    body: repairMailText(row.body),
  };
}

export type SessionMail = {
  userId: string;
  fullName: string;
  loginEmail: string;
  workEmail: string;
  role: string | null;
};

export type SharedMailbox = "contact" | "noreply";

export async function fetchAllowedMailboxes(): Promise<MailboxKey[]> {
  const session = await fetchSessionMail();
  if (!session) return [];
  const supabase = db();
  if (!supabase) return ["personal"];
  const { data, error } = await supabase.rpc("shared_mailboxes_for_me");
  if (error) return ["contact", "noreply", "personal"];
  const shared = (Array.isArray(data) ? data : []).filter(
    (box): box is "contact" | "noreply" => box === "contact" || box === "noreply"
  );
  return [...shared, "personal"];
}

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

export function isMailboxKey(value: string | null): value is MailboxKey {
  return value === "contact" || value === "noreply" || value === "personal";
}

export function isMailFolder(value: string | null): value is MailFolder {
  return EMAIL_FOLDERS.some((item) => item.key === value);
}

export function folderLabel(folder: MailFolder): string {
  return EMAIL_FOLDERS.find((item) => item.key === folder)?.label ?? "Inbox";
}

export function mailHref(mailbox: MailboxKey, folder: MailFolder): string {
  return `/application/email?box=${mailbox}&folder=${folder}`;
}

export function trayOf(row: CrmEmailRow): MailTray {
  if (row.folder) return row.folder;
  return row.direction === "out" ? "sent" : "inbox";
}

/** Dossier d’origine après un spam / une suppression. */
export function restoreTray(row: CrmEmailRow): MailTray {
  if (row.direction === "out" && (row.status === "stored" || !row.resend_id)) {
    return "drafts";
  }
  if (row.direction === "out") return "sent";
  return "inbox";
}

export function firstMailAddress(values: string[]): string {
  return (
    values
      .map((value) => value.trim())
      .find((value) => value.includes("@") && !value.includes(" ")) ?? ""
  );
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

export function filterEmails(
  rows: CrmEmailRow[],
  mailbox: MailboxKey,
  folder: MailFolder
): CrmEmailRow[] {
  const box = rows.filter((row) => row.mailbox === mailbox);
  if (folder === "inbox") return box.filter((row) => trayOf(row) === "inbox");
  if (folder === "sent") return box.filter((row) => trayOf(row) === "sent");
  if (folder === "drafts") return box.filter((row) => trayOf(row) === "drafts");
  if (folder === "deleted") return box.filter((row) => trayOf(row) === "deleted");
  if (folder === "spam") return box.filter((row) => trayOf(row) === "spam");
  if (folder === "starred") {
    return box.filter((row) => row.starred && trayOf(row) !== "deleted");
  }
  if (folder === "important") {
    return box.filter((row) => row.important && trayOf(row) !== "deleted");
  }
  return box.filter((row) => {
    const tray = trayOf(row);
    return tray !== "deleted" && tray !== "spam";
  });
}

export function countFolder(
  rows: CrmEmailRow[],
  mailbox: MailboxKey,
  folder: MailFolder
): number {
  return filterEmails(rows, mailbox, folder).length;
}

export async function fetchSessionMail(): Promise<SessionMail | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const [{ data: profile }, { data: employee }] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", auth.user.id).maybeSingle(),
    supabase.from("employees").select("email, full_name").eq("profile_id", auth.user.id).maybeSingle(),
  ]);
  const loginEmail = auth.user.email ?? KALAO_NOREPLY_EMAIL;
  const workEmail = employee?.email?.trim() || loginEmail;
  return {
    userId: auth.user.id,
    fullName: employee?.full_name || profile?.full_name || loginEmail.split("@")[0],
    loginEmail,
    workEmail,
    role: profile?.role ?? null,
  };
}

export async function syncInboundEmails(): Promise<number> {
  const supabase = db();
  if (!supabase) return 0;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return 0;
  const res = await fetch("/api/email/inbound/sync", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return 0;
  const json = (await res.json()) as { count?: number };
  return json.count ?? 0;
}

export async function fetchCrmEmails(): Promise<CrmEmailRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("crm_emails")
    .select("*, companies(name), contacts(first_name, last_name, email)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return ((data ?? []) as CrmEmailRow[]).map(decorateEmail);
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
  return data ? decorateEmail(data as CrmEmailRow) : null;
}

export async function fetchPartyEmails(input: {
  companyId?: string | null;
  contactId?: string | null;
  email?: string | null;
}): Promise<CrmEmailRow[]> {
  const rows = await fetchCrmEmails();
  if (!rows) return [];
  const email = (input.email ?? "").trim().toLowerCase();
  return rows.filter((row) => {
    if (input.contactId && row.contact_id === input.contactId) return true;
    if (input.companyId && row.company_id === input.companyId) return true;
    if (
      email &&
      (row.from_email.toLowerCase() === email ||
        row.to_email.toLowerCase() === email ||
        row.contacts?.email?.toLowerCase() === email)
    ) {
      return true;
    }
    return false;
  });
}

async function upsertOutgoing(
  session: SessionMail,
  input: {
    mailbox: MailboxKey;
    to: string;
    subject: string;
    body: string;
    companyId?: string | null;
    contactId?: string | null;
    invoiceId?: string | null;
    draftId?: string | null;
    inReplyTo?: string | null;
    folder: MailTray;
    status: CrmEmailRow["status"];
    resendId?: string | null;
  }
): Promise<string> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const box = mailboxFrom(input.mailbox, session);
  const payload = {
    mailbox: input.mailbox,
    owner_id: input.mailbox === "personal" ? session.userId : null,
    direction: "out" as const,
    from_email: box.address,
    to_email: input.to,
    subject: input.subject,
    body: input.body,
    company_id: input.companyId || null,
    contact_id: input.contactId || null,
    invoice_id: input.invoiceId || null,
    resend_id: input.resendId ?? null,
    status: input.status,
    folder: input.folder,
    unread: false,
    in_reply_to: input.inReplyTo ?? null,
  };
  if (input.draftId) {
    const { error } = await supabase.from("crm_emails").update(payload).eq("id", input.draftId);
    throwIf(error);
    return input.draftId;
  }
  const { data, error } = await supabase
    .from("crm_emails")
    .insert({ ...payload, starred: false, important: false })
    .select("id")
    .single();
  throwIf(error);
  return data?.id ?? "";
}

export async function saveCrmDraft(input: {
  mailbox: MailboxKey;
  to?: string;
  subject?: string;
  body?: string;
  companyId?: string | null;
  contactId?: string | null;
  draftId?: string | null;
}): Promise<{ id: string }> {
  const session = await fetchSessionMail();
  if (!session) throw new Error("Session expirée");
  const allowed = await fetchAllowedMailboxes();
  if (!allowed.includes(input.mailbox)) {
    throw new Error("Cette boîte partagée ne vous est pas ouverte.");
  }
  const id = await upsertOutgoing(session, {
    mailbox: input.mailbox,
    to: input.to?.trim() || "(destinataire à préciser)",
    subject: input.subject?.trim() || "Sans objet",
    body: input.body?.trim() || "(brouillon)",
    companyId: input.companyId,
    contactId: input.contactId,
    draftId: input.draftId,
    folder: "drafts",
    status: "stored",
  });
  return { id };
}

export async function sendCrmEmail(input: {
  mailbox: MailboxKey;
  to: string;
  subject: string;
  body: string;
  companyId?: string | null;
  contactId?: string | null;
  invoiceId?: string | null;
  draftId?: string | null;
  inReplyTo?: string | null;
  attachments?: MailAttachmentPayload[];
}): Promise<SendCrmResult> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const session = await fetchSessionMail();
  if (!session) throw new Error("Session expirée");
  const allowed = await fetchAllowedMailboxes();
  if (!allowed.includes(input.mailbox)) {
    throw new Error("Cette boîte partagée ne vous est pas ouverte.");
  }
  const to = input.to.trim();
  const subject = input.subject.trim() || "Sans objet";
  const body = input.body.trim();
  if (!to) return { dispatched: false, to, reason: "missing_to" };
  if (!body) throw new Error("Message vide");
  const box = mailboxFrom(input.mailbox, session);
  const { authJsonHeaders } = await import("@/lib/auth-headers");
  const res = await fetch("/api/email/send", {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify({
      to,
      subject,
      body,
      mailbox: input.mailbox,
      from: box.from,
      attachments: input.attachments ?? [],
    }),
  });
  const json = (await res.json()) as {
    dispatched?: boolean;
    reason?: string;
    detail?: string;
    id?: string;
  };
  const dispatched = Boolean(json.dispatched);
  const id = await upsertOutgoing(session, {
    mailbox: input.mailbox,
    to,
    subject,
    body,
    companyId: input.companyId,
    contactId: input.contactId,
    invoiceId: input.invoiceId,
    draftId: input.draftId,
    inReplyTo: input.inReplyTo,
    folder: "sent",
    status: dispatched ? "sent" : "failed",
    resendId: json.id ?? null,
  });
  return {
    dispatched,
    to,
    reason: json.reason ?? (dispatched ? "sent" : "resend_error"),
    detail: json.detail,
    id,
  };
}

export async function patchCrmEmail(
  id: string,
  patch: Partial<Pick<CrmEmailRow, "folder" | "starred" | "important" | "unread">>
): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("crm_emails").update(patch).eq("id", id);
  throwIf(error);
}

export function explainSend(result: SendCrmResult): string {
  if (result.reason === "missing_to") return "Ce client n'a pas d'e-mail.";
  if (result.dispatched) return `Envoyé vers ${result.to}.`;
  if (result.detail) return `Envoi refusé : ${result.detail}`;
  return `Envoi non parti vers ${result.to}.`;
}
