import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ModuleKey } from "@/lib/permissions";

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export type ModulePermissionRow = {
  role: string;
  module_key: ModuleKey;
  allowed: boolean;
};

export async function fetchModulePermissions(role: string): Promise<ModulePermissionRow[]> {
  const supabase = db();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("module_permissions")
    .select("role, module_key, allowed")
    .eq("role", role);
  throwIf(error);
  return (data ?? []) as ModulePermissionRow[];
}

export async function upsertModulePermission(
  role: string,
  moduleKey: ModuleKey,
  allowed: boolean
) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("module_permissions").upsert(
    {
      role,
      module_key: moduleKey,
      allowed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "role,module_key" }
  );
  throwIf(error);
}
