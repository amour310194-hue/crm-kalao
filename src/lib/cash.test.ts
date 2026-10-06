import { describe, expect, it } from "vitest";
import {
  cashDelta,
  impliedDirection,
  toCashOperationInsert,
  validateCashOperationInput,
} from "@/lib/cash";
import { validatePaymentPatch } from "@/lib/crm";

describe("validateCashOperationInput", () => {
  const base = {
    kind: "recette" as const,
    label: "Vente comptoir",
    amount: 5000,
    occurred_at: "2026-10-06",
    method: "cash" as const,
  };

  it("refuse un montant nul", () => {
    expect(validateCashOperationInput({ ...base, amount: 0 })).toBe("Le montant doit être supérieur à 0.");
  });

  it("fixe le sens selon le type", () => {
    expect(toCashOperationInsert(base).direction).toBe("entree");
    expect(toCashOperationInsert({ ...base, kind: "depot" }).direction).toBe("sortie");
    expect(impliedDirection("operation", "sortie")).toBe("sortie");
  });

  it("calcule le solde signé", () => {
    expect(cashDelta({ amount: 100, direction: "entree" })).toBe(100);
    expect(cashDelta({ amount: 40, direction: "sortie" })).toBe(-40);
  });
});

describe("validatePaymentPatch", () => {
  it("refuse un encaissement sans date", () => {
    expect(validatePaymentPatch({ amount: 10, method: "cash", paid_at: "" })).toBe("La date est requise.");
  });
});
