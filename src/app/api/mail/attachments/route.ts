import { NextRequest } from "next/server";
import { getMailContext, jsonError, MailHttpError } from "@/lib/mail/server/context";
import { MAIL_BUCKET } from "@/lib/mail/types";

/**
 * Téléchargement / aperçu d'une pièce jointe. La RLS vérifie que l'utilisateur peut lire le mail,
 * puis on redirige vers une URL signée valable 5 minutes.
 * ?ids=a,b (JSON)  |  ?id=<pièce>  [&download=1]  |  ?path=outgoing/<uid>/… (fichier en cours de rédaction)
 */
export async function GET(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const params = request.nextUrl.searchParams;
    const many = params.get("ids");
    if (many) {
      // Mode JSON : URL signées pour les images intégrées (« cid: ») affichées dans le cadre isolé.
      const ids = many.split(",").filter((v) => /^[0-9a-f-]{36}$/i.test(v)).slice(0, 50);
      const { data } = await ctx.userDb
        .from("crm_email_attachments")
        .select("id, storage_path")
        .in("id", ids);
      const urls: Record<string, string> = {};
      for (const row of data ?? []) {
        const signed = await ctx.admin.storage.from(MAIL_BUCKET).createSignedUrl(row.storage_path, 3600);
        if (signed.data?.signedUrl) urls[row.id] = signed.data.signedUrl;
      }
      return Response.json({ ok: true, urls });
    }
    const id = params.get("id");
    const draftPath = params.get("path");
    let path = "";
    let filename = "piece-jointe";
    if (id) {
      const { data } = await ctx.userDb
        .from("crm_email_attachments")
        .select("storage_path, filename")
        .eq("id", id)
        .maybeSingle();
      if (!data) throw new MailHttpError(404, "Pièce jointe introuvable.");
      path = data.storage_path;
      filename = data.filename;
    } else if (draftPath && draftPath.startsWith(`outgoing/${ctx.userId}/`) && !draftPath.includes("..")) {
      path = draftPath;
      filename = draftPath.split("/").pop() || filename;
    } else {
      throw new MailHttpError(400, "Pièce jointe manquante.");
    }
    const download = params.get("download") === "1";
    const { data, error } = await ctx.admin.storage
      .from(MAIL_BUCKET)
      .createSignedUrl(path, 300, download ? { download: filename } : undefined);
    if (error || !data?.signedUrl) throw new MailHttpError(404, "Fichier absent du stockage.");
    return Response.redirect(data.signedUrl, 302);
  } catch (err) {
    return jsonError(err);
  }
}
