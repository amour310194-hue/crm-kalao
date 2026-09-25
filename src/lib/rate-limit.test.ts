import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST as confirmReset } from "@/app/api/auth/reset-confirm/route";
import {
  RESET_CONFIRM_MAX,
  RESET_CONFIRM_WINDOW,
  enforceRateLimits,
  memoryRateLimitStore,
  supabaseRateLimitStore,
} from "@/lib/rate-limit";

describe("memoryRateLimitStore", () => {
  it("autorise jusqu'au plafond puis refuse", async () => {
    const store = memoryRateLimitStore();
    for (let i = 0; i < 3; i++) {
      const hit = await store.hit("k", 60, 3);
      expect(hit.ok).toBe(true);
    }
    const blocked = await store.hit("k", 60, 3);
    expect(blocked.ok).toBe(false);
  });
});

describe("enforceRateLimits", () => {
  it("signale limited après le plafond", async () => {
    const store = memoryRateLimitStore();
    for (let i = 0; i < 2; i++) {
      const r = await enforceRateLimits(store, [{ key: "ip", windowSeconds: 60, max: 2 }]);
      expect(r.limited).toBe(false);
    }
    const r = await enforceRateLimits(store, [{ key: "ip", windowSeconds: 60, max: 2 }]);
    expect(r.limited).toBe(true);
  });
});

describe("supabaseRateLimitStore", () => {
  it("replie sur la mémoire si le service_role est absent", async () => {
    const store = supabaseRateLimitStore();
    const hit = await store.hit("fallback-test", 60, 5);
    expect(hit.ok).toBe(true);
    expect(hit.count).toBeGreaterThan(0);
  });
});

describe("POST /api/auth/reset-confirm rate limit", () => {
  it("renvoie 429 au-delà de la limite par IP", async () => {
    const store = memoryRateLimitStore();
    const ip = "203.0.113.9";
    for (let i = 0; i < RESET_CONFIRM_MAX; i++) {
      await store.hit(`reset-confirm:ip:${ip}`, RESET_CONFIRM_WINDOW, RESET_CONFIRM_MAX);
    }
    const request = new NextRequest("http://localhost/api/auth/reset-confirm", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({
        email: "amour@groupe-kalao.com",
        code: "000000",
        password: "MotDePasse12!",
      }),
    });
    const last = await confirmReset(request, { rateLimit: store });
    expect(last.status).toBe(429);
    const json = (await last.json()) as { reason?: string };
    expect(json.reason).toBe("too_many_requests");
  });
});
