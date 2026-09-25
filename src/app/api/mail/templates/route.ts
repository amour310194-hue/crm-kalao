import { NextRequest } from "next/server";
import { getMailContext, jsonError, MailHttpError, readJson } from "@/lib/mail/server/context";

type TemplateBody = { id?: string; name?: string; subject?: string; body_html?: string; shared?: boolean };

function clean(body: TemplateBody) {
  const name = String(body.name ?? "").trim();
  if (!name || name.length > 80) throw new MailHttpError(400, "Nom du modèle : 1 à 80 caractères.");
  return {
    name,
    subject: String(body.subject ?? "").trim().slice(0, 300),
    body_html: String(body.body_html ?? "").slice(0, 100_000),
  };
}

async function editable(ctx: Awaited<ReturnType<typeof getMailContext>>, id: string) {
  const { data } = await ctx.userDb.from("crm_mail_templates").select("id, owner_id").eq("id", id).maybeSingle();
  if (!data) throw new MailHttpError(404, "Modèle introuvable.");
  if (data.owner_id ? data.owner_id !== ctx.userId : !ctx.isAdmin) {
    throw new MailHttpError(403, "Les modèles partagés sont gérés par la direction.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const body = await readJson<TemplateBody>(request);
    if (body.shared && !ctx.isAdmin) throw new MailHttpError(403, "Les modèles partagés sont gérés par la direction.");
    const { data, error } = await ctx.admin
      .from("crm_mail_templates")
      .insert({ ...clean(body), owner_id: body.shared ? null : ctx.userId, created_by: ctx.userId })
      .select("id, name, subject, body_html, owner_id")
      .single();
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true, template: data });
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const body = await readJson<TemplateBody>(request);
    await editable(ctx, String(body.id ?? ""));
    const { error } = await ctx.admin
      .from("crm_mail_templates")
      .update({ ...clean(body), updated_at: new Date().toISOString() })
      .eq("id", body.id as string);
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const id = request.nextUrl.searchParams.get("id") ?? "";
    await editable(ctx, id);
    const { error } = await ctx.admin.from("crm_mail_templates").delete().eq("id", id);
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
