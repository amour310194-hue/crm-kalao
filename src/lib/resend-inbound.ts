import { inboundEndpoint } from "@/lib/org";

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
    return { ok: true, reason: "exists", id: existing.id, endpoint };
  }

  const res = await fetch("https://api.resend.com/webhooks", {
    method: "POST",
    headers,
    body: JSON.stringify({ endpoint, events: ["email.received"] }),
  });
  const json = (await res.json()) as { id?: string; message?: string };
  if (!res.ok || !json.id) {
    return { ok: false, reason: json.message || "create_failed", endpoint };
  }
  return { ok: true, reason: "created", id: json.id, endpoint };
}
