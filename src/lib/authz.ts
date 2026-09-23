export const ACCOUNT_ROLES = ["super_admin", "admin", "manager", "rh", "staff"] as const;
export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export function isCrmAdmin(role?: string | null): boolean {
  return role === "super_admin" || role === "admin" || role === "manager";
}

export function canCreateStaffAccount(role?: string | null): boolean {
  return role === "super_admin" || role === "admin" || role === "manager" || role === "rh";
}

export function canAssignRole(actor: string | null | undefined, next: string): boolean {
  if (!ACCOUNT_ROLES.includes(next as AccountRole)) return false;
  if (actor === "super_admin") return true;
  if (actor === "admin") return next !== "super_admin";
  if (actor === "manager" || actor === "rh") return next === "staff" || next === "rh";
  return false;
}
