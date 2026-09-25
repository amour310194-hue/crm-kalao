import { NextRequest } from "next/server";
import { getMailContext, jsonError, MailHttpError, readJson } from "@/lib/mail/server/context";
import { resendCancel } from "@/lib/mail/server/resend";

/** Annule un envoi programmé : le mail repasse en brouillon. */
export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const { id } = await readJson<{ id?: string }>(request);
    const { data: row } = await ctx.userDb
      .from("crm_emails")
      .select("id, folder, resend_id, created_by")
      .eq("id", String(id ?? ""))
      .maybeSingle();
    if (!row || row.folder !== "scheduled") throw new MailHttpError(404, "Envoi programmé introuvable.");
    if (row.created_by !== ctx.userId && !ctx.isAdmin) throw new MailHttpError(403, "Seul l'auteur peut annuler cet envoi.");
    if (row.resend_id) {
      const res = await resendCancel(row.resend_id);
      if (!res.ok) throw new MailHttpError(502, `Resend a refusé l'annulation : ${res.detail}`);
    }
    await ctx.admin
      .from("crm_emails")
      .update({
        folder: "drafts",
        status: "stored",
        delivery_status: "cancelled",
        delivery_updated_at: new Date().toISOString(),
        scheduled_at: null,
        resend_id: null,
      })
      .eq("id", row.id);
    return Response.json({ ok: true, id: row.id });
  } catch (err) {
    return jsonError(err);
  }
}
