import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { FINANCE_OK_COOKIE, readFinanceOk, sessionFingerprint } from "@/lib/finance-unlock-server";

export async function GET(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });
  const raw = request.cookies.get(FINANCE_OK_COOKIE)?.value;
  return NextResponse.json({ ok: readFinanceOk(raw, authed.user.id, sessionFingerprint(authed.token)) });
}
