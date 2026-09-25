import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/require-user";
import { isCrmAdmin } from "@/lib/authz";
import { verifySharedInboundSecret } from "@/lib/svix-verify";
import { runInvoiceReminders } from "@/lib/mail/server/reminders";

export const maxDuration = 60;

/**
 * Relances de factures (J-3 avant échéance, J+7 après), lancées par le cron Vercel du matin.
 * Sans MAIL_REMINDERS_ENABLED=1, simulation seulement : la liste de ce qui partirait est renvoyée,
 * aucun client n'est contacté. « ?dry=1 » force la simulation.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization") ?? "";
  let allowed = false;
  const secret = process.env.CRON_SECRET;
  if (secret && auth.startsWith("Bearer ")) {
    try {
      verifySharedInboundSecret(auth.slice(7), secret);
      allowed = true;
    } catch {
      allowed = false;
    }
  }
  if (!allowed) {
    const user = await requireUser(request).catch(() => null);
    allowed = Boolean(user && isCrmAdmin(user.role));
  }
  if (!allowed) return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  const send = process.env.MAIL_REMINDERS_ENABLED === "1" && request.nextUrl.searchParams.get("dry") !== "1";
  const results = await runInvoiceReminders(getServiceSupabase(), { send });
  return Response.json({ ok: true, send, results });
}
