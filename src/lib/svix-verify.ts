import { createHmac, timingSafeEqual } from "crypto";

export const SVIX_MAX_SKEW_SECONDS = 5 * 60;

export class WebhookAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookAuthError";
  }
}

function decodeWhsec(secret: string): Buffer {
  const raw = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  return Buffer.from(raw, "base64");
}

export function verifySvixSignature(input: {
  rawBody: string;
  svixId: string;
  svixTimestamp: string;
  svixSignature: string;
  secret: string;
  nowMs?: number;
}): void {
  if (!input.secret) throw new WebhookAuthError("missing_secret");
  if (!input.svixId || !input.svixTimestamp || !input.svixSignature) {
    throw new WebhookAuthError("missing_headers");
  }
  const ts = Number(input.svixTimestamp);
  if (!Number.isFinite(ts)) throw new WebhookAuthError("bad_timestamp");
  const now = Math.floor((input.nowMs ?? Date.now()) / 1000);
  if (Math.abs(now - ts) > SVIX_MAX_SKEW_SECONDS) throw new WebhookAuthError("stale_timestamp");

  const signed = `${input.svixId}.${input.svixTimestamp}.${input.rawBody}`;
  const expected = createHmac("sha256", decodeWhsec(input.secret)).update(signed).digest();
  const provided = input.svixSignature
    .split(" ")
    .map((part) => part.replace(/^v1,?/, "").trim())
    .filter(Boolean);

  let ok = false;
  for (const sig of provided) {
    const buf = Buffer.from(sig, "base64");
    if (buf.length === expected.length && timingSafeEqual(buf, expected)) ok = true;
  }
  if (!ok) throw new WebhookAuthError("bad_signature");
}

export function verifySharedInboundSecret(provided: string | null, expected: string | undefined): void {
  if (!expected) throw new WebhookAuthError("missing_secret");
  const a = Buffer.from(provided ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new WebhookAuthError("bad_secret");
}
