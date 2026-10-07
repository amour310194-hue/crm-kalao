import { createHash, createHmac, randomInt, timingSafeEqual } from "crypto";

export const EMAIL_MFA_OK_COOKIE = "kalao_email_mfa";
export const EMAIL_MFA_CHAL_COOKIE = "kalao_email_mfa_chal";
export const EMAIL_MFA_TTL_SEC = 12 * 60 * 60;
export const EMAIL_CHAL_TTL_SEC = 10 * 60;

function secret(): string {
  return process.env.MFA_COOKIE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function emailMfaConfigured(): boolean {
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

export function sessionFingerprint(token: string): string {
  if (!token) return "";
  return createHash("sha256").update(token).digest("hex").slice(0, 16);
}

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function packChallenge(userId: string, code: string): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + EMAIL_CHAL_TTL_SEC;
  const mac = hmac(`otp:${userId}:${code}:${exp}`);
  return { value: `${userId}.${exp}.${mac}`, maxAge: EMAIL_CHAL_TTL_SEC };
}

export function verifyChallengeCookie(raw: string | undefined, userId: string, code: string): boolean {
  if (!raw || !emailMfaConfigured()) return false;
  const [uid, expS, mac] = raw.split(".");
  const exp = Number(expS);
  if (!uid || !mac || uid !== userId || !Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = hmac(`otp:${userId}:${code.trim()}:${exp}`);
  return same(mac, expected);
}

export function packEmailMfaOk(userId: string, sessionFp: string): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + EMAIL_MFA_TTL_SEC;
  const mac = hmac(`ok:${userId}:${sessionFp}:${exp}`);
  return { value: `${userId}.${sessionFp}.${exp}.${mac}`, maxAge: EMAIL_MFA_TTL_SEC };
}

export function readEmailMfaOk(raw: string | undefined, userId: string, sessionFp: string): boolean {
  if (!raw || !emailMfaConfigured() || !sessionFp) return false;
  const [uid, fp, expS, mac] = raw.split(".");
  const exp = Number(expS);
  if (!uid || !fp || !mac || uid !== userId || fp !== sessionFp || !Number.isFinite(exp) || exp * 1000 < Date.now()) {
    return false;
  }
  return same(mac, hmac(`ok:${userId}:${sessionFp}:${exp}`));
}

export function mfaCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
