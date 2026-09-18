const SESSION_KEY = "crm-kalao-auth";

export const TEST_SUPER_ADMIN = {
  email: "superadmin@groupe-kalao.com",
  password: "Kalao#Admin26",
  fullName: "Super Admin Kalao",
  role: "super_admin" as const,
};

export type AuthSession = {
  email: string;
  fullName: string;
  role: "super_admin" | "admin" | "manager" | "staff";
};

export function getLocalSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setLocalSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearLocalSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function isTestSuperAdmin(email: string, password: string) {
  return (
    email.trim().toLowerCase() === TEST_SUPER_ADMIN.email &&
    password === TEST_SUPER_ADMIN.password
  );
}
