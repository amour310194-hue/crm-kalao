import {
  KALAO_CONTACT_EMAIL,
  KALAO_INBOUND_DOMAIN,
  KALAO_INBOUND_RESEND,
  KALAO_NOREPLY_EMAIL,
} from "@/lib/org";
import { resendListReceived } from "@/lib/mail/server/resend";

export type InboundMailbox = "noreply" | "contact" | "personal" | "triage";

export type InboundResolved = {
  mailbox: InboundMailbox;
  toEmail: string;
  ownerId: string | null;
};

export function extractAddresses(value: unknown): string[] {
  const list = Array.isArray(value) ? value : value ? [String(value)] : [];
  return list
    .flatMap((item) => String(item).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])
    .map((item) => item.toLowerCase());
}

export function inboundEmailId(payload: {
  email_id?: string;
  id?: string;
  data?: { email_id?: string; id?: string };
}): string | null {
  const id = payload.data?.email_id || payload.data?.id || payload.email_id || payload.id;
  return id ? String(id) : null;
}

export function expandInboundAliases(addresses: string[]): string[] {
  const out = new Set<string>();
  for (const addr of addresses) {
    const lower = addr.toLowerCase();
    out.add(lower);
    const at = lower.lastIndexOf("@");
    if (at < 1) continue;
    const local = lower.slice(0, at);
    const domain = lower.slice(at + 1);
    if (domain === KALAO_INBOUND_RESEND || domain === KALAO_INBOUND_DOMAIN) {
      if (local === "contact") out.add(KALAO_CONTACT_EMAIL);
      else if (local === "no-reply" || local === "noreply") out.add(KALAO_NOREPLY_EMAIL);
      else out.add(`${local}@groupe-kalao.com`);
    }
  }
  return [...out];
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export async function listReceivedEmailIds(limit = 50): Promise<string[]> {
  const res = await resendListReceived(limit);
  if (!res.ok) return [];
  return (res.data.data ?? [])
    .map((row) => row.id || row.email_id)
    .filter((id): id is string => Boolean(id));
}
