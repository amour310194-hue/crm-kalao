import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { sendNoreplyMail } from "@/lib/transactional-mail";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email.includes("@")) return Response.json({ ok: false, reason: "email" }, { status: 400 });
    const admin = getServiceSupabase();
    const { data: contact } = await admin.from("contacts").select("id").eq("email", email).maybeSingle();
    if (!contact?.id) {
      return Response.json({ ok: true, dispatched: false, detail: "Aucune fiche client pour cette adresse." });
    }
    const link = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: "https://crm.groupe-kalao.com/portail" },
    });
    const action = link.data?.properties?.action_link;
    if (!action) {
      return Response.json({ ok: false, dispatched: false, detail: "Lien impossible à préparer." }, { status: 500 });
    }
    await admin.from("portal_access").insert({ contact_id: contact.id, email });
    const sent = await sendNoreplyMail({
      to: email,
      subject: "Votre espace client Kalao",
      body: `Ouvrez ce lien pour consulter votre dossier : ${action}`,
    });
    return Response.json({ ok: true, dispatched: sent.dispatched, detail: sent.detail ?? null });
  } catch (err) {
    console.error("portail lien", err);
    return Response.json({ ok: false, detail: "Envoi indisponible." }, { status: 500 });
  }
}
