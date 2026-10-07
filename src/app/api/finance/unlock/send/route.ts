import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { KALAO_NOREPLY_FROM } from "@/lib/org";
import { canEditFinance } from "@/lib/authz";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  FINANCE_CHAL_COOKIE,
  financeCookieOptions,
  financeUnlockConfigured,
  generateOtp,
  packFinanceChallenge,
} from "@/lib/finance-unlock-server";
import { resendConfigured, resendSend } from "@/lib/mail/server/resend";
import { memoryRateLimitStore } from "@/lib/rate-limit";

const limit = memoryRateLimitStore();
const ADMIN_ROLES = ["super_admin", "admin", "direction"];

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false, reason: "auth" }, { status: 401 });
  if (!canEditFinance(authed.role)) {
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }
  if (!financeUnlockConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "config", message: "Secret serveur manquant pour le code finance." },
      { status: 500 }
    );
  }
  if (!resendConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "resend", message: "L’envoi d’e-mail n’est pas configuré (Resend)." },
      { status: 503 }
    );
  }
  const hit = await limit.hit(`finance-unlock:${authed.user.id}`, 15 * 60, 5);
  if (!hit.ok) {
    return NextResponse.json(
      { ok: false, reason: "rate", message: "Trop de codes. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const admin = getServiceSupabase();
  const { data: profiles } = await admin.from("profiles").select("id, role").in("role", ADMIN_ROLES);
  const emails = new Set<string>();
  for (const row of profiles ?? []) {
    const { data } = await admin.auth.admin.getUserById(row.id);
    const email = data.user?.email?.trim();
    if (email) emails.add(email);
  }
  if (authed.user.email) emails.add(authed.user.email);
  const to = [...emails];
  if (!to.length) {
    return NextResponse.json(
      { ok: false, reason: "admin", message: "Aucun e-mail administrateur trouvé." },
      { status: 500 }
    );
  }

  const code = generateOtp();
  const packed = packFinanceChallenge(authed.user.id, code);
  const sent = await resendSend(
    {
      from: KALAO_NOREPLY_FROM,
      to,
      subject: "Code de modification financière — Kalao",
      text: `Un utilisateur demande de modifier une écriture financière.\nCode : ${code}\nValable 10 minutes. Transmettez-le uniquement si la modification est légitime.`,
      html: `<p>Un utilisateur demande de modifier une écriture financière.</p><p>Code : <strong>${code}</strong></p><p>Valable 10 minutes. Ne le communiquez que si la modification est légitime.</p>`,
    },
    `finance-unlock-${authed.user.id}-${packed.value.slice(-12)}`
  );
  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, reason: "send", message: "Impossible d’envoyer le code aux administrateurs." },
      { status: 502 }
    );
  }
  const res = NextResponse.json({ ok: true, toCount: to.length });
  res.cookies.set(FINANCE_CHAL_COOKIE, packed.value, financeCookieOptions(packed.maxAge));
  return res;
}
