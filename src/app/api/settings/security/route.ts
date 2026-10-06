import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/require-user";

export async function GET(request: NextRequest) {
  try {
    const authed = await requireUser(request);
    if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });

    const admin = getServiceSupabase();
    const { data: profile } = await admin
      .from("profiles")
      .select("password_changed_at, created_at")
      .eq("id", authed.user.id)
      .maybeSingle();

    const { data: events } = await admin
      .from("login_events")
      .select("id, success, ip, user_agent, created_at, token, session_id")
      .or(`user_id.eq.${authed.user.id},email.eq.${authed.user.email ?? ""}`)
      .order("created_at", { ascending: false })
      .limit(30);

    const { data: sessions, error } = await admin
      .schema("auth")
      .from("sessions")
      .select("id, created_at, updated_at, refreshed_at, aal, ip, user_agent, tag")
      .eq("user_id", authed.user.id)
      .order("updated_at", { ascending: false });

    if (error) console.error("sessions", error.message);

    return Response.json({
      ok: true,
      email: authed.user.email,
      passwordChangedAt: profile?.password_changed_at ?? profile?.created_at ?? authed.user.created_at,
      currentSessionAal: null,
      sessions: sessions ?? [],
      loginEvents: events ?? [],
    });
  } catch (err) {
    console.error("security GET", err);
    return Response.json({ ok: false, reason: "serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await requireUser(request);
    if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
    let payload: { action?: string; sessionId?: string } = {};
    try {
      payload = (await request.json()) as typeof payload;
    } catch {
      return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
    }
    const admin = getServiceSupabase();
    if (payload.action === "signout_all") {
      await admin.auth.admin.signOut(authed.user.id, "global");
      return Response.json({ ok: true });
    }
    if (payload.action === "signout_others") {
      await admin.auth.admin.signOut(authed.user.id, "others");
      return Response.json({ ok: true });
    }
    if (payload.action === "signout_session" && payload.sessionId) {
      await admin.schema("auth").from("sessions").delete().eq("id", payload.sessionId).eq("user_id", authed.user.id);
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, reason: "action" }, { status: 400 });
  } catch (err) {
    console.error("security POST", err);
    return Response.json({ ok: false, reason: "serveur" }, { status: 500 });
  }
}
