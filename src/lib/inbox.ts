import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchCompanies } from "@/lib/crm";

export type ConversationChannel =
  | "internal"
  | "whatsapp"
  | "messenger"
  | "instagram"
  | "email";

export interface ConversationRow {
  id: string;
  channel: ConversationChannel;
  company_id: string | null;
  contact_id: string | null;
  employee_id: string | null;
  dossier_id: string | null;
  title: string;
  last_preview: string | null;
  updated_at: string;
  companies?: { name: string | null; email: string | null } | null;
  contacts?: {
    first_name: string;
    last_name: string;
    email: string | null;
  } | null;
  employees?: { full_name: string } | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  direction: "in" | "out";
  body: string;
  author_name: string | null;
  status: "stored" | "sent" | "failed";
  channel: string | null;
  created_at: string;
}

export interface SocialPostRow {
  id: string;
  body: string;
  author_label: string;
  source: "internal" | "facebook" | "instagram";
  created_at: string;
}

const CHAT_AVATARS = [
  "avatar-5.jpg",
  "avatar-4.jpg",
  "user-08.jpg",
  "user-04.jpg",
  "avatar-8.jpg",
];

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

/** Sans clés Meta, jamais WhatsApp / Instagram / Facebook. */
export function liveChannelLabel(channel: string | null | undefined): string {
  if (channel === "email") return "E-mail";
  return "Interne";
}

export function conversationAvatar(index: number): string {
  return CHAT_AVATARS[index % CHAT_AVATARS.length];
}

export function formatChatTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function conversationParty(row: ConversationRow): string {
  const contact = row.contacts
    ? `${row.contacts.first_name} ${row.contacts.last_name}`.trim()
    : "";
  return (
    row.employees?.full_name ||
    contact ||
    row.companies?.name ||
    row.title
  );
}

export async function fetchConversations(
  channel?: ConversationChannel | ConversationChannel[]
): Promise<ConversationRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase
    .from("conversations")
    .select(
      "*, companies(name, email), contacts(first_name, last_name, email), employees(full_name)"
    )
    .order("updated_at", { ascending: false });
  if (Array.isArray(channel)) q = q.in("channel", channel);
  else if (channel) q = q.eq("channel", channel);
  const { data, error } = await q;
  throwIf(error);
  return (data ?? []) as ConversationRow[];
}

export async function fetchMessages(conversationId: string): Promise<MessageRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  throwIf(error);
  return (data ?? []) as MessageRow[];
}

export async function createConversation(input: {
  title: string;
  channel?: ConversationChannel;
  company_id?: string | null;
  contact_id?: string | null;
  employee_id?: string | null;
}): Promise<ConversationRow> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      title: input.title,
      channel: input.channel ?? "internal",
      company_id: input.company_id || null,
      contact_id: input.contact_id || null,
      employee_id: input.employee_id || null,
      last_preview: "",
    })
    .select(
      "*, companies(name, email), contacts(first_name, last_name, email), employees(full_name)"
    )
    .single();
  throwIf(error);
  return data as ConversationRow;
}

export async function sendChatMessage(input: {
  conversationId: string;
  body: string;
  direction?: "in" | "out";
  authorName?: string;
}): Promise<MessageRow> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const body = input.body.trim();
  if (!body) throw new Error("Message vide");
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: input.conversationId,
      direction: input.direction ?? "out",
      body,
      author_name: input.authorName ?? "Kalao",
      status: "stored",
      channel: "internal",
    })
    .select("*")
    .single();
  throwIf(error);
  const { error: upErr } = await supabase
    .from("conversations")
    .update({ last_preview: body.slice(0, 80) })
    .eq("id", input.conversationId);
  throwIf(upErr);
  return data as MessageRow;
}

export async function ensureInternalThread(): Promise<ConversationRow | null> {
  const existing = await fetchConversations("internal");
  if (existing && existing.length) return existing[0];
  const companies = await fetchCompanies();
  const company = companies?.[0];
  if (!company) return null;
  return createConversation({
    title: company.name,
    channel: "internal",
    company_id: company.id,
  });
}

export async function fetchSocialPosts(): Promise<SocialPostRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("source", "internal")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as SocialPostRow[];
}

export async function createSocialPost(body: string, authorLabel = "Groupe Kalao") {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const text = body.trim();
  if (!text) throw new Error("Post vide");
  const { data, error } = await supabase
    .from("social_posts")
    .insert({
      body: text,
      author_label: authorLabel,
      source: "internal",
    })
    .select("*")
    .single();
  throwIf(error);
  return data as SocialPostRow;
}
