import { NextRequest } from "next/server";
import { listReceivedEmailIds } from "@/lib/inbound-mail";
import { ingestReceivedEmail } from "@/lib/store-inbound";
import { requireUser } from "@/lib/require-user";
import { verifySharedInboundSecret } from "@/lib/svix-verify";
import { enforceRateLimits, supabaseRateLimitStore } from "@/lib/rate-limit";

export const maxDuration = 60;

/**
 * Rattrapage des mails reçus (au cas où un webhook serait perdu).
 * Cron Vercel : Vercel envoie « Authorization: Bearer $CRON_SECRET » ; l'en-tête x-vercel-cron
 * n'est plus accepté seul (n'importe qui peut l'envoyer).
 * Utilisateur connecté : 1 synchronisation par minute (bouton « Actualiser »).
 */
async function allowed(request: NextRequest): Promise<{ ok: boolean; limited?: number }> {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth.startsWith("Bearer ")) {
    try {
      verifySharedInboundSecret(auth.slice(7), secret);
      return { ok: true };
    } catch {
      /* pas le secret cron : peut-être un jeton utilisateur */
    }
  }
  const user = await requireUser(request).catch(() => null);
  if (!user) return { ok: false };
  const hit = await enforceRateLimits(supabaseRateLimitStore(), [
    { key: `mail-sync:user:${user.user.id}`, windowSeconds: 60, max: 1 },
  ]);
  return hit.limited ? { ok: false, limited: hit.retryAfter } : { ok: true };
}

export async function GET(request: NextRequest) {
  const gate = await allowed(request);
  if (gate.limited !== undefined) {
    return Response.json({ ok: true, count: 0, skipped: "rate_limited", retryAfter: gate.limited });
  }
  if (!gate.ok) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  const ids = await listReceivedEmailIds(50);
  let stored = 0;
  const results = [];
  for (const id of ids) {
    const result = await ingestReceivedEmail(id);
    if (result.reason === "stored") stored += 1;
    results.push({ id, reason: result.reason });
  }
  return Response.json({ ok: true, count: stored, checked: ids.length, results });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
