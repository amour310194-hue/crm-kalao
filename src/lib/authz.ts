export const ACCOUNT_ROLES = [
  "super_admin",
  "admin",
  "manager",
  "direction",
  "finance",
  "commercial",
  "rh",
  "staff",
  "agent",
] as const;
export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export function isCrmAdmin(role?: string | null): boolean {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "manager" ||
    role === "direction"
  );
}

export function canEditOrgSettings(role?: string | null): boolean {
  return role === "super_admin" || role === "admin" || role === "direction";
}

/** Aligné sur public.is_finance() : dépenses, caisse, paiements, stock. */
export function canEditFinance(role?: string | null): boolean {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "manager" ||
    role === "direction" ||
    role === "finance"
  );
}

export function canCreateStaffAccount(role?: string | null): boolean {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "manager" ||
    role === "direction" ||
    role === "rh"
  );
}

export function canDeleteAccount(
  actorRole: string | null | undefined,
  targetRole: string | null | undefined,
  isSelf: boolean
): string | null {
  if (isSelf) return "Vous ne pouvez pas supprimer votre propre compte.";
  if (!isCrmAdmin(actorRole)) return "Action réservée à un administrateur.";
  if (targetRole === "super_admin" && actorRole !== "super_admin") {
    return "Seul un super-admin peut supprimer un super-admin.";
  }
  return null;
}

export function canAssignRole(actor: string | null | undefined, next: string): boolean {
  if (!ACCOUNT_ROLES.includes(next as AccountRole)) return false;
  if (actor === "super_admin") return true;
  if (actor === "admin" || actor === "direction") return next !== "super_admin";
  if (actor === "manager" || actor === "rh") return next === "staff" || next === "rh";
  return false;
}

export const MFA_REQUIRED_ROLES: AccountRole[] = [
  "super_admin",
  "admin",
  "direction",
  "finance",
  "rh",
];

export const PUBLIC_PATHS = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/register",
  "/email-verification",
  "/two-step-verification",
  "/lock-screen",
  "/success",
  "/coming-soon",
  "/error-404",
  "/l",
];

/** Pages paramètres : session obligatoire, 2FA aussi si le rôle l’exige. */
export const SETTINGS_PATH_PREFIXES = [
  "/general-settings",
  "/website-settings",
  "/app-settings",
  "/system-settings",
  "/financial-settings",
  "/other-settings",
];

function normalizePathname(pathname: string): string {
  const path = pathname.split("?")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function isPublicPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isSettingsPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return SETTINGS_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Seule l’inscription / le défi 2FA est hors aal2. Pas les paramètres. */
export function isMfaExemptPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return path === "/mfa-setup" || path.startsWith("/mfa-setup/");
}

export function mfaEnforced(): boolean {
  return process.env.MFA_ENFORCE !== "0" && process.env.MFA_ENFORCE !== "false";
}

export function roleNeedsMfa(role?: string | null): boolean {
  return Boolean(role && MFA_REQUIRED_ROLES.includes(role as AccountRole));
}

/** direction/admin/finance/rh : TOTP (aal2) ou code e-mail de session. */
export function mustEnrollMfa(
  role?: string | null,
  aal?: string | null,
  emailMfaOk = false
): boolean {
  if (!mfaEnforced()) return false;
  if (!roleNeedsMfa(role)) return false;
  if (aal === "aal2") return false;
  if (emailMfaOk) return false;
  return true;
}

/** Session : 12 h d'inactivité, 7 j max (côté cookie / JWT). */
export const SESSION_IDLE_SECONDS = 12 * 60 * 60;
export const SESSION_MAX_SECONDS = 7 * 24 * 60 * 60;
