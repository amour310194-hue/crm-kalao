import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_IDLE_HOURS = 12;
export const PIECE_RETENTION_YEARS = 5;
export const PIECE_NOTICE_DAYS = 30;

const SENSITIVE_KEYS = ["passport_no", "salary_base", "cnps_number", "piece", "attachment", "file"];

export function verifyHubSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = header.slice("sha256=".length);
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function acceptOnce(seen: Set<string>, externalId: string): boolean {
  if (!externalId || seen.has(externalId)) return false;
  seen.add(externalId);
  return true;
}

export function cappedPaymentAmount(asked: number, remaining: number): number | null {
  if (!Number.isFinite(asked) || asked <= 0) return null;
  if (!Number.isFinite(remaining) || remaining <= 0) return null;
  if (asked > remaining) return null;
  return Math.round(asked);
}

export function retainUntil(createdAt: string): string {
  const date = new Date(createdAt);
  date.setUTCFullYear(date.getUTCFullYear() + PIECE_RETENTION_YEARS);
  return date.toISOString().slice(0, 10);
}

export function pieceNoticeDue(retainUntilDate: string, today: string, noticeSent: boolean): boolean {
  if (noticeSent) return false;
  const limit = new Date(`${retainUntilDate}T12:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() - PIECE_NOTICE_DAYS);
  return today >= limit.toISOString().slice(0, 10);
}

export function portalCanRead(input: { viewerContactId: string | null; rowContactId: string | null }): boolean {
  return Boolean(input.viewerContactId && input.viewerContactId === input.rowContactId);
}

export function aiPayload(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (SENSITIVE_KEYS.some((part) => key.toLowerCase().includes(part))) continue;
    out[key] = value;
  }
  return out;
}

export const WHATSAPP_TEMPLATES = [
  { key: "echeance", label: "Rappel d'échéance" },
  { key: "paiement_recu", label: "Paiement reçu" },
  { key: "ambassade", label: "Rendez-vous ambassade" },
  { key: "piece_manquante", label: "Document manquant" },
  { key: "relance_prospect", label: "Relance de prospect" },
] as const;
