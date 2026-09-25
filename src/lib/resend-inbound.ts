import { inboundEndpoint } from "@/lib/org";
import { DELIVERY_EVENTS } from "@/lib/mail/server/delivery";

/** Réception + suivi de livraison sur le même point d'entrée signé. */
export const WEBHOOK_EVENTS = ["email.received", ...Object.keys(DELIVERY_EVENTS)];

export type ResendWebhookRow = {
  id?: string;
  endpoint?: string;
  events?: string[];
  status?: string;
};

function authHeaders() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function listResendWebhooks(): Promise<ResendWebhookRow[]> {
  const headers = authHeaders();
  if (!headers) return [];
  const res = await fetch("https://api.resend.com/webhooks", { headers });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: ResendWebhookRow[] };
  return json.data ?? [];
}

export function isInboundWebhook(row: ResendWebhookRow, endpoint = inboundEndpoint()) {
  const url = String(row.endpoint ?? "").replace(/\/$/, "");
  const events = row.events ?? [];
  return url === endpoint.replace(/\/$/, "") && events.includes("email.received");
}

export async function ensureInboundWebhook(): Promise<{
  ok: boolean;
  reason: string;
  id?: string;
  endpoint: string;
}> {
  const endpoint = inboundEndpoint();
  const headers = authHeaders();
  if (!headers) return { ok: false, reason: "resend_missing", endpoint };

  const existing = (await listResendWebhooks()).find((row) => isInboundWebhook(row, endpoint));
  if (existing?.id) {
    const missing = WEBHOOK_EVENTS.filter((e) => !(existing.events ?? []).includes(e));
    if (!missing.length) return { ok: true, reason: "exists", id: existing.id, endpoint };
    const res = await fetch(`https://api.resend.com/webhooks/${existing.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ events: WEBHOOK_EVENTS }),
    });
    return res.ok
      ? { ok: true, reason: "events_updated", id: existing.id, endpoint }
      : { ok: false, reason: `update_failed (${res.status})`, id: existing.id, endpoint };
  }

  const res = await fetch("https://api.resend.com/webhooks", {
    method: "POST",
    headers,
    body: JSON.stringify({ endpoint, events: WEBHOOK_EVENTS }),
  });
  const json = (await res.json()) as { id?: string; message?: string };
  if (!res.ok || !json.id) {
    return { ok: false, reason: json.message || "create_failed", endpoint };
  }
  return { ok: true, reason: "created", id: json.id, endpoint };
}
