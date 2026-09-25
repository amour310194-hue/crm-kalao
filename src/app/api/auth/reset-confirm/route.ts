import { NextRequest } from "next/server";
import { consumePasswordReset, ResetError, RESET_FAIL_MESSAGE } from "@/lib/password-reset";
import {
  RESET_CONFIRM_MAX,
  RESET_CONFIRM_WINDOW,
  clientIp,
  enforceRateLimits,
  supabaseRateLimitStore,
  type RateLimitStore,
} from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  deps?: { rateLimit?: RateLimitStore }
) {
  let payload: { email?: string; code?: string; token?: string; password?: string } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }

  const store = deps?.rateLimit ?? supabaseRateLimitStore();
  const ip = clientIp(request);
  const email = String(payload.email ?? "").trim().toLowerCase();
  const limited = await enforceRateLimits(store, [
    { key: `reset-confirm:ip:${ip}`, windowSeconds: RESET_CONFIRM_WINDOW, max: RESET_CONFIRM_MAX },
    ...(email
      ? [{ key: `reset-confirm:email:${email}`, windowSeconds: RESET_CONFIRM_WINDOW, max: RESET_CONFIRM_MAX }]
      : []),
  ]);
  if (limited.limited) {
    return Response.json(
      { ok: false, reason: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  try {
    await consumePasswordReset({
      email: payload.email,
      code: payload.code,
      token: payload.token,
      password: String(payload.password ?? ""),
    });
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof ResetError ? err.message : RESET_FAIL_MESSAGE;
    const status = message.startsWith("Le mot de passe") || message.startsWith("Le mot de passe ne") ? 400 : 400;
    return Response.json({ ok: false, reason: message }, { status });
  }
}
