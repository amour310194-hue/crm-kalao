import { describe, expect, it } from "vitest";
import { CRM_UI_LOCALES, localeStatusLabel } from "@/lib/ui-locale";

describe("CRM_UI_LOCALES", () => {
  it("n’expose que le français, sans statut Connected", () => {
    expect(CRM_UI_LOCALES.map((row) => row.code)).toEqual(["fr"]);
    for (const row of CRM_UI_LOCALES) {
      expect(localeStatusLabel(row.status)).not.toMatch(/connect/i);
    }
  });
});
