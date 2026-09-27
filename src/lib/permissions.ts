import { isCrmAdmin } from "@/lib/authz";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ModuleKey =
  | "crm"
  | "projects"
  | "sales-crm"
  | "marketing"
  | "hrm-payroll"
  | "user-management"
  | "finance"
  | "support"
  | "settings"
  | "applications";

export const MODULES: { key: ModuleKey; label: string; prefixes: string[] }[] = [
  {
    key: "crm",
    label: "CRM",
    prefixes: ["/crm", "/leads", "/leads-list", "/leads-details", "/leads-kanban", "/companies"],
  },
  {
    key: "projects",
    label: "Dossiers",
    prefixes: [
      "/crm/projects",
      "/crm/project-list",
      "/crm/project-details",
      "/projects",
      "/tasks",
      "/milestones",
    ],
  },
  {
    key: "sales-crm",
    label: "Catalogue & ventes",
    prefixes: ["/sales-crm"],
  },
  {
    key: "marketing",
    label: "Marketing",
    prefixes: ["/marketing"],
  },
  {
    key: "hrm-payroll",
    label: "Paie",
    prefixes: ["/timesheets"],
  },
  {
    key: "user-management",
    label: "Gestion des utilisateurs",
    prefixes: ["/user-management"],
  },
  {
    key: "finance",
    label: "Finance (dépenses, stock)",
    prefixes: ["/finance"],
  },
  {
    key: "support",
    label: "Support",
    prefixes: ["/support"],
  },
  {
    key: "settings",
    label: "Paramètres",
    prefixes: [
      "/general-settings",
      "/website-settings",
      "/app-settings",
      "/system-settings",
      "/financial-settings",
      "/other-settings",
    ],
  },
  {
    key: "applications",
    label: "Applications",
    prefixes: ["/application", "/calendar", "/notes", "/docs"],
  },
];

function normalizePath(pathname: string): string {
  const path = pathname.split("?")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function moduleForPath(pathname: string): ModuleKey | null {
  const path = normalizePath(pathname);
  let best: { key: ModuleKey; len: number } | null = null;
  for (const entry of MODULES) {
    for (const prefix of entry.prefixes) {
      if (path === prefix || path.startsWith(`${prefix}/`)) {
        if (!best || prefix.length > best.len) {
          best = { key: entry.key, len: prefix.length };
        }
      }
    }
  }
  return best?.key ?? null;
}

export async function isModuleAllowed(
  supabase: SupabaseClient,
  role: string | null,
  moduleKey: ModuleKey
): Promise<boolean> {
  if (!role) return false;
  if (isCrmAdmin(role)) return true;
  const { data, error } = await supabase
    .from("module_permissions")
    .select("allowed")
    .eq("role", role)
    .eq("module_key", moduleKey)
    .maybeSingle();
  if (error) return true;
  return data?.allowed ?? true;
}

export async function fetchDeniedModuleKeys(
  supabase: SupabaseClient,
  role: string | null
): Promise<Set<ModuleKey>> {
  if (!role || isCrmAdmin(role)) return new Set();
  const { data, error } = await supabase
    .from("module_permissions")
    .select("module_key, allowed")
    .eq("role", role);
  if (error || !data) return new Set();
  return new Set(
    data
      .filter((row) => row.allowed === false)
      .map((row) => row.module_key as ModuleKey)
  );
}
