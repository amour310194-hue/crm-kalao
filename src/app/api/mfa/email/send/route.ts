import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { KALAO_NOREPLY_FROM } from "@/lib/org";
import {
  EMAIL_MFA_CHAL_COOKIE,
  emailMfaConfigured,
  generateOtp,
  mfaCookieOptions,
  packChallenge,
} from "@/lib/mfa-email";
import { resendConfigured, resendSend } from "@/lib/mail/server/resend";
import { memoryRateLimitStore } from "@/lib/rate-limit";

const limit = memoryRateLimitStore();

export async function POST(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed?.user.email) {
    return NextResponse.json({ ok: false, reason: "auth" }, { status: 401 });
  }
  if (!emailMfaConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "config", message: "Secret 2FA e-mail manquant côté serveur." },
      { status: 500 }
    );
  }
  if (!resendConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "resend", message: "L’envoi d’e-mail n’est pas configuré (Resend)." },
      { status: 503 }
    );
  }
  const hit = await limit.hit(`mfa-email:${authed.user.id}`, 15 * 60, 5);
  if (!hit.ok) {
    return NextResponse.json(
      { ok: false, reason: "rate", message: "Trop de codes. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }
  const code = generateOtp();
  const packed = packChallenge(authed.user.id, code);
  const sent = await resendSend(
    {
      from: KALAO_NOREPLY_FROM,
      to: [authed.user.email],
      subject: "Votre code Kalao",
      text: `Votre code d’authentification Kalao est ${code}. Il expire dans 10 minutes.`,
      html: `<p>Votre code d’authentification Kalao est <strong>${code}</strong>.</p><p>Il expire dans 10 minutes.</p>`,
    },
    `mfa-email-${authed.user.id}-${packed.value.slice(-12)}`
  );
  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, reason: "send", message: "Impossible d’envoyer le code. Réessayez." },
      { status: 502 }
    );
  }
  const res = NextResponse.json({ ok: true, to: authed.user.email });
  res.cookies.set(EMAIL_MFA_CHAL_COOKIE, packed.value, mfaCookieOptions(packed.maxAge));
  return res;
}
