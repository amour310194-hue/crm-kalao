import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function mergeContacts(keepId: string, dropId: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.rpc("merge_contacts", { p_keep: keepId, p_drop: dropId });
  throwIf(error);
}

export async function archiveCommercial(table: "leads" | "deals" | "activities", id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.rpc("archive_commercial", { p_table: table, p_id: id });
  throwIf(error);
}

export async function restoreCommercial(table: "leads" | "deals" | "activities", id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.rpc("restore_commercial", { p_table: table, p_id: id });
  throwIf(error);
}

export async function tagContacts(ids: string[], tag: string) {
  const supabase = db();
  if (!supabase || !ids.length || !tag.trim()) return;
  const { data, error } = await supabase.from("contacts").select("id, tags").in("id", ids);
  throwIf(error);
  for (const row of data ?? []) {
    const tags = Array.from(new Set([...(row.tags ?? []), tag.trim()]));
    const { error: updateError } = await supabase.from("contacts").update({ tags }).eq("id", row.id);
    throwIf(updateError);
  }
}

export async function saveListView(listKey: string, name: string, filters: Record<string, string>) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  throwIf(userError);
  const userId = userData.user?.id;
  if (!userId) throw new Error("Session expirée.");
  const { error } = await supabase.from("saved_views").upsert(
    { user_id: userId, list_key: listKey, name: name.trim(), filters, columns: [] },
    { onConflict: "user_id,list_key,name" }
  );
  throwIf(error);
}

export async function fetchListViews(listKey: string) {
  const supabase = db();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("saved_views")
    .select("id, name, filters")
    .eq("list_key", listKey)
    .order("name");
  throwIf(error);
  return (data ?? []) as { id: string; name: string; filters: Record<string, string> }[];
}

export async function fetchArchived() {
  const supabase = db();
  if (!supabase) return { leads: [], deals: [], activities: [] };
  const [leads, deals, activities] = await Promise.all([
    supabase.from("leads").select("id, title, archived_at").not("archived_at", "is", null),
    supabase.from("deals").select("id, title, archived_at").not("archived_at", "is", null),
    supabase.from("activities").select("id, subject, archived_at").not("archived_at", "is", null),
  ]);
  throwIf(leads.error);
  throwIf(deals.error);
  throwIf(activities.error);
  return {
    leads: leads.data ?? [],
    deals: deals.data ?? [],
    activities: (activities.data ?? []).map((row) => ({ id: row.id, title: row.subject, archived_at: row.archived_at })),
  };
}
