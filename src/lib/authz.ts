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
  "/mfa-setup",
  "/l",
];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isMfaExemptPath(pathname: string): boolean {
  return (
    pathname === "/mfa-setup" ||
    pathname === "/general-settings/security" ||
    pathname.startsWith("/general-settings/security/")
  );
}

export function mfaEnforced(): boolean {
  return process.env.MFA_ENFORCE !== "0" && process.env.MFA_ENFORCE !== "false";
}

export function roleNeedsMfa(role?: string | null): boolean {
  return Boolean(role && MFA_REQUIRED_ROLES.includes(role as AccountRole));
}

/** direction/admin/finance/rh : session aal2 obligatoire (sauf /mfa-setup). */
export function mustEnrollMfa(role?: string | null, aal?: string | null): boolean {
  if (!mfaEnforced()) return false;
  if (!roleNeedsMfa(role)) return false;
  return aal !== "aal2";
}

/** Session : 12 h d'inactivité, 7 j max (côté cookie / JWT). */
export const SESSION_IDLE_SECONDS = 12 * 60 * 60;
export const SESSION_MAX_SECONDS = 7 * 24 * 60 * 60;
