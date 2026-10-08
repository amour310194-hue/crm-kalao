import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import {
  acceptOnce,
  aiPayload,
  cappedPaymentAmount,
  pieceNoticeDue,
  portalCanRead,
  retainUntil,
  verifyHubSignature,
  WHATSAPP_TEMPLATES,
} from "./prompt3-rules";

describe("webhooks", () => {
  it("rejette une signature invalide", () => {
    expect(verifyHubSignature("{}", "sha256=abcd", "secret")).toBe(false);
    expect(verifyHubSignature("{}", null, "secret")).toBe(false);
  });

  it("accepte la signature Meta", () => {
    const body = '{"id":"1"}';
    const sig = createHmac("sha256", "secret").update(body).digest("hex");
    expect(verifyHubSignature(body, `sha256=${sig}`, "secret")).toBe(true);
  });

  it("ignore un événement rejoué", () => {
    const seen = new Set<string>();
    expect(acceptOnce(seen, "m1")).toBe(true);
    expect(acceptOnce(seen, "m1")).toBe(false);
    for (let i = 0; i < 500; i += 1) acceptOnce(seen, `burst-${i}`);
    expect(seen.size).toBe(501);
    expect(acceptOnce(seen, "burst-10")).toBe(false);
  });
});

describe("paiement et pièces", () => {
  it("plafonne le lien au reste dû", () => {
    expect(cappedPaymentAmount(5000, 4000)).toBeNull();
    expect(cappedPaymentAmount(4000, 4000)).toBe(4000);
  });

  it("signale une pièce trente jours avant les cinq ans", () => {
    expect(retainUntil("2026-10-09")).toBe("2031-10-09");
    expect(pieceNoticeDue("2031-10-09", "2031-09-10", false)).toBe(true);
    expect(pieceNoticeDue("2031-10-09", "2031-09-01", false)).toBe(false);
    expect(pieceNoticeDue("2031-10-09", "2031-09-10", true)).toBe(false);
  });
});

describe("portail et assistant", () => {
  it("un client ne lit pas le dossier d'un autre", () => {
    expect(portalCanRead({ viewerContactId: "a", rowContactId: "a" })).toBe(true);
    expect(portalCanRead({ viewerContactId: "a", rowContactId: "b" })).toBe(false);
  });

  it("retire le passeport avant un envoi à l'assistant", () => {
    expect(aiPayload({ title: "Dossier", passport_no: "AB123", salary_base: 100 })).toEqual({ title: "Dossier" });
  });

  it("prépare les cinq modèles WhatsApp, sans les soumettre", () => {
    expect(WHATSAPP_TEMPLATES).toHaveLength(5);
  });
});
