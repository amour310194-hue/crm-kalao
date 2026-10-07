import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import {
  EMAIL_MFA_CHAL_COOKIE,
  EMAIL_MFA_OK_COOKIE,
  mfaCookieOptions,
  packEmailMfaOk,
  sessionFingerprint,
  verifyChallengeCookie,
} from "@/lib/mfa-email";

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false, reason: "auth" }, { status: 401 });
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
  const raw = request.cookies.get(EMAIL_MFA_CHAL_COOKIE)?.value;
  if (!verifyChallengeCookie(raw, authed.user.id, code)) {
    return NextResponse.json({ ok: false, reason: "invalid", message: "Code incorrect ou expiré." }, { status: 400 });
  }
  const packed = packEmailMfaOk(authed.user.id, sessionFingerprint(authed.token));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EMAIL_MFA_OK_COOKIE, packed.value, mfaCookieOptions(packed.maxAge));
  res.cookies.set(EMAIL_MFA_CHAL_COOKIE, "", { ...mfaCookieOptions(0), maxAge: 0 });
  return res;
}
