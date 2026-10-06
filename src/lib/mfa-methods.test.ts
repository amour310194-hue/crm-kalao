import { describe, expect, it } from "vitest";
import { collectMfaFactors, hasVerifiedMfa, toE164 } from "@/lib/mfa-methods";

describe("toE164", () => {
  it("préfixe le Cameroun à 9 chiffres", () => {
    expect(toE164("690123456")).toBe("+237690123456");
  });

  it("conserve un + international", () => {
    expect(toE164("+33601020304")).toBe("+33601020304");
  });

  it("refuse un numéro trop court", () => {
    expect(toE164("123")).toBeNull();
  });
});

describe("collectMfaFactors", () => {
  it("agrège totp et téléphone vérifiés", () => {
    const factors = collectMfaFactors({
      totp: [{ id: "1", status: "verified", factor_type: "totp" }],
      phone: [{ id: "2", status: "unverified", factor_type: "phone" }],
    });
    expect(hasVerifiedMfa(factors)).toBe(true);
    expect(factors).toHaveLength(2);
  });
});
