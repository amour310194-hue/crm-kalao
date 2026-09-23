import {
  fetchCompanies,
  fetchContacts,
  fetchDossiers,
  fetchEmployees,
  fetchInvoices,
  fetchPayments,
  fetchPayRuns,
  fetchQuotes,
  formatDate,
  formatMoney,
  type CompanyRow,
  type ContactRow,
  type DossierRow,
  type EmployeeRow,
  type InvoiceRow,
  type PaymentRow,
  type QuoteRow,
} from "@/lib/crm";
import { fetchCatalogItems } from "@/lib/catalog";
import {
  canadaSchedule,
  entityForDoc,
  isCanadaProcedure,
  type CanadaTranche,
  type KalaoEntity,
} from "@/lib/org";

export const DOC_KINDS = [
  "invoice",
  "quote",
  "receipt",
  "visa",
  "employment",
  "certificate",
  "payslip",
] as const;

export type DocKind = (typeof DOC_KINDS)[number];

export function isLiveId(value: string | null | undefined): value is string {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value ?? ""
  );
}

export function docHref(kind: DocKind, id: string): string {
  return `/docs/${kind}/${id}`;
}

export type DocParty = {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
  passport: string;
  profession: string;
};

export type DocLine = {
  label: string;
  qty: string;
  unit: string;
  total: string;
};

export type DocView = {
  kind: DocKind;
  title: string;
  ref: string;
  issuedAt: string;
  entity: KalaoEntity;
  party: DocParty;
  intro: string;
  lines: DocLine[];
  totalLabel: string;
  total: string;
  notes: string[];
  articles: { heading: string; body: string }[];
  signatures: { role: string; name: string; title: string }[];
};

function partyFrom(
  company?: CompanyRow | null,
  contact?: ContactRow | null
): DocParty {
  const name =
    [contact?.first_name, contact?.last_name].filter(Boolean).join(" ").trim() ||
    company?.name ||
    "—";
  return {
    name,
    address: company?.address || "—",
    city: [company?.city, company?.country].filter(Boolean).join(", ") || "Yaoundé, Cameroun",
    phone: contact?.phone || company?.phone || "—",
    email: contact?.email || company?.email || "—",
    nationality: contact?.nationality || "Camerounaise",
    birthDate: formatDate(contact?.birth_date),
    birthPlace: contact?.birth_place || "—",
    passport: contact?.passport_no || "—",
    profession: contact?.job_title || "—",
  };
}

function emptyView(kind: DocKind, message: string): DocView {
  const entity = entityForDoc(kind);
  return {
    kind,
    title: "Document introuvable",
    ref: "—",
    issuedAt: formatDate(new Date().toISOString()),
    entity,
    party: {
      name: "—",
      address: "—",
      city: "—",
      phone: "—",
      email: "—",
      nationality: "—",
      birthDate: "—",
      birthPlace: "—",
      passport: "—",
      profession: "—",
    },
    intro: message,
    lines: [],
    totalLabel: "",
    total: "",
    notes: [],
    articles: [],
    signatures: [],
  };
}

export async function loadDocView(kind: DocKind, id: string): Promise<DocView> {
  if (!isLiveId(id)) {
    return emptyView(kind, "Identifiant invalide.");
  }
  if (kind === "invoice") return loadInvoice(id);
  if (kind === "quote") return loadQuote(id);
  if (kind === "receipt") return loadReceipt(id);
  if (kind === "visa") return loadVisa(id);
  if (kind === "employment") return loadEmployment(id);
  if (kind === "certificate") return loadCertificate(id);
  return loadPayslip(id);
}

async function loadInvoice(id: string): Promise<DocView> {
  const [invoices, companies, contacts] = await Promise.all([
    fetchInvoices(),
    fetchCompanies(),
    fetchContacts(),
  ]);
  const invoice = invoices?.find((row) => row.id === id);
  if (!invoice) return emptyView("invoice", "Facture introuvable.");
  const company = companies?.find((row) => row.id === invoice.company_id) ?? null;
  const contact = contacts?.find((row) => row.id === invoice.contact_id) ??
    contacts?.find((row) => row.company_id === invoice.company_id) ??
    null;
  const remaining = Math.max(0, Number(invoice.amount) - Number(invoice.paid_amount));
  return {
    kind: "invoice",
    title: "FACTURE",
    ref: invoice.number ? `FAC/${invoice.number}` : `FAC/${invoice.id.slice(0, 8).toUpperCase()}`,
    issuedAt: formatDate(invoice.created_at),
    entity: entityForDoc("invoice"),
    party: partyFrom(company, contact),
    intro: invoice.project || "Prestation Groupe Kalao",
    lines: [
      {
        label: invoice.project || "Prestation",
        qty: "1",
        unit: formatMoney(invoice.amount),
        total: formatMoney(invoice.amount),
      },
    ],
    totalLabel: "Montant TTC",
    total: formatMoney(invoice.amount),
    notes: [
      `Déjà encaissé : ${formatMoney(invoice.paid_amount)}`,
      `Reste dû : ${formatMoney(remaining)}`,
      `Échéance : ${formatDate(invoice.due_date)}`,
      `Statut : ${invoice.status}`,
      "Paiement : virement, Mobile Money ou espèces.",
    ],
    articles: [],
    signatures: signOff("invoice"),
  };
}

async function loadQuote(id: string): Promise<DocView> {
  const [quotes, companies, contacts] = await Promise.all([
    fetchQuotes(),
    fetchCompanies(),
    fetchContacts(),
  ]);
  const quote = quotes?.find((row) => row.id === id);
  if (!quote) return emptyView("quote", "Devis introuvable.");
  const company = companies?.find((row) => row.id === quote.company_id) ?? null;
  const contact = contacts?.find((row) => row.id === quote.contact_id) ??
    contacts?.find((row) => row.company_id === quote.company_id) ??
    null;
  const lines = (quote.quote_lines ?? []).map((line) => ({
    label: line.label,
    qty: String(line.quantity),
    unit: formatMoney(line.unit_price),
    total: formatMoney(Number(line.quantity) * Number(line.unit_price)),
  }));
  const total = (quote.quote_lines ?? []).reduce(
    (sum, line) => sum + Number(line.quantity) * Number(line.unit_price),
    0
  );
  return {
    kind: "quote",
    title: "DEVIS",
    ref: quote.number ? `DEV/${quote.number}` : `DEV/${quote.id.slice(0, 8).toUpperCase()}`,
    issuedAt: formatDate(quote.created_at),
    entity: entityForDoc("quote"),
    party: partyFrom(company, contact),
    intro: quote.notes || "Proposition commerciale Groupe Kalao",
    lines: lines.length
      ? lines
      : [{ label: quote.notes || "Prestation", qty: "1", unit: formatMoney(total), total: formatMoney(total) }],
    totalLabel: "Montant proposé",
    total: formatMoney(total),
    notes: [
      `Valide jusqu'au ${formatDate(quote.valid_until)}`,
      `Statut : ${quote.status}`,
      "Ce devis n'est pas une facture. L'acceptation génère la facture.",
    ],
    articles: [],
    signatures: signOff("quote"),
  };
}

async function loadReceipt(id: string): Promise<DocView> {
  const [payments, invoices, companies, contacts] = await Promise.all([
    fetchPayments(),
    fetchInvoices(),
    fetchCompanies(),
    fetchContacts(),
  ]);
  const payment = payments?.find((row) => row.id === id);
  if (!payment) return emptyView("receipt", "Paiement introuvable.");
  const invoice = invoices?.find((row) => row.id === payment.invoice_id);
  const company = companies?.find((row) => row.id === invoice?.company_id) ?? null;
  const contact = contacts?.find((row) => row.company_id === invoice?.company_id) ?? null;
  return {
    kind: "receipt",
    title: "REÇU / QUITTANCE",
    ref: payment.transaction_id || `REC/${payment.id.slice(0, 8).toUpperCase()}`,
    issuedAt: formatDate(payment.paid_at || payment.created_at),
    entity: entityForDoc("receipt"),
    party: partyFrom(company, contact),
    intro: `Quittance de paiement sur la facture ${invoice?.number ? `#${invoice.number}` : ""}.`,
    lines: [
      {
        label: invoice?.project || "Encaissement",
        qty: "1",
        unit: formatMoney(payment.amount),
        total: formatMoney(payment.amount),
      },
    ],
    totalLabel: "Montant reçu",
    total: formatMoney(payment.amount),
    notes: [
      `Mode : ${payment.method === "cash" ? "Espèces" : payment.method}`,
      `Facture : ${invoice?.number ? `#${invoice.number}` : "—"}`,
      "Ce reçu vaut quittance pour la somme indiquée.",
    ],
    articles: [],
    signatures: signOff("receipt"),
  };
}

async function loadVisa(id: string): Promise<DocView> {
  const [dossiers, companies, contacts, invoices, catalog] = await Promise.all([
    fetchDossiers(),
    fetchCompanies(),
    fetchContacts(),
    fetchInvoices(),
    fetchCatalogItems(),
  ]);
  const dossier = dossiers?.find((row) => row.id === id);
  if (!dossier) return emptyView("visa", "Dossier introuvable.");
  const company = companies?.find((row) => row.id === dossier.company_id) ?? null;
  const contact = contacts?.find((row) => row.id === dossier.contact_id) ??
    contacts?.find((row) => row.company_id === dossier.company_id) ??
    null;
  const related = (invoices ?? []).filter((row) => row.dossier_id === dossier.id);
  const billed = related.reduce((sum, row) => sum + Number(row.amount), 0);
  const canadaItems = (catalog ?? []).filter((item) =>
    isCanadaProcedure(item.sku, item.name)
  );
  const catalogItem = /3500|etudiant|deuxi[eè]me|IMM-CAN-2/i.test(dossier.title)
    ? canadaItems.find((item) => item.sku === "IMM-CAN-2")
    : canadaItems.find((item) => item.sku === "IMM-CAN") ??
      (catalog ?? []).find((item) =>
        new RegExp((item.name.match(/Russie|Allemagne|Canada/i) ?? [])[0] ?? "nomatch", "i").test(
          dossier.title
        )
      ) ??
      null;
  const total = billed || Number(catalogItem?.unit_price ?? 0);
  const canada = isCanadaProcedure(dossier.title, catalogItem?.name, catalogItem?.sku);
  const schedule: CanadaTranche[] = canada && total > 0 ? canadaSchedule(total) : [];
  const party = partyFrom(company, contact);
  const articles = visaArticles({
    party,
    dossier,
    total,
    canada,
    schedule,
    bassinDrawn: Boolean(dossier.bassin_drawn),
  });
  return {
    kind: "visa",
    title: "CONTRAT DE PRESTATION — IMMIGRATION",
    ref: `CPS/KGT/${dossier.id.slice(0, 8).toUpperCase()}`,
    issuedAt: formatDate(dossier.start_at || dossier.updated_at),
    entity: entityForDoc("visa"),
    party,
    intro: `Accompagnement à l'immigration — ${dossier.title}.`,
    lines: (schedule.length
      ? schedule.map((row) => ({
          label: row.label,
          qty: "1",
          unit: formatMoney(row.amount),
          total: formatMoney(row.amount),
        }))
      : related.map((row) => ({
          label: row.project || "Échéance",
          qty: "1",
          unit: formatMoney(row.amount),
          total: formatMoney(row.amount),
        }))
    ),
    totalLabel: "Honoraires",
    total: formatMoney(total),
    notes: [
      canada
        ? "Canada : 1 100 000 FCFA à l'ouverture, 1 500 000 FCFA si tiré du bassin, solde au retrait du visa — pour les deux formules (4 500 000 et 3 500 000)."
        : "Paiement selon les factures du dossier.",
      dossier.bassin_drawn ? "Tirage du bassin : oui." : "Tirage du bassin : non signalé.",
      `Échéance dossier : ${formatDate(dossier.end_at)}`,
    ],
    articles,
    signatures: [
      { role: "Le client", name: party.name, title: party.profession },
      {
        role: "L'agence",
        name: entityForDoc("visa").representative,
        title: entityForDoc("visa").representativeTitle,
      },
    ],
  };
}

async function loadEmployment(id: string): Promise<DocView> {
  const employees = await fetchEmployees();
  const employee = employees?.find((row) => row.id === id);
  if (!employee) return emptyView("employment", "Collaborateur introuvable.");
  return employmentView(employee, "employment");
}

async function loadCertificate(id: string): Promise<DocView> {
  const employees = await fetchEmployees();
  const employee = employees?.find((row) => row.id === id);
  if (!employee) return emptyView("certificate", "Collaborateur introuvable.");
  return employmentView(employee, "certificate");
}

async function loadPayslip(id: string): Promise<DocView> {
  const runs = await fetchPayRuns();
  const run = runs?.find((row) => row.id === id);
  if (!run) return emptyView("payslip", "Bulletin introuvable.");
  const employees = await fetchEmployees();
  const employee = employees?.find((row) => row.id === run.employee_id);
  const base = Number(run.amount);
  const bonus = Number(run.bonus || 0);
  const configured =
    Number(employee?.salary_base || 0) +
    Number(employee?.bonus_performance || 0) +
    Number(employee?.bonus_responsibility || 0) +
    Number(employee?.transport_allowance || 0);
  const gross = base + bonus || configured;
  const cnps = Math.round(Number(employee?.salary_base || base) * 0.042);
  const net = Math.max(0, gross - cnps);
  return {
    kind: "payslip",
    title: "BULLETIN DE PAIE",
    ref: `PAY/${run.period}/${run.id.slice(0, 6).toUpperCase()}`,
    issuedAt: formatDate(run.paid_at),
    entity: entityForDoc("payslip"),
    party: {
      name: employee?.full_name || run.employees?.full_name || "Collaborateur",
      address: employee?.address || "Yaoundé",
      city: "Yaoundé, Cameroun",
      phone: employee?.phone || "—",
      email: employee?.email || "—",
      nationality: employee?.nationality || "Camerounaise",
      birthDate: formatDate(employee?.birth_date),
      birthPlace: employee?.birth_place || "—",
      passport: employee?.passport_no || "—",
      profession: employee?.job_title || run.employees?.job_title || "—",
    },
    intro: `Période ${run.period}`,
    lines: [
      { label: "Salaire de base", qty: "1", unit: formatMoney(employee?.salary_base || base), total: formatMoney(employee?.salary_base || base) },
      { label: "Prime de rendement", qty: "1", unit: formatMoney(employee?.bonus_performance || 0), total: formatMoney(employee?.bonus_performance || 0) },
      { label: "Prime de responsabilité", qty: "1", unit: formatMoney(employee?.bonus_responsibility || 0), total: formatMoney(employee?.bonus_responsibility || 0) },
      { label: "Indemnité de transport", qty: "1", unit: formatMoney(employee?.transport_allowance || 0), total: formatMoney(employee?.transport_allowance || 0) },
      { label: "Prime du mois", qty: "1", unit: formatMoney(bonus), total: formatMoney(bonus) },
      { label: "CNPS salarié 4,2 %", qty: "1", unit: `− ${formatMoney(cnps)}`, total: `− ${formatMoney(cnps)}` },
    ],
    totalLabel: "Net à payer",
    total: formatMoney(net),
    notes: [
      employee?.cnps_number ? `N° CNPS : ${employee.cnps_number}` : "Immatriculation CNPS à compléter.",
      "Déductions IRPP selon barème en vigueur.",
    ],
    articles: [],
    signatures: signOff("payslip"),
  };
}

function employmentView(employee: EmployeeRow, kind: "employment" | "certificate"): DocView {
  const entity = entityForDoc(kind);
  const hired = formatDate(employee.hired_at);
  const weekly = Number(employee.weekly_hours || 40);
  const party: DocParty = {
    name: employee.full_name,
    address: employee.address || "Yaoundé, Cameroun",
    city: "Yaoundé, Cameroun",
    phone: employee.phone || "—",
    email: employee.email || "—",
    nationality: employee.nationality || "Camerounaise",
    birthDate: formatDate(employee.birth_date),
    birthPlace: employee.birth_place || "—",
    passport: employee.passport_no || "—",
    profession: employee.job_title || "Collaborateur",
  };
  if (kind === "certificate") {
    return {
      kind,
      title: "ATTESTATION DE TRAVAIL",
      ref: employee.contract_ref || `KC/DG/CE/${employee.id.slice(0, 6).toUpperCase()}`,
      issuedAt: formatDate(new Date().toISOString()),
      entity,
      party,
      intro: `${entity.representative}, ${entity.representativeTitle} de ${entity.legalName}, certifie que ${party.name} est employé(e) en qualité de ${party.profession}.`,
      lines: [
        { label: "Contrat", qty: "1", unit: employee.contract_type || "CDI", total: employee.contract_type || "CDI" },
        { label: "Date d'embauche", qty: "1", unit: hired, total: hired },
        { label: "Salaire de base", qty: "1", unit: formatMoney(employee.salary_base), total: formatMoney(employee.salary_base) },
      ],
      totalLabel: "",
      total: "",
      notes: [
        "Attestation délivrée pour servir et valoir ce que de droit.",
        `Fait à Yaoundé, le ${formatDate(new Date().toISOString())}.`,
      ],
      articles: [],
      signatures: [{ role: "L'employeur", name: entity.representative, title: entity.representativeTitle }],
    };
  }
  return {
    kind,
    title: "CONTRAT DE TRAVAIL",
    ref: employee.contract_ref || `KC/DG/CT/${employee.id.slice(0, 6).toUpperCase()}`,
    issuedAt: hired,
    entity,
    party,
    intro: `${entity.legalName} engage ${party.name} en ${employee.contract_type || "CDI"}, ${weekly} heures / semaine.`,
    lines: [
      { label: "Salaire de base", qty: "1", unit: formatMoney(employee.salary_base), total: formatMoney(employee.salary_base) },
      { label: "Prime de rendement", qty: "1", unit: formatMoney(employee.bonus_performance), total: formatMoney(employee.bonus_performance) },
      { label: "Prime de responsabilité", qty: "1", unit: formatMoney(employee.bonus_responsibility), total: formatMoney(employee.bonus_responsibility) },
      { label: "Indemnité de transport", qty: "1", unit: formatMoney(employee.transport_allowance), total: formatMoney(employee.transport_allowance) },
    ],
    totalLabel: "Rémunération mensuelle configurée",
    total: formatMoney(
      Number(employee.salary_base) +
        Number(employee.bonus_performance) +
        Number(employee.bonus_responsibility) +
        Number(employee.transport_allowance)
    ),
    notes: [],
    articles: employmentArticles(employee, party, entity),
    signatures: [
      { role: "L'employeur", name: entity.representative, title: entity.representativeTitle },
      { role: "Le salarié", name: party.name, title: party.profession },
    ],
  };
}

function signOff(kind: DocKind): { role: string; name: string; title: string }[] {
  const entity = entityForDoc(kind);
  return [{ role: "Pour l'entreprise", name: entity.representative, title: entity.representativeTitle }];
}

function visaArticles(input: {
  party: DocParty;
  dossier: DossierRow;
  total: number;
  canada: boolean;
  schedule: CanadaTranche[];
  bassinDrawn: boolean;
}): { heading: string; body: string }[] {
  const { party, dossier, total, canada, schedule, bassinDrawn } = input;
  const pay = canada
    ? schedule
        .map((row) => `• ${row.label} : ${formatMoney(row.amount)} (${row.when})`)
        .join("\n")
    : `Honoraires : ${formatMoney(total)}, selon les factures du dossier.`;
  return [
    {
      heading: "1. Parties",
      body: `Entre Kalao Globe Trek, Bastos Yaoundé, représentée par ${entityForDoc("visa").representative}, et ${party.name}, demeurant à ${party.address}, ${party.city}, tél. ${party.phone}, e-mail ${party.email}, nationalité ${party.nationality}, né(e) le ${party.birthDate} à ${party.birthPlace}, profession ${party.profession}, passeport ${party.passport}.`,
    },
    {
      heading: "2. Objet",
      body: `Accompagnement à l'immigration et à l'obtention d'un contrat de travail / lettre d'admission pour le dossier « ${dossier.title} ». Les services comprennent l'évaluation du profil, la préparation des pièces, le suivi de la demande, et les conseils d'arrivée. L'agence ne garantit pas la décision des autorités.`,
    },
    {
      heading: "3. Honoraires et paiement",
      body: canada
        ? `Les deux procédures Canada (4 500 000 et 3 500 000 FCFA) se paient en trois fois.\n${pay}\nTirage du bassin : ${bassinDrawn ? "oui" : "non encore signalé"}. Moyens : virement, Mobile Money, espèces. Tout retard de plus de 15 jours peut suspendre le dossier. Aucun intérêt de retard journalier n'est appliqué.`
        : pay,
    },
    {
      heading: "4. Délais",
      body: `Consultation sous 10 jours. Préparation et recherche : jusqu'à 150 jours sous réserve des pièces. Échéance indiquée sur le dossier : ${formatDate(dossier.end_at)}.`,
    },
    {
      heading: "5. Pièces du client",
      body: "Passeport valide, photos, diplômes / expérience, preuves de fonds si exigées, et tout document demandé par l'ambassade ou l'employeur, dans les 7 jours suivant la signature.",
    },
    {
      heading: "6. Remboursement",
      body: "Refus de visa : remboursement partiel possible sur présentation de la décision officielle, si les honoraires ont été intégralement versés. Après soumission du dossier consulaire, la première tranche n'est pas remboursable. Annulation avant démarrage : remboursement partiel selon le travail déjà fait.",
    },
    {
      heading: "7. Confidentialité",
      body: "Les informations du client ne sont utilisées que pour l'exécution du dossier (autorités, employeur, université). Accès limité aux collaborateurs concernés. L'obligation survit à la fin du contrat.",
    },
    {
      heading: "8. Responsabilité et force majeure",
      body: "L'agence agit avec diligence. Elle n'est pas responsable des décisions consulaires, ni des cas de force majeure (catastrophe, conflit, pandémie, grève, panne d'infrastructure).",
    },
    {
      heading: "9. Résiliation et litiges",
      body: "Résiliation du client par e-mail à contact@kalao-globe-trek.com. Manquement grave : mise en demeure de 8 jours puis résiliation. Droit camerounais. Tribunaux de Yaoundé. Version française prévaut.",
    },
    {
      heading: "10. Signature",
      body: `Fait à Yaoundé en deux originaux. ${party.name} reconnaît avoir lu et accepté l'ensemble des clauses.`,
    },
  ];
}

function employmentArticles(
  employee: EmployeeRow,
  party: DocParty,
  entity: KalaoEntity
): { heading: string; body: string }[] {
  const weekly = Number(employee.weekly_hours || 40);
  const days = weekly >= 60 ? 6 : 5;
  const hoursDay = Math.round(weekly / days);
  return [
    {
      heading: "Article 1 — Nature",
      body: `Contrat ${employee.contract_type || "CDI"} régi par le Code du travail camerounais (loi n° 92/007 du 14 août 1992). Prise d'effet le ${formatDate(employee.hired_at)}. Période d'essai de trois mois, résiliable sans préavis ni indemnité.`,
    },
    {
      heading: "Article 2 — Poste",
      body: `${party.name} est engagé(e) en qualité de ${party.profession}. Il/elle exécute les missions liées à cette fonction, selon les instructions de ${entity.legalName}.`,
    },
    {
      heading: "Article 3 — Horaires",
      body: `${weekly} heures par semaine, soit ${hoursDay} heures par jour sur ${days} jours, un jour de repos hebdomadaire. Heures supplémentaires selon le Code du travail.`,
    },
    {
      heading: "Article 4 — Rémunération",
      body: `Salaire de base ${formatMoney(employee.salary_base)}, prime de rendement ${formatMoney(employee.bonus_performance)}, prime de responsabilité ${formatMoney(employee.bonus_responsibility)}, transport ${formatMoney(employee.transport_allowance)}. Paiement le premier vendredi du mois suivant, en espèces ou virement. CNPS 4,2 % et IRPP à la source.`,
    },
    {
      heading: "Article 5 — Protection sociale et congés",
      body: `Immatriculation CNPS${employee.cnps_number ? ` (n° ${employee.cnps_number})` : ""}. Congés payés : 18 jours ouvrables par année de service.`,
    },
    {
      heading: "Article 6 — Obligations",
      body: "Diligence, confidentialité, loyauté, respect du règlement intérieur. Toute absence est signalée sans délai.",
    },
    {
      heading: "Article 7 — Rupture",
      body: "Préavis : 8 jours (< 6 mois), 1 mois (6 à 12 mois), 2 mois (> 1 an). Faute lourde : rupture sans préavis selon la procédure légale.",
    },
    {
      heading: "Article 8 — Litiges",
      body: "Droit camerounais. Conciliation puis Tribunal du travail de Yaoundé. Deux originaux, un pour chaque partie.",
    },
  ];
}

export function companyDocLinks(input: {
  companyId: string;
  invoices: InvoiceRow[];
  dossiers: DossierRow[];
  quotes?: QuoteRow[];
  payments?: PaymentRow[];
}) {
  const links: { href: string; label: string }[] = [];
  for (const dossier of input.dossiers) {
    if (dossier.kind === "visa") {
      links.push({ href: docHref("visa", dossier.id), label: `Protocole visa — ${dossier.title}` });
    }
  }
  for (const quote of input.quotes ?? []) {
    links.push({ href: docHref("quote", quote.id), label: `Devis ${quote.number ?? quote.id.slice(0, 8)}` });
  }
  for (const invoice of input.invoices) {
    links.push({ href: docHref("invoice", invoice.id), label: `Facture ${invoice.number ?? invoice.id.slice(0, 8)}` });
  }
  for (const payment of input.payments ?? []) {
    links.push({ href: docHref("receipt", payment.id), label: `Reçu ${payment.transaction_id ?? payment.id.slice(0, 6)}` });
  }
  return links;
}
