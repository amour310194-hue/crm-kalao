import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export async function authJsonHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!isSupabaseConfigured()) return headers;
  const { data } = await getSupabaseBrowserClient().auth.getSession();
  const token = data.session?.access_token;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
