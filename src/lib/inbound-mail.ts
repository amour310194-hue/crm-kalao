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

export type ReceivedEmail = {
  from: string;
  to: string[];
  receivedFor: string[];
  subject: string;
  text: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function resendJson(path: string): Promise<unknown | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const res = await fetch(`https://api.resend.com${path}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) return res.json();
    const detail = await res.text().catch(() => "");
    console.error("[crm] resend receiving", path, res.status, detail.slice(0, 300));
    if (res.status === 404 && attempt < 2) {
      await sleep(700 * (attempt + 1));
      continue;
    }
    return null;
  }
  return null;
}

export async function fetchReceivedEmail(emailId: string): Promise<ReceivedEmail | null> {
  const json = (await resendJson(`/emails/receiving/${emailId}`)) as {
    from?: string;
    to?: string[];
    received_for?: string[];
    subject?: string;
    text?: string | null;
    html?: string | null;
    headers?: Record<string, string>;
  } | null;
  if (!json) return null;
  const headerTargets = extractAddresses([
    json.headers?.["x-original-to"],
    json.headers?.["x-forwarded-to"],
    json.headers?.["delivered-to"],
    json.headers?.to,
    json.headers?.from,
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

export async function listReceivedEmailIds(limit = 50): Promise<string[]> {
  const json = (await resendJson(`/emails/receiving?limit=${limit}`)) as {
    data?: { id?: string; email_id?: string }[];
  } | null;
  return (json?.data ?? [])
    .map((row) => row.id || row.email_id)
    .filter((id): id is string => Boolean(id));
}
