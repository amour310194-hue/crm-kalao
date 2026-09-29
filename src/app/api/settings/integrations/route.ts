import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/require-user";
import { canEditOrgSettings } from "@/lib/authz";
import { encryptSecret, integrationMasterKey, secretLast4 } from "@/lib/crypto-secret";
import {
  INTEGRATION_PROVIDERS,
  buildProviderStatus,
  findField,
  findProvider,
} from "@/lib/integrations";

export async function GET(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  if (!canEditOrgSettings(authed.role)) {
    return Response.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }

  const admin = getServiceSupabase();
  const { data, error } = await admin
    .from("integration_credentials")
    .select("provider, field_key, last4, public_value");
  if (error) return Response.json({ ok: false, reason: error.message }, { status: 500 });

  const rows = data ?? [];
  const providers = INTEGRATION_PROVIDERS.map((provider) =>
    buildProviderStatus(
      provider,
      rows
        .filter((row) => row.provider === provider.id)
        .map((row) => ({
          field_key: row.field_key,
          last4: row.last4,
          public_value: row.public_value,
          ciphertext: row.last4 ? "set" : null,
        }))
    )
  );

  return Response.json({
    ok: true,
    origin: new URL(request.url).origin,
    email: {
      id: "email",
      label: "E-mail (Resend)",
      status: process.env.RESEND_API_KEY ? "serveur" : "absent",
    },
    providers,
  });
}

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  if (!canEditOrgSettings(authed.role)) {
    return Response.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }

  let payload: { provider?: string; values?: Record<string, string> } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }

  const provider = findProvider(String(payload.provider ?? ""));
  if (!provider) return Response.json({ ok: false, reason: "provider" }, { status: 400 });

  const master = integrationMasterKey();
  if (!master) {
    return Response.json({ ok: false, reason: "chiffrement_absent" }, { status: 500 });
  }

  const values = payload.values ?? {};
  const admin = getServiceSupabase();

  for (const [key, raw] of Object.entries(values)) {
    const field = findField(provider, key);
    if (!field) continue;
    const value = String(raw ?? "").trim();
    if (field.secret && value === "") continue;

    if (field.secret) {
      if (value.length > 4000) {
        return Response.json({ ok: false, reason: "trop_long" }, { status: 400 });
      }
      const { error } = await admin.from("integration_credentials").upsert({
        provider: provider.id,
        field_key: field.key,
        is_secret: true,
        public_value: null,
        ciphertext: encryptSecret(value, master),
        last4: secretLast4(value),
        updated_at: new Date().toISOString(),
        updated_by: authed.user.id,
      });
      if (error) return Response.json({ ok: false, reason: error.message }, { status: 500 });
    } else if (value === "") {
      await admin.from("integration_credentials").delete().eq("provider", provider.id).eq("field_key", field.key);
    } else {
      const { error } = await admin.from("integration_credentials").upsert({
        provider: provider.id,
        field_key: field.key,
        is_secret: false,
        public_value: value.slice(0, 500),
        ciphertext: null,
        last4: null,
        updated_at: new Date().toISOString(),
        updated_by: authed.user.id,
      });
      if (error) return Response.json({ ok: false, reason: error.message }, { status: 500 });
    }
  }

  await admin.from("audit_logs").insert({
    number: `INT-${Date.now().toString(36).toUpperCase()}`,
    actor: authed.user.email ?? authed.user.id,
    action: "update",
    resource: "integrations",
    record_id: provider.id,
    record_label: provider.label,
  });

  return Response.json({ ok: true, provider: provider.id });
}
