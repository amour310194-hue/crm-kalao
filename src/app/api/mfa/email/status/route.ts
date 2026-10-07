import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { EMAIL_MFA_OK_COOKIE, readEmailMfaOk, sessionFingerprint } from "@/lib/mfa-email";

export async function GET(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });
  const raw = request.cookies.get(EMAIL_MFA_OK_COOKIE)?.value;
  return NextResponse.json({ ok: readEmailMfaOk(raw, authed.user.id, sessionFingerprint(authed.token)) });
}
