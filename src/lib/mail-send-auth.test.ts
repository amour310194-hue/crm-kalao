import { describe, expect, it } from "vitest";
import { authorizeSender } from "@/lib/mail-send-auth";
import { KALAO_CONTACT_EMAIL } from "@/lib/org";

describe("authorizeSender", () => {
  const staff = {
    workEmail: "danela@groupe-kalao.com",
    fullName: "Danela Nanda",
  };

  it("un staff sans ACL ne peut pas envoyer depuis contact", () => {
    const result = authorizeSender({
      ...staff,
      mailbox: "contact",
      allowedShared: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it("un staff ne peut pas usurper direction@groupe-kalao.com", () => {
    const result = authorizeSender({
      ...staff,
      mailbox: "personal",
      requestedFrom: "Direction <direction@groupe-kalao.com>",
      allowedShared: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it("autorise contact si l'ACL l'ouvre", () => {
    const result = authorizeSender({
      ...staff,
      mailbox: "contact",
      allowedShared: ["contact"],
    });
    expect(result).toEqual({
      ok: true,
      mailbox: "contact",
      from: `Contact Kalao <${KALAO_CONTACT_EMAIL}>`,
    });
  });

  it("autorise uniquement l'adresse personnelle du profil", () => {
    const result = authorizeSender({
      ...staff,
      mailbox: "personal",
      requestedFrom: "Danela Nanda <danela@groupe-kalao.com>",
      allowedShared: [],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.from).toContain("danela@groupe-kalao.com");
  });
});
