"use client";

/**
 * Accès aux données de la messagerie depuis le navigateur.
 * Lectures : Supabase avec la session (RLS). Écritures : API serveur uniquement.
 * L'interface dépend de l'interface MailApi, pas de Supabase directement.
 */

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { authJsonHeaders } from "@/lib/auth-headers";
import { folderForIn, parseSearch } from "@/lib/mail/search";
import {
  MAIL_BUCKET,
  type ComposeInput,
  type DirectoryEntry,
  type MailAction,
  type MailAttachment,
  type MailboxKey,
  type MailCounts,
  type MailLabel,
  type MailMessage,
  type MailTemplate,
  type MailThreadRow,
  type MailView,
} from "@/lib/mail/types";

export type MailSession = {
  userId: string;
  fullName: string;
  workEmail: string;
  role: string | null;
  isAdmin: boolean;
  mailboxes: MailboxKey[];
};

export type ThreadQuery = {
  mailbox: MailboxKey | null;
  view: MailView;
  labelId?: string | null;
  search?: string;
  contactId?: string | null;
  companyId?: string | null;
  partyEmail?: string | null;
  limit: number;
  offset: number;
};

export type SendResult = {
  ok: boolean;
  dispatched: boolean;
  scheduled?: boolean;
  reason: string;
  detail?: string;
  id?: string;
  threadId?: string;
  suppressed?: { email: string; reason: string }[];
};

export type Suggestion = { name: string; email: string; kind: "contact" | "company" | "staff" };

export interface MailApi {
  session(): Promise<MailSession | null>;
  listThreads(q: ThreadQuery, labels: MailLabel[]): Promise<{ rows: MailThreadRow[]; total: number }>;
  counts(): Promise<Record<string, MailCounts>>;
  thread(threadId: string): Promise<MailMessage[]>;
  labels(): Promise<MailLabel[]>;
  templates(): Promise<MailTemplate[]>;
  signature(): Promise<string>;
  directory(): Promise<DirectoryEntry[]>;
  suggest(query: string): Promise<Suggestion[]>;
  act(target: { ids?: string[]; threadIds?: string[] }, action: MailAction): Promise<number>;
  saveDraft(input: ComposeInput): Promise<{ id: string; threadId: string }>;
  discardDraft(id: string): Promise<void>;
  send(input: ComposeInput, force?: boolean): Promise<SendResult>;
  cancelScheduled(id: string): Promise<void>;
  upload(file: File): Promise<{ path: string }>;
  attachmentUrl(att: { id?: string; path?: string }, download?: boolean): string;
  inlineUrls(ids: string[]): Promise<Record<string, string>>;
  saveLabel(input: { id?: string; name: string; color: string; shared?: boolean }): Promise<void>;
  deleteLabel(id: string): Promise<void>;
  saveTemplate(input: { id?: string; name: string; subject: string; body_html: string; shared?: boolean }): Promise<void>;
  deleteTemplate(id: string): Promise<void>;
  saveSignature(html: string): Promise<void>;
  templateVars(input: { email?: string | null; contactId?: string | null; companyId?: string | null }): Promise<Record<string, string>>;
  refresh(): Promise<number>;
  subscribe(onEvent: (event: { type: "insert" | "update"; row: Partial<MailMessage> }) => void): () => void;
}

export class MailApiError extends Error {
  constructor(public status: number, message: string, public payload?: unknown) {
    super(message);
    this.name = "MailApiError";
  }
}

const REASONS: Record<string, string> = {
  unauthorized: "Session expirée : reconnectez-vous.",
  too_many_requests: "Trop de requêtes, réessayez dans un instant.",
  bad_payload: "Requête invalide.",
  no_role: "Votre compte n'a pas de rôle CRM.",
  supabase_missing: "Base de données non configurée.",
};

async function call<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(path, {
    method: init?.method ?? "POST",
    headers: await authJsonHeaders(),
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });
  let json: Record<string, unknown> = {};
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    json = {};
  }
  if (!res.ok && res.status !== 409) {
    const reason = String(json.detail || json.reason || `Erreur ${res.status}`);
    throw new MailApiError(res.status, REASONS[reason] ?? reason, json);
  }
  return json as T;
}

function db() {
  if (!isSupabaseConfigured()) throw new MailApiError(503, "Supabase n'est pas configuré.");
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new MailApiError(500, error.message);
}

let directoryCache: Promise<DirectoryEntry[]> | null = null;

export function createSupabaseMailApi(): MailApi {
  const api: MailApi = {
    async session() {
      const supabase = db();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const [{ data: profile }, { data: employee }, { data: shared }] = await Promise.all([
        supabase.from("profiles").select("full_name, role").eq("id", auth.user.id).maybeSingle(),
        supabase.from("employees").select("email, full_name").eq("profile_id", auth.user.id).maybeSingle(),
        supabase.rpc("shared_mailboxes_for_me"),
      ]);
      const role = (profile?.role as string | null) ?? null;
      const isAdmin = ["super_admin", "admin", "manager", "direction"].includes(role ?? "");
      const boxes: MailboxKey[] = (Array.isArray(shared) ? shared : []).filter(
        (b): b is MailboxKey => b === "contact" || b === "noreply"
      );
      boxes.push("personal");
      if (isAdmin) boxes.push("triage");
      const workEmail = String(employee?.email || auth.user.email || "").toLowerCase();
      return {
        userId: auth.user.id,
        fullName: String(employee?.full_name || profile?.full_name || workEmail.split("@")[0] || "Moi"),
        workEmail,
        role,
        isAdmin,
        mailboxes: boxes,
      };
    },

    async listThreads(q, labels) {
      const parsed = parseSearch(q.search ?? "");
      let view: MailView = q.view;
      let labelId = q.labelId ?? null;
      if (parsed.inFolder) view = (folderForIn(parsed.inFolder) as MailView) ?? view;
      else if (q.search && (view === "inbox")) view = "all"; // Gmail : une recherche porte sur tous les messages.
      if (parsed.starred) view = "starred";
      if (parsed.important) view = "important";
      if (parsed.label) {
        const found = labels.find((l) => l.name.toLowerCase() === parsed.label!.toLowerCase());
        labelId = found?.id ?? "00000000-0000-0000-0000-000000000000";
        if (view === "all" || view === "inbox") view = "label";
      }
      const { data, error } = await db().rpc("mail_threads", {
        p_mailbox: q.mailbox,
        p_folder: view,
        p_label: labelId,
        p_search: parsed.text || null,
        p_from: parsed.from ?? null,
        p_to: parsed.to ?? null,
        p_subject: parsed.subject ?? null,
        p_has_attachment: parsed.hasAttachment ?? null,
        p_unread: parsed.unread ?? null,
        p_after: parsed.after ?? null,
        p_before: parsed.before ?? null,
        p_contact: q.contactId ?? null,
        p_company: q.companyId ?? null,
        p_party_email: q.partyEmail ?? null,
        p_limit: q.limit,
        p_offset: q.offset,
      });
      throwIf(error);
      const rows = (data ?? []) as MailThreadRow[];
      return { rows, total: rows.length ? Number(rows[0].total_count) : 0 };
    },

    async counts() {
      const { data, error } = await db().rpc("mail_counts");
      throwIf(error);
      const out: Record<string, MailCounts> = {};
      for (const row of (data ?? []) as { mailbox: string; key: string; count: number }[]) {
        out[row.mailbox] = out[row.mailbox] ?? {};
        out[row.mailbox][row.key] = Number(row.count);
      }
      return out;
    },

    async thread(threadId) {
      if (!/^[0-9a-f-]{36}$/i.test(threadId)) throw new MailApiError(400, "Conversation introuvable.");
      const supabase = db();
      const { data, error } = await supabase
        .from("crm_emails")
        .select("*")
        .or(`thread_id.eq.${threadId},id.eq.${threadId}`)
        .order("created_at", { ascending: true });
      throwIf(error);
      const rows = (data ?? []) as Record<string, unknown>[];
      const ids = rows.map((r) => String(r.id));
      if (!ids.length) return [];
      const [{ data: states }, { data: atts }, { data: links }] = await Promise.all([
        supabase.from("crm_email_user_state").select("email_id, read, starred, important, snoozed_until").in("email_id", ids),
        supabase
          .from("crm_email_attachments")
          .select("id, email_id, filename, content_type, size_bytes, content_id, inline")
          .in("email_id", ids),
        supabase.from("crm_email_label_links").select("email_id, label_id").in("email_id", ids),
      ]);
      const stateBy = new Map((states ?? []).map((s) => [s.email_id as string, s]));
      return rows.map((r) => {
        const s = stateBy.get(String(r.id));
        return {
          ...(r as unknown as MailMessage),
          thread_id: String(r.thread_id ?? r.id),
          to_emails: (r.to_emails as string[] | null)?.length ? (r.to_emails as string[]) : r.to_email ? [String(r.to_email)] : [],
          cc_emails: (r.cc_emails as string[] | null) ?? [],
          bcc_emails: (r.bcc_emails as string[] | null) ?? [],
          read: s?.read ?? !r.unread,
          starred: s?.starred ?? Boolean(r.starred),
          important: s?.important ?? Boolean(r.important),
          snoozed_until: (s?.snoozed_until as string | null) ?? null,
          attachments: ((atts ?? []) as MailAttachment[]).filter((a) => a.email_id === r.id),
          label_ids: (links ?? []).filter((l) => l.email_id === r.id).map((l) => String(l.label_id)),
        } as MailMessage;
      });
    },

    async labels() {
      const { data, error } = await db().from("crm_email_labels").select("id, name, color, owner_id").order("name");
      throwIf(error);
      return (data ?? []) as MailLabel[];
    },

    async templates() {
      const { data, error } = await db()
        .from("crm_mail_templates")
        .select("id, name, subject, body_html, owner_id")
        .order("name");
      throwIf(error);
      return (data ?? []) as MailTemplate[];
    },

    async signature() {
      const { data } = await db().from("crm_mail_signatures").select("html").maybeSingle();
      return String(data?.html ?? "");
    },

    directory() {
      if (!directoryCache) {
        directoryCache = Promise.resolve(db().rpc("mail_directory")).then(({ data }) => (data ?? []) as DirectoryEntry[]);
      }
      return directoryCache;
    },

    async suggest(query) {
      const q = query.trim().replace(/[%_,()]/g, "");
      if (q.length < 1) return [];
      const supabase = db();
      const like = `%${q}%`;
      const [{ data: contacts }, { data: companies }, staff] = await Promise.all([
        supabase
          .from("contacts")
          .select("first_name, last_name, email")
          .not("email", "is", null)
          .or(`first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like}`)
          .limit(8),
        supabase.from("companies").select("name, email").not("email", "is", null).or(`name.ilike.${like},email.ilike.${like}`).limit(5),
        api.directory(),
      ]);
      const out: Suggestion[] = [];
      const push = (s: Suggestion) => {
        if (s.email && !out.some((o) => o.email === s.email)) out.push(s);
      };
      for (const c of contacts ?? []) {
        push({ name: `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(), email: String(c.email).toLowerCase(), kind: "contact" });
      }
      for (const c of companies ?? []) push({ name: String(c.name ?? ""), email: String(c.email).toLowerCase(), kind: "company" });
      const lower = q.toLowerCase();
      for (const s of staff) {
        if (s.email && (s.full_name.toLowerCase().includes(lower) || s.email.includes(lower))) {
          push({ name: s.full_name, email: s.email, kind: "staff" });
        }
      }
      return out.slice(0, 10);
    },

    async act(target, action) {
      const res = await call<{ count: number }>("/api/mail/actions", { body: { ...target, ...action } });
      return res.count ?? 0;
    },

    saveDraft(input) {
      return call<{ id: string; threadId: string }>("/api/mail/draft", { body: input });
    },

    async discardDraft(id) {
      await call(`/api/mail/draft?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    },

    send(input, force) {
      return call<SendResult>("/api/email/send", { body: { ...input, force: Boolean(force) } });
    },

    async cancelScheduled(id) {
      await call("/api/mail/cancel", { body: { id } });
    },

    async upload(file) {
      const target = await call<{ path: string; token: string }>("/api/mail/upload", {
        body: { filename: file.name, size: file.size, contentType: file.type },
      });
      const { error } = await db().storage.from(MAIL_BUCKET).uploadToSignedUrl(target.path, target.token, file, {
        contentType: file.type || "application/octet-stream",
      });
      if (error) throw new MailApiError(500, `Envoi du fichier impossible : ${error.message}`);
      return { path: target.path };
    },

    attachmentUrl(att, download) {
      const params = new URLSearchParams();
      if (att.id) params.set("id", att.id);
      else if (att.path) params.set("path", att.path);
      if (download) params.set("download", "1");
      return `/api/mail/attachments?${params.toString()}`;
    },

    async inlineUrls(ids) {
      if (!ids.length) return {};
      const res = await fetch(`/api/mail/attachments?ids=${ids.join(",")}`, { headers: await authJsonHeaders() });
      if (!res.ok) return {};
      const json = (await res.json()) as { urls?: Record<string, string> };
      return json.urls ?? {};
    },

    async saveLabel(input) {
      await call("/api/mail/labels", { method: input.id ? "PATCH" : "POST", body: input });
    },

    async deleteLabel(id) {
      await call(`/api/mail/labels?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    },

    async saveTemplate(input) {
      await call("/api/mail/templates", { method: input.id ? "PATCH" : "POST", body: input });
    },

    async deleteTemplate(id) {
      await call(`/api/mail/templates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    },

    async saveSignature(html) {
      await call("/api/mail/signature", { method: "PUT", body: { html } });
    },

    async templateVars(input) {
      const params = new URLSearchParams();
      if (input.email) params.set("email", input.email);
      if (input.contactId) params.set("contactId", input.contactId);
      if (input.companyId) params.set("companyId", input.companyId);
      const res = await fetch(`/api/mail/context?${params.toString()}`, { headers: await authJsonHeaders() });
      if (!res.ok) return {};
      const json = (await res.json()) as { vars?: Record<string, string> };
      return json.vars ?? {};
    },

    async refresh() {
      const res = await fetch("/api/email/inbound/sync", { method: "POST", headers: await authJsonHeaders() });
      if (!res.ok) return 0;
      const json = (await res.json()) as { count?: number };
      return json.count ?? 0;
    },

    subscribe(onEvent) {
      const supabase = db();
      const channel = supabase
        .channel(`crm-mail-${Math.random().toString(36).slice(2)}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "crm_emails" }, (payload) =>
          onEvent({ type: "insert", row: payload.new as Partial<MailMessage> })
        )
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "crm_emails" }, (payload) =>
          onEvent({ type: "update", row: payload.new as Partial<MailMessage> })
        )
        .subscribe();
      return () => {
        void supabase.removeChannel(channel);
      };
    },
  };
  return api;
}
