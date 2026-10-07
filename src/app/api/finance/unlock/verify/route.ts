import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { canEditFinance } from "@/lib/authz";
import {
  FINANCE_CHAL_COOKIE,
  FINANCE_OK_COOKIE,
  financeCookieOptions,
  packFinanceOk,
  sessionFingerprint,
  verifyFinanceChallenge,
} from "@/lib/finance-unlock-server";

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false, reason: "auth" }, { status: 401 });
  if (!canEditFinance(authed.role)) {
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }
  let code = "";
  try {
    const body = (await request.json()) as { code?: string };
    code = String(body.code ?? "").replace(/\D/g, "");
  } catch {
    return NextResponse.json({ ok: false, reason: "payload" }, { status: 400 });
  }
  if (code.length !== 6) {
    return NextResponse.json({ ok: false, reason: "code" }, { status: 400 });
  }
  const raw = request.cookies.get(FINANCE_CHAL_COOKIE)?.value;
  if (!verifyFinanceChallenge(raw, authed.user.id, code)) {
    return NextResponse.json({ ok: false, reason: "invalid", message: "Code incorrect ou expiré." }, { status: 400 });
  }
  const packed = packFinanceOk(authed.user.id, sessionFingerprint(authed.token));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(FINANCE_OK_COOKIE, packed.value, financeCookieOptions(packed.maxAge));
  res.cookies.set(FINANCE_CHAL_COOKIE, "", { ...financeCookieOptions(0), maxAge: 0 });
  return res;
}
