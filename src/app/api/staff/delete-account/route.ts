import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/require-user";
import { canDeleteAccount } from "@/lib/authz";

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });

  let payload: { userId?: string } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }
  const userId = String(payload.userId ?? "").trim();
  if (!userId) return Response.json({ ok: false, reason: "user_id" }, { status: 400 });

  const admin = getServiceSupabase();
  const { data: target } = await admin.from("profiles").select("id, role, full_name").eq("id", userId).maybeSingle();
  if (!target) return Response.json({ ok: false, reason: "introuvable" }, { status: 404 });

  const blocked = canDeleteAccount(authed.role, target.role, userId === authed.user.id);
  if (blocked) return Response.json({ ok: false, reason: blocked }, { status: 403 });

  await admin.from("employees").update({ profile_id: null }).eq("profile_id", userId);
  await admin.from("capture_forms").update({ created_by: null }).eq("created_by", userId);
  await admin.from("expenses").update({ created_by: null }).eq("created_by", userId);
  const { error: authErr } = await admin.auth.admin.deleteUser(userId);
  if (authErr) {
    return Response.json({ ok: false, reason: authErr.message }, { status: 500 });
  }

  return Response.json({ ok: true, deleted: userId, name: target.full_name });
}
