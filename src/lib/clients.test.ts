import { describe, expect, it } from "vitest";
import { canRestore, findDuplicates, missingCoordinates, normalizePhone, parseCsv, previewImport, validateEmail } from "./clients";

describe("coordonnées", () => {
  it("met le Cameroun par défaut et refuse un numéro vide", () => {
    expect(normalizePhone("699000000")).toBe("+237699000000");
    expect(normalizePhone("+33 6 12 34 56 78")).toBe("+33612345678");
    expect(() => normalizePhone("")).toThrow(/obligatoire/);
  });

  it("valide l'e-mail sans en inventer", () => {
    expect(validateEmail("")).toBeNull();
    expect(validateEmail("A@Kalao.cm")).toBe("a@kalao.cm");
    expect(() => validateEmail("pas-un-email")).toThrow(/invalide/);
  });

  it("signale une fiche incomplète", () => {
    expect(missingCoordinates({ phone: "+237699000000", email: "" })).toBe(true);
    expect(missingCoordinates({ phone: "+237699000000", email: "a@kalao.cm" })).toBe(false);
  });
});

describe("doublons et import", () => {
  const rows = [{ id: "1", first_name: "Steve", last_name: "Ello", phone: "+237699000000", email: "a@kalao.cm" }];

  it("retrouve un homonyme, un téléphone ou un e-mail", () => {
    expect(findDuplicates(rows, { first_name: "Steve", last_name: "Ello", phone: "600000000" })).toHaveLength(1);
    expect(findDuplicates(rows, { first_name: "Awa", last_name: "Ngo", phone: "699000000" })).toHaveLength(1);
    expect(findDuplicates(rows, { first_name: "Awa", last_name: "Ngo", email: "a@kalao.cm" })).toHaveLength(1);
    expect(findDuplicates(rows, { first_name: "Awa", last_name: "Ngo", phone: "655000000" })).toHaveLength(0);
  });

  it("sépare les lignes valides, les erreurs et les doublons", () => {
    const table = parseCsv("prenom;nom;tel\nAwa;Ngo;655000000\nSteve;Ello;12\nSteve;Ello;699000000");
    const report = previewImport(table, { first_name: 0, last_name: 1, phone: 2 }, rows);
    expect(report.ok).toHaveLength(1);
    expect(report.errors).toHaveLength(1);
    expect(report.duplicates).toHaveLength(1);
  });
});

describe("corbeille", () => {
  it("autorise la restauration pendant 30 jours", () => {
    const now = new Date("2026-10-08T12:00:00Z");
    expect(canRestore("2026-09-20T12:00:00Z", now)).toBe(true);
    expect(canRestore("2026-09-01T12:00:00Z", now)).toBe(false);
  });
});
