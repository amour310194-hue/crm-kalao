import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";
import { expandInboundAliases, extractAddresses, stripHtml, type InboundResolved } from "@/lib/inbound-mail";
import { repairMailText } from "@/lib/mail-text";
import { htmlToText, makeSnippet, replaceCidImages, safeFilename } from "@/lib/mail/html";
import { parseAddress } from "@/lib/mail/format";
import { MAIL_BUCKET } from "@/lib/mail/types";
import { linkParty, resolveThreadId } from "@/lib/mail/server/store";
import {
  resendGetReceived,
  resendListReceivedAttachments,
  type ResendReceived,
} from "@/lib/mail/server/resend";

function service(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function isPlaceholderBody(body: string) {
  return !body || body === "(sans contenu)" || body === "(contenu à récupérer)";
}

/**
 * Boîte de destination. Adresse inconnue → « À trier » (admins seulement) :
 * un mail pour direction@ ou une faute de frappe n'arrive plus dans Contact, lu par tout le staff.
 */
export async function resolveMailbox(
  addresses: string[],
  supabase: SupabaseClient | null = service()
): Promise<InboundResolved | null> {
  const targets = expandInboundAliases(addresses);
  if (!targets.length) return null;
  if (targets.some((addr) => addr === KALAO_CONTACT_EMAIL)) {
    return { mailbox: "contact", toEmail: KALAO_CONTACT_EMAIL, ownerId: null };
  }
  if (targets.some((addr) => addr === KALAO_NOREPLY_EMAIL || addr === "noreply@groupe-kalao.com")) {
    return { mailbox: "noreply", toEmail: KALAO_NOREPLY_EMAIL, ownerId: null };
  }
  if (supabase) {
    const { data: employee } = await supabase
      .from("employees")
      .select("email, profile_id")
      .in("email", targets)
      .not("profile_id", "is", null)
      .limit(1)
      .maybeSingle();
    if (employee?.profile_id) {
      return {
        mailbox: "personal",
        toEmail: String(employee.email ?? targets[0]).toLowerCase(),
        ownerId: employee.profile_id,
      };
    }
  }
  const kalao = targets.find((addr) => addr.endsWith("@groupe-kalao.com")) ?? targets[0];
  return { mailbox: "triage", toEmail: kalao, ownerId: null };
}

/** SPF, DKIM et DMARC en échec : on range en spam plutôt qu'en réception. */
export function looksLikeSpoof(auth?: { spf?: string; dkim?: string; dmarc?: string }): boolean {
  if (!auth) return false;
  if (auth.dmarc === "fail") return true;
  return auth.spf === "fail" && auth.dkim === "fail";
}

function header(headers: Record<string, string> | undefined, name: string): string {
  if (!headers) return "";
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key ? String(headers[key] ?? "") : "";
}

export function parseReferences(value: string): string[] {
  return (value.match(/<[^>]+>/g) ?? []).map((v) => v.trim());
}

type StoreInput = {
  from: string;
  to: string[];
  cc?: string[];
  receivedFor?: string[];
  subject: string;
  body: string;
  html?: string | null;
  resendId?: string | null;
  messageId?: string | null;
  inReplyTo?: string | null;
  references?: string[];
  auth?: { spf?: string; dkim?: string; dmarc?: string };
  receivedAt?: string | null;
};

export async function storeInboundEmail(
  input: StoreInput,
  supabase: SupabaseClient | null = service()
): Promise<{ stored: boolean; reason: string; mailbox?: string; id?: string }> {
  const fromParsed = parseAddress(input.from || "");
  const from = extractAddresses(input.from)[0] || fromParsed.email;
  const fromName = fromParsed.name || null;
  const html = input.html?.trim() ? input.html : null;
  const text = repairMailText((input.body || "").trim() || (html ? htmlToText(html) : "")) || "(sans contenu)";
  const subject = repairMailText(input.subject.trim()) || "Sans objet";
  if (!from) return { stored: false, reason: "empty" };
  if (!supabase) return { stored: false, reason: "inbound_store_missing" };

  if (input.resendId) {
    const { data: existing } = await supabase
      .from("crm_emails")
      .select("id, body")
      .eq("resend_id", input.resendId)
      .eq("direction", "in")
      .maybeSingle();
    if (existing) {
      if (!isPlaceholderBody(text) && isPlaceholderBody(String(existing.body ?? ""))) {
        await supabase
          .from("crm_emails")
          .update({ body: text, html, snippet: makeSnippet(text) })
          .eq("id", existing.id);
      }
      return { stored: true, reason: "duplicate", id: existing.id };
    }
  }

  const resolved = await resolveMailbox([...(input.to ?? []), ...(input.receivedFor ?? [])], supabase);
  if (!resolved) return { stored: false, reason: "unknown_mailbox" };

  const id = randomUUID();
  const threadId =
    (await resolveThreadId(supabase, {
      mailbox: resolved.mailbox,
      subject,
      inReplyTo: input.inReplyTo,
      references: input.references,
      correspondent: from,
    })) ?? id;
  const party = await linkParty(supabase, [from]);

  const { error } = await supabase.from("crm_emails").insert({
    id,
    thread_id: threadId,
    mailbox: resolved.mailbox,
    owner_id: resolved.ownerId,
    direction: "in",
    from_email: from,
    from_name: fromName,
    to_email: resolved.toEmail,
    to_emails: extractAddresses(input.to),
    cc_emails: extractAddresses(input.cc ?? []),
    subject,
    body: text,
    html,
    snippet: makeSnippet(text),
    message_id: input.messageId || null,
    in_reply_to_header: input.inReplyTo || null,
    references_header: input.references ?? [],
    ...party,
    resend_id: input.resendId ?? null,
    status: "stored",
    folder: looksLikeSpoof(input.auth) ? "spam" : "inbox",
    starred: false,
    important: false,
    unread: true,
    auth_spf: input.auth?.spf ?? null,
    auth_dkim: input.auth?.dkim ?? null,
    auth_dmarc: input.auth?.dmarc ?? null,
    ...(input.receivedAt ? { created_at: input.receivedAt } : {}),
  });
  if (error) return { stored: false, reason: error.message };
  return { stored: true, reason: "stored", mailbox: resolved.mailbox, id };
}

/** Copie les pièces jointes d'un mail reçu dans le stockage privé et remplace les images « cid: ». */
async function storeReceivedAttachments(
  supabase: SupabaseClient,
  emailId: string,
  resendId: string,
  html: string | null
): Promise<{ count: number; html: string | null }> {
  const listed = await resendListReceivedAttachments(resendId);
  if (!listed.ok) return { count: 0, html };
  const cidMap: Record<string, string> = {};
  let count = 0;
  for (const att of listed.data.data ?? []) {
    if (!att.download_url) continue;
    try {
      const res = await fetch(att.download_url);
      if (!res.ok) continue;
      const buf = new Uint8Array(await res.arrayBuffer());
      const attId = randomUUID();
      const path = `inbound/${emailId}/${attId}-${safeFilename(att.filename || "piece-jointe")}`;
      const up = await supabase.storage
        .from(MAIL_BUCKET)
        .upload(path, buf, { contentType: att.content_type || "application/octet-stream", upsert: true });
      if (up.error) continue;
      const inline = (att.content_disposition ?? "").toLowerCase().startsWith("inline") && Boolean(att.content_id);
      await supabase.from("crm_email_attachments").insert({
        id: attId,
        email_id: emailId,
        filename: att.filename || "piece-jointe",
        content_type: att.content_type ?? null,
        size_bytes: att.size ?? buf.byteLength,
        storage_path: path,
        content_id: att.content_id ?? null,
        inline,
      });
      if (att.content_id) {
        cidMap[att.content_id.replace(/^<|>$/g, "").toLowerCase()] = `/api/mail/attachments?id=${attId}`;
      }
      count += 1;
    } catch (err) {
      console.error("[mail] pièce jointe reçue", att.filename, err);
    }
  }
  return { count, html: html && Object.keys(cidMap).length ? replaceCidImages(html, cidMap) : html };
}

function receivedToInput(email: ResendReceived, resendId: string): StoreInput {
  const headers = email.headers;
  const headerTargets = extractAddresses([
    header(headers, "x-original-to"),
    header(headers, "x-forwarded-to"),
    header(headers, "delivered-to"),
    header(headers, "to"),
  ]);
  const html = email.html?.trim() ? email.html : null;
  const text = String(email.text || "").trim() || (html ? stripHtml(html) : "");
  return {
    from: header(headers, "from") || String(email.from ?? ""),
    to: extractAddresses(email.to),
    cc: extractAddresses(email.cc ?? []),
    receivedFor: [...extractAddresses(email.received_for), ...headerTargets],
    subject: repairMailText(String(email.subject ?? "Sans objet").trim()),
    body: repairMailText(text) || "(sans contenu)",
    html,
    resendId,
    messageId: email.message_id || header(headers, "message-id") || null,
    inReplyTo: header(headers, "in-reply-to") || null,
    references: parseReferences(header(headers, "references")),
    auth: email.authentication,
    receivedAt: email.created_at ?? null,
  };
}

export async function ingestReceivedEmail(
  emailId: string,
  fallback?: {
    from?: string;
    to?: string[] | string;
    receivedFor?: string[] | string;
    subject?: string;
    body?: string;
  }
) {
  const supabase = service();
  const fetched = await resendGetReceived(emailId);
  if (fetched.ok && fetched.data) {
    const input = receivedToInput(fetched.data, emailId);
    const result = await storeInboundEmail(input, supabase);
    if (result.stored && result.reason === "stored" && result.id && supabase) {
      const hasListed = (fetched.data.attachments ?? []).length > 0;
      if (hasListed) {
        const att = await storeReceivedAttachments(supabase, result.id, emailId, input.html ?? null);
        await supabase
          .from("crm_emails")
          .update({ has_attachments: att.count > 0, html: att.html })
          .eq("id", result.id);
      }
    }
    return result;
  }
  const from = String(fallback?.from ?? "").trim();
  const to = extractAddresses(fallback?.to);
  const receivedFor = extractAddresses(fallback?.receivedFor);
  if (from && (to.length || receivedFor.length)) {
    return storeInboundEmail(
      {
        from,
        to,
        receivedFor,
        subject: String(fallback?.subject ?? "Sans objet"),
        body: String(fallback?.body ?? "").trim() || "(contenu à récupérer)",
        resendId: emailId,
      },
      supabase
    );
  }
  return { stored: false, reason: "fetch_failed" };
}
