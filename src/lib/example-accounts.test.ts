import { describe, expect, it } from "vitest";
import {
  activeExampleComAccounts,
  productionSeedFilesCreatingExampleAuth,
} from "@/lib/example-accounts";

describe("activeExampleComAccounts", () => {
  it("échoue si un @example.com a un rôle actif", () => {
    const live = activeExampleComAccounts([
      { email: "amour.okala@groupe-kalao.com", role: "super_admin" },
      { email: "yuki.t@example.com", role: "admin", banned: false },
    ]);
    expect(live.map((row) => row.email)).toEqual(["yuki.t@example.com"]);
  });

  it("ignore un compte banni", () => {
    expect(
      activeExampleComAccounts([{ email: "yuki.t@example.com", role: "admin", banned: true }])
    ).toEqual([]);
  });
});

describe("seeds Auth", () => {
  it("aucune migration exécutée en production n’insère un auth.users @example.com", () => {
    expect(productionSeedFilesCreatingExampleAuth()).toEqual([]);
  });
});
