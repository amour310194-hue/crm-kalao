import { NextRequest } from "next/server";
import { verifyHubSignature } from "@/lib/prompt3-rules";
import { getServiceSupabase } from "@/lib/supabase/admin";

async function take(request: NextRequest, provider: "tiktok" | "linkedin" | "orange" | "mtn", envSecret: string) {
  const secret = process.env[envSecret] ?? "";
  const raw = await request.text();
  const header = request.headers.get("x-hub-signature-256") ?? request.headers.get("x-signature");
  if (!verifyHubSignature(raw, header, secret)) {
    return Response.json({ ok: false, active: false, reason: "signature" }, { status: 401 });
  }
  let payload: { id?: string } = {};
  try {
    payload = JSON.parse(raw) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "json" }, { status: 400 });
  }
  if (!payload.id) return Response.json({ ok: true, ignored: true });
  const admin = getServiceSupabase();
  if (provider === "orange" || provider === "mtn") {
    await admin.from("provider_payments").insert({
      provider,
      external_id: payload.id,
      amount: 0,
      matched: false,
    });
  }
  await admin.from("webhook_events").insert({ provider, external_id: payload.id, payload });
  return Response.json({ ok: true, mode: "test" });
}

export function tiktokPost(request: NextRequest) {
  return take(request, "tiktok", "TIKTOK_APP_SECRET");
}

export function linkedinPost(request: NextRequest) {
  return take(request, "linkedin", "LINKEDIN_CLIENT_SECRET");
}

export function orangePost(request: NextRequest) {
  return take(request, "orange", "ORANGE_WEBHOOK_SECRET");
}

export function mtnPost(request: NextRequest) {
  return take(request, "mtn", "MTN_WEBHOOK_SECRET");
}
