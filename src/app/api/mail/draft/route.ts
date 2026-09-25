import { NextRequest } from "next/server";
import { getMailContext, jsonError, readJson } from "@/lib/mail/server/context";
import { discardDraft, persistOutgoing, prepareOutgoing, type RawCompose } from "@/lib/mail/server/outgoing";

/** Enregistre (crée ou met à jour) un brouillon. Appelé par l'enregistrement automatique de la fenêtre de rédaction. */
export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const raw = await readJson<RawCompose>(request);
    const prepared = await prepareOutgoing(ctx, raw, "draft");
    await persistOutgoing(ctx, prepared, {
      folder: "drafts",
      status: "stored",
      delivery_status: null,
      delivery_detail: null,
      scheduled_at: null,
    });
    return Response.json({ ok: true, id: prepared.id, threadId: prepared.threadId, savedAt: new Date().toISOString() });
  } catch (err) {
    return jsonError(err);
  }
}

/** « Supprimer le brouillon » : un brouillon n'est pas de l'historique, il est effacé. */
export async function DELETE(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const id = request.nextUrl.searchParams.get("id") ?? "";
    await discardDraft(ctx, id);
    return Response.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
