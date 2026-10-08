import { NextRequest } from "next/server";
import { verifyHubSignature } from "@/lib/prompt3-rules";
import { getServiceSupabase } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const token = process.env.META_VERIFY_TOKEN;
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const challenge = params.get("hub.challenge");
  const verify = params.get("hub.verify_token");
  if (!token || mode !== "subscribe" || verify !== token) {
    return Response.json({ ok: false, active: false, reason: "non_configure" }, { status: 403 });
  }
  return new Response(challenge ?? "", { status: 200 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.META_APP_SECRET ?? "";
  const raw = await request.text();
  if (!verifyHubSignature(raw, request.headers.get("x-hub-signature-256"), secret)) {
    return Response.json({ ok: false, reason: "signature" }, { status: 401 });
  }
  let payload: { entry?: { id?: string }[] } = {};
  try {
    payload = JSON.parse(raw) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "json" }, { status: 400 });
  }
  const externalId = payload.entry?.[0]?.id ?? "";
  if (!externalId) return Response.json({ ok: true, ignored: true });
  const admin = getServiceSupabase();
  const { error } = await admin.from("webhook_events").insert({
    provider: "meta",
    external_id: externalId,
    payload,
  });
  if (error && !error.message.includes("duplicate")) {
    console.error("webhook meta", error.message);
  }
  return Response.json({ ok: true });
}
