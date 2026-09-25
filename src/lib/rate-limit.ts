import { timingSafeEqual } from "crypto";

export type RateLimitHit = {
  ok: boolean;
  count: number;
  retryAfter: number;
};

export type RateLimitStore = {
  hit(key: string, windowSeconds: number, max: number): Promise<RateLimitHit>;
};

/** Compteur en mémoire — tests et repli si la base est indisponible. */
export function memoryRateLimitStore(): RateLimitStore {
  const rows = new Map<string, { count: number; windowStart: number }>();
  return {
    async hit(key, windowSeconds, max) {
      const now = Date.now();
      const current = rows.get(key);
      if (!current || now - current.windowStart > windowSeconds * 1000) {
        rows.set(key, { count: 1, windowStart: now });
        return { ok: 1 <= max, count: 1, retryAfter: windowSeconds };
      }
      current.count += 1;
      const retryAfter = Math.max(
        0,
        windowSeconds - Math.floor((now - current.windowStart) / 1000)
      );
      return { ok: current.count <= max, count: current.count, retryAfter };
    },
  };
}

export const RESET_REQUEST_EMAIL_MAX = 5;
export const RESET_REQUEST_EMAIL_WINDOW = 60 * 60;
export const RESET_REQUEST_IP_MAX = 20;
export const RESET_REQUEST_IP_WINDOW = 60 * 60;
export const RESET_CONFIRM_MAX = 10;
export const RESET_CONFIRM_WINDOW = 15 * 60;

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function enforceRateLimits(
  store: RateLimitStore,
  checks: { key: string; windowSeconds: number; max: number }[]
): Promise<{ limited: true; retryAfter: number } | { limited: false }> {
  for (const check of checks) {
    const hit = await store.hit(check.key, check.windowSeconds, check.max);
    if (!hit.ok) return { limited: true, retryAfter: hit.retryAfter };
  }
  return { limited: false };
}

const memoryFallback = memoryRateLimitStore();

export function supabaseRateLimitStore(): RateLimitStore {
  return {
    async hit(key, windowSeconds, max) {
      try {
        const { getServiceSupabase } = await import("@/lib/supabase/admin");
        const { data, error } = await getServiceSupabase().rpc("hit_rate_limit", {
          p_key: key,
          p_window_seconds: windowSeconds,
          p_max: max,
        });
        if (error) throw new Error(error.message);
        const rec = data as { ok?: boolean; count?: number; retry_after?: number };
        return {
          ok: Boolean(rec?.ok),
          count: Number(rec?.count ?? 0),
          retryAfter: Number(rec?.retry_after ?? windowSeconds),
        };
      } catch {
        return memoryFallback.hit(key, windowSeconds, max);
      }
    },
  };
}

export function hashesEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    const dummy = Buffer.alloc(a.length);
    timingSafeEqual(a, dummy);
    return false;
  }
  return timingSafeEqual(a, b);
}
