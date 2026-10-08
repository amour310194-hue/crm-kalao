import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { leadScore, passportAlert, stageAdvanceBlock } from "./pipeline-rules";

describe("passage d'étape visa", () => {
  it("bloque l'ouverture sans avance payée", () => {
    expect(
      stageAdvanceBlock({ kind: "visa", nextKey: "ouverture", advancePaid: false, checklistComplete: true })
    ).toMatch(/avance/);
  });

  it("bloque le dépôt si la checklist est incomplète", () => {
    expect(
      stageAdvanceBlock({ kind: "visa", nextKey: "soumission", advancePaid: true, checklistComplete: false })
    ).toMatch(/checklist/);
  });

  it("n'impose pas ces conditions à un chantier", () => {
    expect(
      stageAdvanceBlock({ kind: "chantier", nextKey: "ouverture", advancePaid: false, checklistComplete: false })
    ).toBeNull();
  });
});

describe("score et passeport", () => {
  it("additionne les règles simples", () => {
    expect(leadScore({ phone: "+237699000000", email: "a@kalao.cm", budget: 1000, source: "agence", hasActivity: true })).toBe(100);
    expect(leadScore({})).toBe(0);
  });

  it("alerte six mois avant l'expiration", () => {
    expect(passportAlert("2027-03-01", "2026-10-09")).toBe(true);
    expect(passportAlert("2028-01-01", "2026-10-09")).toBe(false);
  });
});

describe("migration dossiers", () => {
  const sql = readFileSync("supabase/migrations/20261009_v46_tunnel_dossiers.sql", "utf8");

  it("ne renomme que les dossiers visa encore en develop", () => {
    expect(sql).toContain("status = 'constitution'");
    expect(sql).toContain("status = 'develop'");
    expect(sql).toContain("attendu_9");
  });

  it("limite les agents aux dossiers attribués", () => {
    expect(sql).toContain("current_profile_role() is distinct from 'agent'");
    expect(sql).toContain("is_dossier_member");
  });
});
