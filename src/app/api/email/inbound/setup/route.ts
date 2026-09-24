import { NextRequest } from "next/server";
import { canCreateStaffAccount } from "@/lib/authz";
import {
  KALAO_CONTACT_EMAIL,
  KALAO_INBOUND_RESEND,
  KALAO_NOREPLY_EMAIL,
  inboundEndpoint,
  inboundResendAlias,
} from "@/lib/org";
import { ensureInboundWebhook, isInboundWebhook, listResendWebhooks } from "@/lib/resend-inbound";
import { getUserFromBearer, getUserSupabase } from "@/lib/supabase/admin";

function bearerToken(request: NextRequest) {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

async function actorCanManage(request: NextRequest) {
  const user = await getUserFromBearer(request);
  if (!user) return null;
  const db = getUserSupabase(bearerToken(request));
  if (!db) return null;
  const { data } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!canCreateStaffAccount(data?.role)) return null;
  return { user, db };
}

export async function GET(request: NextRequest) {
  const actor = await actorCanManage(request);
  if (!actor) return Response.json({ ok: false, reason: "auth" }, { status: 401 });

  const endpoint = inboundEndpoint();
  const webhooks = await listResendWebhooks();
  const webhook = webhooks.find((row) => isInboundWebhook(row, endpoint));

  const { data: employees } = await actor.db
    .from("employees")
    .select("email, full_name, profile_id")
    .not("profile_id", "is", null)
    .order("full_name");

  const forwards = [
    { from: KALAO_CONTACT_EMAIL, to: inboundResendAlias(KALAO_CONTACT_EMAIL), box: "Contact" },
    { from: KALAO_NOREPLY_EMAIL, to: inboundResendAlias(KALAO_NOREPLY_EMAIL), box: "No-reply" },
    ...(employees ?? [])
      .filter((row) => String(row.email ?? "").toLowerCase().endsWith("@groupe-kalao.com"))
      .map((row) => ({
        from: String(row.email).toLowerCase(),
        to: inboundResendAlias(String(row.email)),
        box: String(row.full_name ?? "Boîte pro"),
      })),
  ];

  return Response.json({
    ok: true,
    endpoint,
    receiving: KALAO_INBOUND_RESEND,
    webhook: webhook ? { id: webhook.id, status: webhook.status ?? "enabled" } : null,
    forwards,
  });
}

export async function POST(request: NextRequest) {
  const actor = await actorCanManage(request);
  if (!actor) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  const result = await ensureInboundWebhook();
  const status = result.ok ? 200 : 400;
  return Response.json(result, { status });
}
