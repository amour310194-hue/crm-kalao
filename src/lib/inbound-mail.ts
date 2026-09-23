import {
  KALAO_CONTACT_EMAIL,
  KALAO_INBOUND_DOMAIN,
  KALAO_INBOUND_RESEND,
  KALAO_NOREPLY_EMAIL,
} from "@/lib/org";

export type InboundMailbox = "noreply" | "contact" | "personal";

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

export async function fetchReceivedEmail(emailId: string): Promise<{
  from: string;
  to: string[];
  receivedFor: string[];
  subject: string;
  text: string;
} | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    from?: string;
    to?: string[];
    received_for?: string[];
    subject?: string;
    text?: string | null;
    html?: string | null;
    headers?: Record<string, string>;
  };
  const headerTargets = extractAddresses([
    json.headers?.["x-original-to"],
    json.headers?.["x-forwarded-to"],
    json.headers?.["delivered-to"],
    json.headers?.to,
  ]);
  const text = String(json.text || "").trim() || stripHtml(String(json.html || ""));
  return {
    from: extractAddresses(json.from)[0] || String(json.from ?? "").trim(),
    to: extractAddresses(json.to),
    receivedFor: [...extractAddresses(json.received_for), ...headerTargets],
    subject: String(json.subject ?? "Sans objet").trim(),
    text: text || "(sans contenu)",
  };
}

export async function listReceivedEmailIds(limit = 20): Promise<string[]> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return [];
  const res = await fetch(`https://api.resend.com/emails/receiving?limit=${limit}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: { id?: string }[] };
  return (json.data ?? []).map((row) => row.id).filter((id): id is string => Boolean(id));
}
