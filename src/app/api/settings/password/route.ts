import { NextRequest } from "next/server";
import { requireUser } from "@/lib/require-user";
import { getServiceSupabase, getUserSupabase } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const authed = await requireUser(request);
    if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
    let payload: { current?: string; next?: string } = {};
    try {
      payload = (await request.json()) as typeof payload;
    } catch {
      return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
    }
    const current = String(payload.current ?? "");
    const next = String(payload.next ?? "");
    if (next.length < 10) return Response.json({ ok: false, reason: "faible" }, { status: 400 });
    if (!authed.user.email) return Response.json({ ok: false, reason: "email" }, { status: 400 });

    const userDb = getUserSupabase(authed.token);
    if (!userDb) return Response.json({ ok: false, reason: "serveur" }, { status: 500 });
    const check = await userDb.auth.signInWithPassword({
      email: authed.user.email,
      password: current,
    });
    if (check.error) return Response.json({ ok: false, reason: "actuel" }, { status: 400 });

    const { error } = await userDb.auth.updateUser({ password: next });
    if (error) {
      console.error("password update", error.message);
      return Response.json({ ok: false, reason: "update" }, { status: 400 });
    }
    const admin = getServiceSupabase();
    await admin
      .from("profiles")
      .update({ password_changed_at: new Date().toISOString() })
      .eq("id", authed.user.id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("password POST", err);
    return Response.json({ ok: false, reason: "serveur" }, { status: 500 });
  }
}
