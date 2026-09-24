import { NextRequest } from "next/server";
import { canCreateStaffAccount } from "@/lib/authz";
import { getServiceSupabase, getUserFromBearer } from "@/lib/supabase/admin";

type SharedBox = "contact" | "noreply";

function isSharedBox(value: string): value is SharedBox {
  return value === "contact" || value === "noreply";
}

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

  const admin = getServiceSupabase();
  const [{ data: staff }, { data: profiles }, { data: acl }, { data: settings }] = await Promise.all([
    admin
      .from("employees")
      .select("full_name, email, profile_id")
      .not("profile_id", "is", null)
      .order("full_name"),
    admin.from("profiles").select("id, role"),
    admin.from("crm_mailbox_acl").select("mailbox, profile_id"),
    admin.from("crm_mailbox_settings").select("mailbox, restricted"),
  ]);

  const roles = new Map((profiles ?? []).map((row) => [row.id, row.role]));
  const people = (staff ?? []).map((row) => ({
    id: String(row.profile_id),
    name: String(row.full_name ?? row.email ?? "Employé"),
    email: String(row.email ?? ""),
    role: roles.get(String(row.profile_id)) ?? "staff",
  }));

  const granted = {
    contact: (acl ?? []).filter((row) => row.mailbox === "contact").map((row) => row.profile_id),
    noreply: (acl ?? []).filter((row) => row.mailbox === "noreply").map((row) => row.profile_id),
  };
  const restricted = {
    contact: Boolean(settings?.find((row) => row.mailbox === "contact")?.restricted),
    noreply: Boolean(settings?.find((row) => row.mailbox === "noreply")?.restricted),
  };

  return Response.json({
    ok: true,
    people,
    access: {
      contact: { open: !restricted.contact, profileIds: granted.contact },
      noreply: { open: !restricted.noreply, profileIds: granted.noreply },
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await actorCanManage(request);
  if (!user) return Response.json({ ok: false, reason: "auth" }, { status: 401 });

  let payload: { mailbox?: string; open?: boolean; profileIds?: string[] } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }
  if (!isSharedBox(payload.mailbox ?? "")) {
    return Response.json({ ok: false, reason: "mailbox" }, { status: 400 });
  }
  const mailbox = payload.mailbox as SharedBox;
  const admin = getServiceSupabase();
  const open = Boolean(payload.open);
  const { error: settingErr } = await admin
    .from("crm_mailbox_settings")
    .upsert({ mailbox, restricted: !open });
  if (settingErr) return Response.json({ ok: false, reason: settingErr.message }, { status: 400 });
  await admin.from("crm_mailbox_acl").delete().eq("mailbox", mailbox);
  if (!open) {
    const ids = [...new Set((payload.profileIds ?? []).filter(Boolean))];
    if (ids.length) {
      const { error } = await admin.from("crm_mailbox_acl").insert(
        ids.map((profile_id) => ({ mailbox, profile_id }))
      );
      if (error) return Response.json({ ok: false, reason: error.message }, { status: 400 });
    }
  }
  return Response.json({ ok: true, mailbox, open });
}
