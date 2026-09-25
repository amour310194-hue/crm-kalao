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

export function canCreateStaffAccount(role?: string | null): boolean {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "manager" ||
    role === "direction" ||
    role === "rh"
  );
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
];

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function mfaEnforced(): boolean {
  return process.env.MFA_ENFORCE === "1" || process.env.MFA_ENFORCE === "true";
}

export function roleNeedsMfa(role?: string | null): boolean {
  return Boolean(role && MFA_REQUIRED_ROLES.includes(role as AccountRole));
}

/** Session : 12 h d'inactivité, 7 j max (côté cookie / JWT). */
export const SESSION_IDLE_SECONDS = 12 * 60 * 60;
export const SESSION_MAX_SECONDS = 7 * 24 * 60 * 60;
