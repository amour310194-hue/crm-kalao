import type { User } from "@supabase/supabase-js";
import { getServiceSupabase, getUserFromBearer } from "@/lib/supabase/admin";

export type AuthedUser = {
  user: User;
  role: string | null;
  token: string;
};

async function userFromCookies(): Promise<{ user: User; token: string } | null> {
  try {
    const { createSupabaseServer } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServer();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const session = await supabase.auth.getSession();
    return { user: data.user, token: session.data.session?.access_token ?? "" };
  } catch {
    return null;
  }
}

export async function requireUser(request: Request): Promise<AuthedUser | null> {
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  let user: User | null = null;
  let token = bearer;

  if (bearer) {
    user = await getUserFromBearer(request);
  }
  if (!user) {
    const fromCookies = await userFromCookies();
    if (fromCookies) {
      user = fromCookies.user;
      token = fromCookies.token || token;
    }
  }
  if (!user) return null;

  const admin = getServiceSupabase();
  const { data } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { user, role: data?.role ?? null, token };
}
