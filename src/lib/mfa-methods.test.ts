import { describe, expect, it } from "vitest";
import { collectMfaFactors, explainMfaError, hasVerifiedMfa, unverifiedFactors } from "@/lib/mfa-methods";

describe("collectMfaFactors", () => {
  it("ne retient que l’appli d’authentification", () => {
    const factors = collectMfaFactors({
      totp: [{ id: "1", status: "verified", factor_type: "totp" }],
      phone: [{ id: "2", status: "unverified", factor_type: "phone" }],
    });
    expect(hasVerifiedMfa(factors)).toBe(true);
    expect(factors).toHaveLength(1);
    expect(unverifiedFactors(factors)).toHaveLength(0);
  });
});

describe("explainMfaError", () => {
  it("explique un doublon d’enrôlement", () => {
    expect(explainMfaError("A factor with this friendly name already exists")).toMatch(/appli/i);
  });
});
