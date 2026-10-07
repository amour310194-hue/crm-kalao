import { describe, expect, it } from "vitest";
import {
  canDeleteAccount,
  canEditFinance,
  canEditOrgSettings,
  isMfaExemptPath,
  isPublicPath,
  isSettingsPath,
  mustEnrollMfa,
} from "@/lib/authz";

describe("isPublicPath", () => {
  it("laisse passer login et reset", () => {
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/reset-password")).toBe(true);
    expect(isPublicPath("/forgot-password")).toBe(true);
    expect(isPublicPath("/l/devis-visa")).toBe(true);
  });

  it("protège le CRM et les paramètres", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/crm/contact-grid")).toBe(false);
    expect(isPublicPath("/docs/invoice/x")).toBe(false);
    expect(isPublicPath("/leads")).toBe(false);
    expect(isPublicPath("/leads-list")).toBe(false);
    expect(isPublicPath("/mfa-setup")).toBe(false);
    expect(isPublicPath("/general-settings/security")).toBe(false);
    expect(isPublicPath("/general-settings/profile-settings")).toBe(false);
    expect(isPublicPath("/website-settings/language-web")).toBe(false);
  });
});

describe("isSettingsPath", () => {
  it("reconnaît les écrans paramètres", () => {
    expect(isSettingsPath("/general-settings/security")).toBe(true);
    expect(isSettingsPath("/website-settings/language-web")).toBe(true);
    expect(isSettingsPath("/dashboard")).toBe(false);
    expect(isSettingsPath("/login")).toBe(false);
  });
});

describe("isMfaExemptPath", () => {
  it("n’exempte que l’inscription 2FA, jamais les paramètres", () => {
    expect(isMfaExemptPath("/mfa-setup")).toBe(true);
    expect(isMfaExemptPath("/mfa-setup/")).toBe(true);
    expect(isMfaExemptPath("/general-settings/security")).toBe(false);
    expect(isMfaExemptPath("/general-settings/security/")).toBe(false);
    expect(isMfaExemptPath("/general-settings/notification")).toBe(false);
    expect(isMfaExemptPath("/general-settings/profile-settings")).toBe(false);
    expect(isMfaExemptPath("/website-settings/language-web")).toBe(false);
    expect(isMfaExemptPath("/dashboard")).toBe(false);
    expect(isMfaExemptPath("/login")).toBe(false);
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

describe("canEditFinance", () => {
  it("autorise admin, direction et finance", () => {
    expect(canEditFinance("admin")).toBe(true);
    expect(canEditFinance("finance")).toBe(true);
    expect(canEditFinance("staff")).toBe(false);
    expect(canEditFinance("commercial")).toBe(false);
  });
});

describe("mustEnrollMfa", () => {
  it("renvoie un compte direction sans aal2 vers l’inscription 2FA", () => {
    expect(mustEnrollMfa("direction", "aal1")).toBe(true);
    expect(mustEnrollMfa("direction", "aal2")).toBe(false);
    expect(mustEnrollMfa("staff", "aal1")).toBe(false);
    expect(mustEnrollMfa("finance", null)).toBe(true);
  });

  it("accepte un code e-mail déjà validé pour la session", () => {
    expect(mustEnrollMfa("direction", "aal1", true)).toBe(false);
  });
});
