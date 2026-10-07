import { describe, expect, it } from "vitest";
import {
  generateOtp,
  packChallenge,
  packEmailMfaOk,
  readEmailMfaOk,
  verifyChallengeCookie,
} from "./mfa-email";

describe("mfa e-mail", () => {
  it("génère un code à 6 chiffres", () => {
    expect(generateOtp()).toMatch(/^\d{6}$/);
  });

  it("accepte le bon code et refuse un faux", () => {
    process.env.MFA_COOKIE_SECRET = "a".repeat(32);
    const packed = packChallenge("user-1", "123456");
    expect(verifyChallengeCookie(packed.value, "user-1", "123456")).toBe(true);
    expect(verifyChallengeCookie(packed.value, "user-1", "000000")).toBe(false);
    expect(verifyChallengeCookie(packed.value, "other", "123456")).toBe(false);
  });

  it("marque la session e-mail uniquement pour le bon compte", () => {
    process.env.MFA_COOKIE_SECRET = "a".repeat(32);
    const ok = packEmailMfaOk("user-1", "sess-aaaa");
    expect(readEmailMfaOk(ok.value, "user-1", "sess-aaaa")).toBe(true);
    expect(readEmailMfaOk(ok.value, "user-1", "other")).toBe(false);
    expect(readEmailMfaOk(ok.value, "user-2", "sess-aaaa")).toBe(false);
  });
});
