import { createHmac, timingSafeEqual } from "crypto";
import { generateOtp, sessionFingerprint } from "@/lib/mfa-email";

export const FINANCE_OK_COOKIE = "kalao_finance_unlock";
export const FINANCE_CHAL_COOKIE = "kalao_finance_chal";
export const FINANCE_UNLOCK_TTL_SEC = 30 * 60;
export const FINANCE_CHAL_TTL_SEC = 10 * 60;

function secret(): string {
  return process.env.MFA_COOKIE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function financeUnlockConfigured(): boolean {
  return secret().length >= 16;
}

function hmac(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function same(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export { generateOtp };

export function packFinanceChallenge(userId: string, code: string): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + FINANCE_CHAL_TTL_SEC;
  const mac = hmac(`finotp:${userId}:${code}:${exp}`);
  return { value: `${userId}.${exp}.${mac}`, maxAge: FINANCE_CHAL_TTL_SEC };
}

export function verifyFinanceChallenge(raw: string | undefined, userId: string, code: string): boolean {
  if (!raw || !financeUnlockConfigured()) return false;
  const [uid, expS, mac] = raw.split(".");
  const exp = Number(expS);
  if (!uid || !mac || uid !== userId || !Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  return same(mac, hmac(`finotp:${userId}:${code.trim()}:${exp}`));
}

export function packFinanceOk(userId: string, sessionFp: string): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + FINANCE_UNLOCK_TTL_SEC;
  const mac = hmac(`finok:${userId}:${sessionFp}:${exp}`);
  return { value: `${userId}.${sessionFp}.${exp}.${mac}`, maxAge: FINANCE_UNLOCK_TTL_SEC };
}

export function readFinanceOk(raw: string | undefined, userId: string, sessionFp: string): boolean {
  if (!raw || !financeUnlockConfigured() || !sessionFp) return false;
  const [uid, fp, expS, mac] = raw.split(".");
  const exp = Number(expS);
  if (!uid || !fp || !mac || uid !== userId || fp !== sessionFp || !Number.isFinite(exp) || exp * 1000 < Date.now()) {
    return false;
  }
  return same(mac, hmac(`finok:${userId}:${sessionFp}:${exp}`));
}

export function financeCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export { sessionFingerprint };
