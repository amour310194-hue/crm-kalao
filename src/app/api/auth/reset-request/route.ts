import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { issuePasswordReset } from "@/lib/password-reset";

export async function POST(request: NextRequest) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }
  if (!email) return Response.json({ ok: false, reason: "missing_email" }, { status: 400 });

  try {
    const admin = getServiceSupabase();
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const user = data.users.find((u) => u.email?.toLowerCase() === email);
    if (user) {
      await issuePasswordReset(email, user.id);
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, reason: err instanceof Error ? err.message : "reset_error" },
      { status: 500 }
    );
  }
}
