/** Appels à l'API Resend (serveur uniquement). */

const API = "https://api.resend.com";

export type ResendResult<T> = { ok: true; data: T } | { ok: false; status: number; detail: string };

function key(): string | null {
  return process.env.RESEND_API_KEY || null;
}

export function resendConfigured(): boolean {
  return Boolean(key());
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function resendFetch<T>(
  path: string,
  init?: { method?: string; body?: unknown; idempotencyKey?: string; retries?: number }
): Promise<ResendResult<T>> {
  const token = key();
  if (!token) return { ok: false, status: 0, detail: "RESEND_API_KEY manquant" };
  const retries = init?.retries ?? 2;
  let last: ResendResult<T> = { ok: false, status: 0, detail: "resend_error" };
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    };
    if (init?.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;
    let res: Response;
    try {
      res = await fetch(`${API}${path}`, {
        method: init?.method ?? "GET",
        headers,
        body: init?.body === undefined ? undefined : JSON.stringify(init.body),
      });
    } catch (err) {
      last = { ok: false, status: 0, detail: err instanceof Error ? err.message : "network_error" };
      await sleep(400 * (attempt + 1));
      continue;
    }
    const raw = await res.text();
    let json: unknown = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = null;
    }
    if (res.ok) return { ok: true, data: json as T };
    const parsed = (json ?? {}) as { message?: string; name?: string };
    last = {
      ok: false,
      status: res.status,
      detail: [parsed.name, parsed.message].filter(Boolean).join(": ") || raw.slice(0, 280) || `HTTP ${res.status}`,
    };
    // 429 (quota 2 req/s) et 5xx : on retente ; 404 juste après réception aussi (propagation).
    if (res.status === 429 || res.status >= 500 || (res.status === 404 && path.includes("/receiving/"))) {
      await sleep(700 * (attempt + 1));
      continue;
    }
    return last;
  }
  return last;
}

export type ResendSendBody = {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  reply_to?: string | string[];
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  attachments?: { filename: string; path?: string; content?: string; content_type?: string }[];
  scheduled_at?: string;
  tags?: { name: string; value: string }[];
};

export function resendSend(body: ResendSendBody, idempotencyKey: string) {
  return resendFetch<{ id: string }>("/emails", { method: "POST", body, idempotencyKey, retries: 1 });
}

export function resendCancel(id: string) {
  return resendFetch<{ id: string }>(`/emails/${encodeURIComponent(id)}/cancel`, { method: "POST", retries: 1 });
}

export type ResendReceived = {
  id: string;
  from?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  reply_to?: string[];
  received_for?: string[];
  subject?: string;
  html?: string | null;
  text?: string | null;
  html_format?: "data_uri" | "cid";
  created_at?: string;
  message_id?: string;
  headers?: Record<string, string>;
  authentication?: { spf?: string; dkim?: string; dmarc?: string };
  attachments?: {
    id: string;
    filename: string;
    content_type?: string;
    content_disposition?: string | null;
    content_id?: string | null;
    size?: number;
  }[];
};

export function resendGetReceived(id: string) {
  return resendFetch<ResendReceived>(`/emails/receiving/${encodeURIComponent(id)}`);
}

export type ResendReceivedAttachment = {
  id: string;
  filename: string;
  size?: number;
  content_type?: string;
  content_disposition?: string | null;
  content_id?: string | null;
  download_url: string;
  expires_at?: string;
};

export function resendListReceivedAttachments(emailId: string) {
  return resendFetch<{ data?: ResendReceivedAttachment[] }>(
    `/emails/receiving/${encodeURIComponent(emailId)}/attachments?limit=100`
  );
}

export function resendListReceived(limit = 50) {
  return resendFetch<{ data?: { id?: string; email_id?: string }[] }>(`/emails/receiving?limit=${limit}`);
}
