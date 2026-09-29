import { describe, expect, it } from "vitest";
import { validateConvertService } from "@/lib/crm";

describe("validateConvertService", () => {
  it("refuse sans service", () => {
    expect(validateConvertService({})).toBe("Choisissez un service.");
    expect(validateConvertService({ catalogItemId: "x", label: "", unitPrice: 1 })).toBe(
      "Choisissez un service."
    );
  });

  it("accepte un service avec montant", () => {
    expect(
      validateConvertService({
        catalogItemId: "svc-1",
        label: "Visa Canada",
        unitPrice: 4500000,
      })
    ).toBeNull();
  });
});
