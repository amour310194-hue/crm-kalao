import { NextRequest } from "next/server";
import { getMailContext, jsonError } from "@/lib/mail/server/context";

const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const THIN_SPACES = new RegExp("[\u202f\u00a0]", "g");
function formatMoney(value: number): string {
  return `${money.format(Math.round(value)).replace(THIN_SPACES, " ")} FCFA`;
}

function frDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala", day: "numeric", month: "short", year: "numeric" });
}

/**
 * Variables de modèle pour un correspondant : {{nom}}, {{dossier}}, {{reste_a_payer}}…
 * Lu avec les droits de l'utilisateur : sans accès finance, les montants restent vides.
 */
export async function GET(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const params = request.nextUrl.searchParams;
    const email = (params.get("email") ?? "").trim().toLowerCase();
    let contactId = params.get("contactId");
    let companyId = params.get("companyId");
    const vars: Record<string, string> = { expediteur: ctx.fullName, email };

    if (!contactId && email) {
      const { data } = await ctx.userDb.from("contacts").select("id, company_id").ilike("email", email).limit(1).maybeSingle();
      contactId = data?.id ?? null;
      companyId = companyId ?? data?.company_id ?? null;
    }
    if (contactId) {
      const { data } = await ctx.userDb
        .from("contacts")
        .select("first_name, last_name, email, company_id")
        .eq("id", contactId)
        .maybeSingle();
      if (data) {
        vars.prenom = data.first_name ?? "";
        vars.nom = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();
        vars.email = data.email ?? vars.email;
        companyId = companyId ?? data.company_id ?? null;
      }
    }
    if (companyId) {
      const { data } = await ctx.userDb.from("companies").select("name, email").eq("id", companyId).maybeSingle();
      if (data) {
        vars.entreprise = data.name ?? "";
        if (!vars.nom) vars.nom = data.name ?? "";
        if (!vars.email) vars.email = data.email ?? "";
      }
    }
    if (contactId || companyId) {
      let dq = ctx.userDb
        .from("dossiers")
        .select("id, title, status")
        .not("status", "in", "(done,cancelled)")
        .order("updated_at", { ascending: false })
        .limit(1);
      dq = contactId ? dq.eq("contact_id", contactId) : dq.eq("company_id", companyId as string);
      const { data: dossier } = await dq.maybeSingle();
      if (dossier) vars.dossier = dossier.title ?? "";

      let iq = ctx.userDb
        .from("invoices")
        .select("number, amount, paid_amount, due_date, status")
        .neq("status", "cancelled")
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(50);
      iq = contactId && !companyId ? iq.eq("contact_id", contactId) : iq.eq("company_id", (companyId ?? contactId) as string);
      const { data: invoices } = await iq;
      const open = (invoices ?? []).filter((i) => Number(i.amount) - Number(i.paid_amount) > 0);
      if (open.length) {
        const rest = open.reduce((sum, i) => sum + (Number(i.amount) - Number(i.paid_amount)), 0);
        vars.reste_a_payer = formatMoney(rest);
        vars.facture = open[0].number ?? "";
        vars.echeance = frDate(open[0].due_date);
      }
    }
    return Response.json({ ok: true, vars });
  } catch (err) {
    return jsonError(err);
  }
}
