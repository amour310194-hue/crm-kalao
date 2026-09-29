import { describe, expect, it } from "vitest";
import { canDeleteAccount, canEditOrgSettings, isPublicPath } from "@/lib/authz";

describe("isPublicPath", () => {
  it("laisse passer login et reset", () => {
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/reset-password")).toBe(true);
    expect(isPublicPath("/forgot-password")).toBe(true);
    expect(isPublicPath("/mfa-setup")).toBe(true);
    expect(isPublicPath("/l/devis-visa")).toBe(true);
  });

  it("protège le CRM", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/crm/contact-grid")).toBe(false);
    expect(isPublicPath("/docs/invoice/x")).toBe(false);
    expect(isPublicPath("/leads")).toBe(false);
    expect(isPublicPath("/leads-list")).toBe(false);
  });
});

describe("canDeleteAccount", () => {
  it("interdit de se supprimer soi-même", () => {
    expect(canDeleteAccount("admin", "staff", true)).toBe(
      "Vous ne pouvez pas supprimer votre propre compte."
    );
  });

  it("réserve l'action aux administrateurs", () => {
    expect(canDeleteAccount("staff", "staff", false)).toBe(
      "Action réservée à un administrateur."
    );
  });

  it("seul un super-admin peut supprimer un super-admin", () => {
    expect(canDeleteAccount("admin", "super_admin", false)).toBe(
      "Seul un super-admin peut supprimer un super-admin."
    );
    expect(canDeleteAccount("super_admin", "super_admin", false)).toBeNull();
  });

  it("autorise un admin à supprimer un collaborateur", () => {
    expect(canDeleteAccount("admin", "staff", false)).toBeNull();
  });
});

describe("canEditOrgSettings", () => {
  it("réserve l'écriture aux super-admin, admin et direction", () => {
    expect(canEditOrgSettings("super_admin")).toBe(true);
    expect(canEditOrgSettings("admin")).toBe(true);
    expect(canEditOrgSettings("direction")).toBe(true);
    expect(canEditOrgSettings("manager")).toBe(false);
    expect(canEditOrgSettings("staff")).toBe(false);
  });
});
