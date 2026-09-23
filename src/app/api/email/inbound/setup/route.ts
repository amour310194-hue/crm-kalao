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
import { getServiceSupabase, getUserFromBearer } from "@/lib/supabase/admin";

async function actorCanManage(request: NextRequest) {
  const user = await getUserFromBearer(request);
  if (!user) return null;
  const admin = getServiceSupabase();
  const { data } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!canCreateStaffAccount(data?.role)) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const user = await actorCanManage(request);
  if (!user) return Response.json({ ok: false, reason: "auth" }, { status: 401 });

  const endpoint = inboundEndpoint();
  const webhooks = await listResendWebhooks();
  const webhook = webhooks.find((row) => isInboundWebhook(row, endpoint));

  const admin = getServiceSupabase();
  const { data: employees } = await admin
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
  const user = await actorCanManage(request);
  if (!user) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  const result = await ensureInboundWebhook();
  const status = result.ok ? 200 : 400;
  return Response.json(result, { status });
}
