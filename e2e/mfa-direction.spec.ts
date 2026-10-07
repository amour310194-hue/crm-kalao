import { test, expect } from "@playwright/test";
import {
  isMfaExemptPath,
  isPublicPath,
  isSettingsPath,
  mustEnrollMfa,
} from "../src/lib/authz";

test("un compte direction sans aal2 ne peut pas rester sur le CRM", () => {
  expect(mustEnrollMfa("direction", "aal1")).toBe(true);
  expect(mustEnrollMfa("direction", "aal2")).toBe(false);
  expect(mustEnrollMfa("finance", "aal1")).toBe(true);
  expect(mustEnrollMfa("rh", null)).toBe(true);
});

test("les paramètres ne sont ni publics ni exempts de 2FA", () => {
  for (const path of [
    "/general-settings/security",
    "/general-settings/profile-settings",
    "/website-settings/language-web",
  ]) {
    expect(isSettingsPath(path)).toBe(true);
    expect(isPublicPath(path)).toBe(false);
    expect(isMfaExemptPath(path)).toBe(false);
  }
  expect(isPublicPath("/mfa-setup")).toBe(false);
  expect(isMfaExemptPath("/mfa-setup")).toBe(true);
  expect(isPublicPath("/login")).toBe(true);
});

test("un visiteur sans session est renvoyé au login, sans lien paramètres", async ({ page }) => {
  test.skip(!process.env.E2E_BASE_URL && !process.env.PLAYWRIGHT_BASE_URL, "Serveur e2e non défini");
  await page.goto("/general-settings/security");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /se connecter/i })).toBeVisible();
  await expect(page.locator('a[href*="general-settings"]')).toHaveCount(0);
  await expect(page.locator('a[href*="website-settings"]')).toHaveCount(0);
  await page.goto("/website-settings/language-web");
  await expect(page).toHaveURL(/\/login/);
});
