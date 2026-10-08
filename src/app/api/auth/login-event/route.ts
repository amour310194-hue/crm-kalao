import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { issueLoginToken } from "@/lib/login-token";
import { enforceRateLimits, supabaseRateLimitStore } from "@/lib/rate-limit";
import { sendNoreplyMail } from "@/lib/transactional-mail";

export async function POST(request: NextRequest) {
  try {
    let payload: { email?: string; success?: boolean; sessionId?: string; check?: boolean } = {};
    try {
      payload = (await request.json()) as typeof payload;
    } catch {
      return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
    }
    const email = String(payload.email ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 320);
    if (!email) return Response.json({ ok: false, reason: "email" }, { status: 400 });

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const limited = await enforceRateLimits(supabaseRateLimitStore(), [
      { key: `login-ip:${ip}`, windowSeconds: 15 * 60, max: 20 },
      { key: `login-email:${email}`, windowSeconds: 15 * 60, max: 8 },
    ]);
    if (limited.limited) {
      return Response.json({ ok: false, reason: "rate" }, { status: 429 });
    }
    if (payload.check) return Response.json({ ok: true });

    const admin = getServiceSupabase();
    let userId: string | null = null;
    if (payload.success) {
      const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      userId = listed.data.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
    }

    const token = issueLoginToken();
    const sessionId = payload.sessionId?.trim() || null;
    const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 400);

    if (userId && payload.success) {
      const { count } = await admin
        .from("login_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("success", true)
        .eq("user_agent", userAgent);
      if (!count) {
        await sendNoreplyMail({
          to: email,
          subject: "Connexion depuis un nouvel appareil — Kalao",
          body: "Une connexion à votre compte Kalao vient d'un appareil qui n'avait pas encore été vu. Si ce n'est pas vous, changez votre mot de passe.",
        });
      }
    }

    if (userId && sessionId) {
      try {
        await admin.schema("auth").from("sessions").update({ tag: token }).eq("id", sessionId).eq("user_id", userId);
      } catch (err) {
        console.error("session tag", err);
      }
    }

    const { error } = await admin.from("login_events").insert({
      email,
      user_id: userId,
      success: Boolean(payload.success),
      ip,
      user_agent: userAgent,
      token,
      session_id: sessionId,
    });
    if (error) {
      console.error("login_events", error.message);
      return Response.json({ ok: false, reason: "serveur" }, { status: 500 });
    }
    return Response.json({ ok: true, token });
  } catch (err) {
    console.error("login-event", err);
    return Response.json({ ok: false, reason: "serveur" }, { status: 500 });
  }
}
