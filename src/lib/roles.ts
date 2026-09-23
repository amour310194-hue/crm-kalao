import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const PAY_DOC_KINDS = ["employment", "certificate", "payslip"] as const;

export function isPayDocKind(kind: string): boolean {
  return (PAY_DOC_KINDS as readonly string[]).includes(kind);
}

export function isCrmAdmin(role?: string | null): boolean {
  return role === "admin" || role === "manager";
}

async function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

export async function fetchSessionRole(): Promise<string | null> {
  const supabase = await db();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .maybeSingle();
  return data?.role ?? null;
}

export async function canSeePayroll(): Promise<boolean> {
  return isCrmAdmin(await fetchSessionRole());
}

export async function canMassDelete(): Promise<boolean> {
  return isCrmAdmin(await fetchSessionRole());
}

export async function assertCanSeePayroll() {
  if (!(await canSeePayroll())) {
    throw new Error("Accès réservé à la direction.");
  }
}

export async function assertCanDelete() {
  if (!(await canMassDelete())) {
    throw new Error("Suppression réservée à la direction.");
  }
}
