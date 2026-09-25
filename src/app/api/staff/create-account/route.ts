import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/require-user";
import { canAssignRole, canCreateStaffAccount } from "@/lib/authz";
import { issuePasswordReset } from "@/lib/password-reset";
import { welcomeMailBody, sendNoreplyMail } from "@/lib/transactional-mail";

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  const user = authed.user;

  const admin = getServiceSupabase();
  const { data: actor } = await admin
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (!canCreateStaffAccount(actor?.role)) {
    return Response.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }

  let payload: { employeeId?: string; role?: string } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }

  const role = payload.role || "staff";
  if (!canAssignRole(actor?.role, role)) {
    return Response.json({ ok: false, reason: "role_interdit" }, { status: 403 });
  }

  const { data: employee, error: empErr } = await admin
    .from("employees")
    .select("id, full_name, email, profile_id")
    .eq("id", payload.employeeId ?? "")
    .maybeSingle();
  if (empErr || !employee) {
    return Response.json({ ok: false, reason: "employe_introuvable" }, { status: 404 });
  }
  const email = String(employee.email ?? "").trim().toLowerCase();
  if (!email.endsWith("@groupe-kalao.com")) {
    return Response.json({ ok: false, reason: "mail_pro_requis" }, { status: 400 });
  }
  if (employee.profile_id) {
    return Response.json({ ok: false, reason: "deja_compte" }, { status: 409 });
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: employee.full_name },
    app_metadata: { role },
  });
  if (createErr || !created.user) {
    return Response.json(
      { ok: false, reason: createErr?.message || "create_user" },
      { status: 400 }
    );
  }

  const { error: profileErr } = await admin.from("profiles").upsert({
    id: created.user.id,
    full_name: employee.full_name,
    role,
  });
  if (profileErr) {
    return Response.json({ ok: false, reason: profileErr.message }, { status: 500 });
  }

  const { error: linkErr } = await admin
    .from("employees")
    .update({ profile_id: created.user.id })
    .eq("id", employee.id);
  if (linkErr) {
    return Response.json({ ok: false, reason: linkErr.message }, { status: 500 });
  }

  const reset = await issuePasswordReset(email, created.user.id, { sendEmail: false });
  const welcome = await sendNoreplyMail({
    to: email,
    subject: "Votre compte CRM Groupe Kalao",
    body: welcomeMailBody(employee.full_name, email, reset.token, reset.code),
  });

  return Response.json({
    ok: true,
    userId: created.user.id,
    email,
    resetDispatched: welcome.dispatched,
  });
}
