import { NextRequest } from "next/server";
import { getMailContext, jsonError, MailHttpError, readJson } from "@/lib/mail/server/context";

const COLOR_RE = /^#[0-9a-f]{6}$/i;

type LabelBody = { id?: string; name?: string; color?: string; shared?: boolean };

function cleanName(name: unknown): string {
  const value = String(name ?? "").trim().replace(/\s+/g, " ");
  if (!value || value.length > 60) throw new MailHttpError(400, "Nom de libellé : 1 à 60 caractères.");
  return value;
}

/** Libellés : personnels pour tout le monde, partagés (visibles par toute l'équipe) pour la direction. */
export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const body = await readJson<LabelBody>(request);
    const shared = Boolean(body.shared);
    if (shared && !ctx.isAdmin) throw new MailHttpError(403, "Seule la direction crée des libellés partagés.");
    const { data, error } = await ctx.admin
      .from("crm_email_labels")
      .insert({
        name: cleanName(body.name),
        color: COLOR_RE.test(String(body.color)) ? body.color : "#6c757d",
        owner_id: shared ? null : ctx.userId,
        created_by: ctx.userId,
      })
      .select("id, name, color, owner_id")
      .single();
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true, label: data });
  } catch (err) {
    return jsonError(err);
  }
}

async function ownedLabel(ctx: Awaited<ReturnType<typeof getMailContext>>, id: string) {
  const { data } = await ctx.userDb.from("crm_email_labels").select("id, owner_id").eq("id", id).maybeSingle();
  if (!data) throw new MailHttpError(404, "Libellé introuvable.");
  if (data.owner_id ? data.owner_id !== ctx.userId : !ctx.isAdmin) {
    throw new MailHttpError(403, "Vous ne pouvez pas modifier ce libellé.");
  }
  return data;
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const body = await readJson<LabelBody>(request);
    await ownedLabel(ctx, String(body.id ?? ""));
    const patch: Record<string, string> = {};
    if (body.name !== undefined) patch.name = cleanName(body.name);
    if (body.color !== undefined && COLOR_RE.test(body.color)) patch.color = body.color;
    const { error } = await ctx.admin.from("crm_email_labels").update(patch).eq("id", body.id as string);
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}

/** Supprimer un libellé ne supprime aucun mail. */
export async function DELETE(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const id = request.nextUrl.searchParams.get("id") ?? "";
    await ownedLabel(ctx, id);
    const { error } = await ctx.admin.from("crm_email_labels").delete().eq("id", id);
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
