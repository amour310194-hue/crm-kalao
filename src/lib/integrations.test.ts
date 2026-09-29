import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, secretLast4 } from "@/lib/crypto-secret";
import {
  INTEGRATION_PROVIDERS,
  buildProviderStatus,
  findProvider,
  providerStatusLabel,
} from "@/lib/integrations";

describe("crypto-secret", () => {
  it("chiffre et déchiffre", () => {
    const blob = encryptSecret("whsec_abc", "master-test-key");
    expect(blob.startsWith("v1.")).toBe(true);
    expect(decryptSecret(blob, "master-test-key")).toBe("whsec_abc");
  });

  it("refuse une mauvaise clé", () => {
    const blob = encryptSecret("secret", "aaa");
    expect(() => decryptSecret(blob, "bbb")).toThrow();
  });

  it("masque en last4", () => {
    expect(secretLast4("12345678")).toBe("5678");
  });
});

describe("integrations catalog", () => {
  it("définit Meta avec App Secret et Verify Token", () => {
    const meta = findProvider("meta");
    expect(meta?.fields.some((f) => f.key === "app_secret" && f.secret)).toBe(true);
    expect(meta?.webhookPath).toBe("/api/webhooks/meta");
  });

  it("n'affiche jamais Connected : seulement non configuré ou clés enregistrées", () => {
    const meta = findProvider("meta")!;
    const empty = buildProviderStatus(meta, []);
    expect(empty.status).toBe("non_configure");
    expect(providerStatusLabel(empty.status)).toBe("Non configuré");
    const saved = buildProviderStatus(meta, [
      { field_key: "app_secret", last4: "9xyz", public_value: null, ciphertext: "v1.x" },
    ]);
    expect(saved.status).toBe("cles_enregistrees");
    expect(providerStatusLabel(saved.status)).not.toMatch(/connect/i);
  });

  it("ne renvoie pas la valeur publique d'un secret", () => {
    const meta = findProvider("meta")!;
    const status = buildProviderStatus(meta, [
      { field_key: "app_secret", last4: "abcd", public_value: "LEAK", ciphertext: "x" },
    ]);
    expect(status.fields.find((f) => f.key === "app_secret")?.publicValue).toBeNull();
  });

  it("couvre les régies prévues", () => {
    expect(INTEGRATION_PROVIDERS.map((p) => p.id)).toEqual([
      "meta",
      "tiktok",
      "google_ads",
      "linkedin",
      "sms",
      "momo",
    ]);
  });
});
