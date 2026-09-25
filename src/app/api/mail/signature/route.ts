import { NextRequest } from "next/server";
import { getMailContext, jsonError, MailHttpError, readJson } from "@/lib/mail/server/context";

export async function PUT(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const { html } = await readJson<{ html?: string }>(request);
    const { error } = await ctx.admin
      .from("crm_mail_signatures")
      .upsert({ user_id: ctx.userId, html: String(html ?? "").slice(0, 20_000), updated_at: new Date().toISOString() });
    if (error) throw new MailHttpError(500, error.message);
    return Response.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
