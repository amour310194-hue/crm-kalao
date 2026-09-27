import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { CaptureField } from "@/lib/capture-submit";

export interface CaptureFormRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  fields: CaptureField[];
  status: "draft" | "published";
  success_message: string | null;
  default_source: string | null;
  created_at: string;
  updated_at: string;
}

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function fetchCaptureForms(): Promise<CaptureFormRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("capture_forms")
    .select("*")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as CaptureFormRow[];
}

export async function fetchCaptureForm(id: string): Promise<CaptureFormRow | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase.from("capture_forms").select("*").eq("id", id).maybeSingle();
  throwIf(error);
  return (data ?? null) as CaptureFormRow | null;
}

export async function createCaptureForm(input: {
  slug: string;
  title: string;
  description?: string | null;
  fields: CaptureField[];
  success_message?: string | null;
  default_source?: string | null;
  status?: "draft" | "published";
}): Promise<CaptureFormRow> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("capture_forms")
    .insert({
      slug: input.slug,
      title: input.title,
      description: input.description || null,
      fields: input.fields,
      success_message: input.success_message || null,
      default_source: input.default_source || null,
      status: input.status ?? "draft",
    })
    .select("*")
    .single();
  throwIf(error);
  return data as CaptureFormRow;
}

export async function updateCaptureForm(id: string, patch: Partial<CaptureFormRow>) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("capture_forms").update(patch).eq("id", id);
  throwIf(error);
}

export async function deleteCaptureForm(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("capture_forms").delete().eq("id", id);
  throwIf(error);
}
