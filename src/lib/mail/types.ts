/** Types partagés navigateur / serveur de la messagerie. */

export type MailboxKey = "contact" | "noreply" | "personal" | "triage";
export type SharedMailbox = "contact" | "noreply";

/** Dossier physique d'un message (colonne crm_emails.folder). */
export type MailTray =
  | "inbox"
  | "sent"
  | "drafts"
  | "scheduled"
  | "archive"
  | "spam"
  | "deleted";

/** Vue de la barre latérale : dossiers physiques + vues calculées. */
export type MailView =
  | MailTray
  | "starred"
  | "snoozed"
  | "important"
  | "assigned"
  | "unread"
  | "all"
  | "label";

export type DeliveryStatus =
  | "queued"
  | "scheduled"
  | "sent"
  | "delivered"
  | "delayed"
  | "bounced"
  | "complained"
  | "failed"
  | "cancelled"
  | "suppressed"
  | "opened";

export type MailThreadRow = {
  thread_id: string;
  mailbox: MailboxKey;
  last_id: string;
  last_at: string;
  subject: string;
  snippet: string | null;
  participants: string[];
  message_count: number;
  unread_count: number;
  starred: boolean;
  important: boolean;
  has_attachments: boolean;
  has_draft: boolean;
  label_ids: string[];
  assigned_to: string | null;
  last_direction: "in" | "out";
  last_delivery: DeliveryStatus | null;
  snoozed_until: string | null;
  contact_id: string | null;
  company_id: string | null;
  dossier_id: string | null;
  total_count: number;
};

export type MailAttachment = {
  id: string;
  email_id: string;
  filename: string;
  content_type: string | null;
  size_bytes: number;
  content_id: string | null;
  inline: boolean;
};

export type MailMessage = {
  id: string;
  thread_id: string;
  mailbox: MailboxKey;
  owner_id: string | null;
  direction: "in" | "out";
  folder: MailTray;
  status: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  subject: string;
  body: string;
  html: string | null;
  snippet: string | null;
  created_at: string;
  sent_at: string | null;
  scheduled_at: string | null;
  delivery_status: DeliveryStatus | null;
  delivery_detail: string | null;
  assigned_to: string | null;
  created_by: string | null;
  contact_id: string | null;
  company_id: string | null;
  dossier_id: string | null;
  invoice_id: string | null;
  in_reply_to: string | null;
  has_attachments: boolean;
  auth_spf: string | null;
  auth_dkim: string | null;
  auth_dmarc: string | null;
  read: boolean;
  starred: boolean;
  important: boolean;
  snoozed_until: string | null;
  attachments: MailAttachment[];
  label_ids: string[];
};

export type MailLabel = {
  id: string;
  name: string;
  color: string;
  owner_id: string | null;
};

export type MailTemplate = {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  owner_id: string | null;
};

export type DirectoryEntry = {
  profile_id: string;
  full_name: string;
  email: string | null;
  role: string | null;
};

export type MailCounts = Record<string, number>;

/** Pièce jointe côté rédaction : fichier déjà envoyé dans le stockage, ou pièce d'un mail existant. */
export type ComposeAttachment = {
  key: string;
  filename: string;
  size: number;
  contentType?: string;
  path?: string;
  sourceAttachmentId?: string;
  uploading?: boolean;
  error?: string;
};

export type ComposeInput = {
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
  attachments: { path?: string; sourceAttachmentId?: string; filename: string; size: number; contentType?: string }[];
  scheduledAt?: string | null;
};

export type MailAction =
  | { action: "read" | "unread" | "star" | "unstar" | "important" | "unimportant" }
  | { action: "move"; folder: "inbox" | "archive" | "spam" | "deleted" }
  | { action: "restore" }
  | { action: "snooze"; until: string | null }
  | { action: "label_add" | "label_remove"; labelId: string }
  | { action: "assign"; userId: string | null }
  | { action: "move_mailbox"; mailbox: MailboxKey; ownerId?: string | null }
  | { action: "delete_forever" };

export const SHARED_MAILBOXES: SharedMailbox[] = ["contact", "noreply"];

export function isMailboxKey(value: unknown): value is MailboxKey {
  return value === "contact" || value === "noreply" || value === "personal" || value === "triage";
}

export const MAIL_VIEWS: MailView[] = [
  "inbox", "starred", "snoozed", "important", "sent", "scheduled", "drafts",
  "assigned", "unread", "all", "archive", "spam", "deleted", "label",
];

export function isMailView(value: unknown): value is MailView {
  return typeof value === "string" && (MAIL_VIEWS as string[]).includes(value);
}

/** Gmail : 25 Mo par envoi ; on applique la même limite par fichier et au total. */
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MAX_RECIPIENTS = 50;
export const MAIL_BUCKET = "mail-attachments";
