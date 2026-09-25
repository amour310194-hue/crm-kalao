import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { getMailContext, jsonError, MailHttpError, readJson } from "@/lib/mail/server/context";
import { safeFilename } from "@/lib/mail/html";
import { MAIL_BUCKET, MAX_ATTACHMENT_BYTES } from "@/lib/mail/types";

/**
 * URL d'envoi signée : le navigateur dépose le fichier directement dans le stockage privé
 * (plus de base64 dans la requête, donc plus de plafond Vercel à ~3 Mo).
 */
export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const body = await readJson<{ filename?: string; size?: number; contentType?: string }>(request);
    const size = Number(body.size) || 0;
    if (size <= 0) throw new MailHttpError(400, "Fichier vide.");
    if (size > MAX_ATTACHMENT_BYTES) throw new MailHttpError(413, "Fichier trop volumineux (25 Mo maximum).");
    const path = `outgoing/${ctx.userId}/${randomUUID()}/${safeFilename(String(body.filename ?? "fichier"))}`;
    const { data, error } = await ctx.admin.storage.from(MAIL_BUCKET).createSignedUploadUrl(path);
    if (error || !data) throw new MailHttpError(500, error?.message ?? "upload_url");
    return Response.json({ ok: true, path, token: data.token, signedUrl: data.signedUrl });
  } catch (err) {
    return jsonError(err);
  }
}
