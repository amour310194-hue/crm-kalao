/** Logique de la route /api/auth/reset-request, séparée pour pouvoir injecter le limiteur dans les tests
 * (Next 16 impose que le 2e argument d'un handler de route soit son contexte). */
import type { NextRequest } from "next/server";
import { lookupUserIdByEmail, issuePasswordReset } from "@/lib/password-reset";
import {
  RESET_REQUEST_EMAIL_MAX,
  RESET_REQUEST_EMAIL_WINDOW,
  RESET_REQUEST_IP_MAX,
  RESET_REQUEST_IP_WINDOW,
  clientIp,
  enforceRateLimits,
  supabaseRateLimitStore,
  type RateLimitStore,
} from "@/lib/rate-limit";

function sameOk() {
  return Response.json({ ok: true });
}

export async function handleResetRequest(
  request: NextRequest,
  deps?: { rateLimit?: RateLimitStore }
) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }
  if (!email) return Response.json({ ok: false, reason: "missing_email" }, { status: 400 });

  const store = deps?.rateLimit ?? supabaseRateLimitStore();
  const ip = clientIp(request);
  const limited = await enforceRateLimits(store, [
    { key: `reset-request:ip:${ip}`, windowSeconds: RESET_REQUEST_IP_WINDOW, max: RESET_REQUEST_IP_MAX },
    { key: `reset-request:email:${email}`, windowSeconds: RESET_REQUEST_EMAIL_WINDOW, max: RESET_REQUEST_EMAIL_MAX },
  ]);
  if (limited.limited) {
    return Response.json(
      { ok: false, reason: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  try {
    const userId = await lookupUserIdByEmail(email);
    if (userId) await issuePasswordReset(email, userId);
    return sameOk();
  } catch {
    return sameOk();
  }
}
