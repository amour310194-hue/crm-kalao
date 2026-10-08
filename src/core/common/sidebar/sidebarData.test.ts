import { describe, expect, it } from "vitest";
import { SidebarData } from "@/core/common/sidebar/sidebarData";

function labels(section: string) {
  return SidebarData.find((entry) => entry.tittle === section)?.submenuItems.map((item) => item.label) ?? [];
}

describe("menu visible", () => {
  it("retire du CRM les écrans qui ne servent pas au quotidien", () => {
    expect(labels("CRM")).toEqual([
      "Clients",
      "Fournisseurs",
      "Affaires",
      "Prospects",
      "Formulaires de capture",
      "Factures",
      "Objectifs",
      "Assistant",
      "À valider",
      "Paiements",
      "Activités",
    ]);
  });

  it("garde le courriel et retire le gestionnaire de fichiers du modèle", () => {
    const outils = SidebarData.find((entry) => entry.tittle === "Menu")?.submenuItems.find(
      (item) => item.label === "Outils"
    );
    expect(outils?.submenuItems.map((item) => item.label)).toEqual(["Calendrier", "Messagerie"]);
  });
});
