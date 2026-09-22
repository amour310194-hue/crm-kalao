"use client";
import {
  fetchActivities,
  fetchCompanies,
  fetchContacts,
  fetchDeals,
  fetchDossiers,
  fetchInvoices,
  fetchLeads,
  fetchPayRuns,
  fetchPayments,
  fetchQuotes,
  formatDate,
  formatMoney,
  type ActivityRow,
  type DealRow,
  type DossierKind,
  type DossierRow,
  type InvoiceRow,
  type LeadRow,
  type QuoteRow,
} from "@/lib/crm";
import { useCallback, useEffect, useState } from "react";

export interface CountValue {
  key: string;
  label: string;
  count: number;
  value: number;
}

export interface MonthPoint {
  label: string;
  invoiced: number;
  collected: number;
}

export interface DeadlineRow {
  key: string;
  title: string;
  date: string;
  dateLabel: string;
  origin: string;
}

export interface KalaoKpis {
  collected: number;
  collectedMtd: number;
  collectedYtd: number;
  invoiced: number;
  outstanding: number;
  unpaidCount: number;
  quotesPendingCount: number;
  quotesPendingValue: number;
  dealsActive: number;
  dealsWon: number;
  dealsLost: number;
  dealsUpcoming: number;
  dealsTotal: number;
  dealsValue: number;
  avgDealValue: number;
  conversionRate: number;
  collectedGrowth: number;
  pipeline: CountValue[];
  companies: number;
  contacts: number;
  leads: number;
  leadsByStatus: CountValue[];
  leadsByPole: CountValue[];
  dossiersOpen: number;
  dossiersByKind: CountValue[];
  payDue: number;
  payDueCount: number;
  months: MonthPoint[];
  topCompanies: CountValue[];
  recentDeals: {
    key: string;
    title: string;
    company: string;
    amount: string;
    probability: number;
    stage: string;
  }[];
  recentLeads: {
    key: string;
    name: string;
    company: string;
    phone: string;
    status: string;
    tone: string;
  }[];
  recentDossiers: {
    key: string;
    title: string;
    company: string;
    kind: DossierKind;
    kindLabel: string;
    status: string;
    endLabel: string;
    members: string;
  }[];
  deadlines: DeadlineRow[];
  activitiesOpen: number;
}

const DEAL_STAGE_FR: Record<string, string> = {
  qualification: "Qualification",
  proposal: "Proposition",
  negotiation: "Négociation",
  won: "Gagné",
  lost: "Perdu",
};

const LEAD_STATUS_FR: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  qualified: "Qualifié",
  unqualified: "Non qualifié",
  converted: "Converti",
};

const LEAD_TONE: Record<string, string> = {
  new: "secondary",
  contacted: "info",
  qualified: "success",
  unqualified: "danger",
  converted: "success",
};

const KIND_FR: Record<DossierKind, string> = {
  chantier: "Chantiers",
  plantation: "Plantations",
  voyage: "Voyages",
  visa: "Visas",
  evenement: "Événements",
  bien: "Baux",
};

const monthFmt = new Intl.DateTimeFormat("fr-FR", { month: "short" });

function quoteValue(quote: QuoteRow): number {
  return (quote.quote_lines ?? []).reduce(
    (sum, line) =>
      sum + Number(line.quantity) * Number(line.unit_price) * (1 + Number(line.tax_rate) / 100),
    0
  );
}

function groupBy<T>(
  rows: T[],
  keyOf: (row: T) => string,
  labelOf: (key: string) => string,
  valueOf: (row: T) => number
): CountValue[] {
  const map = new Map<string, CountValue>();
  rows.forEach((row) => {
    const key = keyOf(row);
    const current = map.get(key) ?? { key, label: labelOf(key), count: 0, value: 0 };
    current.count += 1;
    current.value += valueOf(row);
    map.set(key, current);
  });
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function lastMonths(count: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: d.toISOString().slice(0, 7), label: monthFmt.format(d) });
  }
  return out;
}

function invoiceDue(row: InvoiceRow): number {
  return Math.max(0, Number(row.amount) - Number(row.paid_amount));
}

/** Variation en % entre deux périodes, 0 quand la référence est vide. */
function growthPct(current: number, previous: number): number {
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Échéances des 60 prochains jours, toutes origines confondues. */
function buildDeadlines(
  activities: ActivityRow[],
  dossiers: DossierRow[],
  invoices: InvoiceRow[]
): DeadlineRow[] {
  const limit = new Date();
  limit.setDate(limit.getDate() + 60);
  const floor = new Date();
  floor.setDate(floor.getDate() - 7);

  const rows: DeadlineRow[] = [];
  const push = (key: string, title: string, raw: string | null, origin: string) => {
    if (!raw) return;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime()) || d < floor || d > limit) return;
    rows.push({ key, title, date: raw, dateLabel: formatDate(raw), origin });
  };

  activities.forEach((a) => push(`act-${a.id}`, a.subject, a.due_at, "Activité"));
  dossiers.forEach((d) => push(`dos-${d.id}`, d.title, d.end_at, KIND_FR[d.kind] ?? "Dossier"));
  invoices
    .filter((i) => i.status !== "paid")
    .forEach((i) =>
      push(
        `inv-${i.id}`,
        `Facture ${i.number ? `#${i.number}` : i.id.slice(0, 8)} — ${formatMoney(invoiceDue(i))}`,
        i.due_date,
        "Facture"
      )
    );

  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

function leadPoles(leads: LeadRow[]): CountValue[] {
  const map = new Map<string, CountValue>();
  leads.forEach((lead) => {
    const poles = lead.lead_affiliations ?? [];
    if (!poles.length) {
      const current = map.get("autre") ?? { key: "autre", label: "Sans pôle", count: 0, value: 0 };
      current.count += 1;
      current.value += Number(lead.estimated_value ?? 0);
      map.set("autre", current);
      return;
    }
    poles.forEach((p) => {
      const label = p.departments?.name ?? p.departments?.code ?? "Pôle";
      const current = map.get(label) ?? { key: label, label, count: 0, value: 0 };
      current.count += 1;
      current.value += Number(lead.estimated_value ?? 0);
      map.set(label, current);
    });
  });
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export async function fetchKalaoKpis(): Promise<KalaoKpis | null> {
  const [deals, invoices, payments, quotes, leads, contacts, companies, dossiers, payRuns, activities] =
    await Promise.all([
      fetchDeals(),
      fetchInvoices(),
      fetchPayments(),
      fetchQuotes(),
      fetchLeads(),
      fetchContacts(),
      fetchCompanies(),
      fetchDossiers(),
      fetchPayRuns(),
      fetchActivities(),
    ]);

  if (!deals || !invoices || !payments) return null;

  const today = new Date().toISOString().slice(0, 10);
  const dealRows = deals as DealRow[];
  const closedWon = dealRows.filter((d) => d.stage === "won");
  const closedLost = dealRows.filter((d) => d.stage === "lost");
  const active = dealRows.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const decided = closedWon.length + closedLost.length;

  const collected = payments.reduce((s, p) => s + Number(p.amount), 0);
  const invoiced = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const unpaid = invoices.filter((i) => i.status !== "paid");
  const pendingQuotes = (quotes ?? []).filter((q) => q.status === "draft" || q.status === "sent");
  const dueRuns = (payRuns ?? []).filter((r) => r.status !== "paid");
  const openActivities = (activities ?? []).filter((a) => !a.done);

  const months = lastMonths(6).map(({ key, label }) => ({
    label,
    invoiced: invoices
      .filter((i) => (i.created_at ?? "").slice(0, 7) === key)
      .reduce((s, i) => s + Number(i.amount), 0),
    collected: payments
      .filter((p) => (p.paid_at ?? "").slice(0, 7) === key)
      .reduce((s, p) => s + Number(p.amount), 0),
  }));

  return {
    collected,
    collectedMtd: payments
      .filter((p) => (p.paid_at ?? "").slice(0, 7) === today.slice(0, 7))
      .reduce((s, p) => s + Number(p.amount), 0),
    collectedYtd: payments
      .filter((p) => (p.paid_at ?? "").slice(0, 4) === today.slice(0, 4))
      .reduce((s, p) => s + Number(p.amount), 0),
    invoiced,
    outstanding: unpaid.reduce((s, i) => s + invoiceDue(i), 0),
    unpaidCount: unpaid.length,
    quotesPendingCount: pendingQuotes.length,
    quotesPendingValue: pendingQuotes.reduce((s, q) => s + quoteValue(q), 0),
    dealsActive: active.length,
    dealsWon: closedWon.length,
    dealsLost: closedLost.length,
    dealsUpcoming: active.filter(
      (d) => d.expected_close_date && d.expected_close_date >= today
    ).length,
    dealsTotal: dealRows.length,
    dealsValue: dealRows.reduce((s, d) => s + Number(d.amount), 0),
    avgDealValue: dealRows.length
      ? dealRows.reduce((s, d) => s + Number(d.amount), 0) / dealRows.length
      : 0,
    conversionRate: decided ? Math.round((closedWon.length / decided) * 1000) / 10 : 0,
    collectedGrowth: growthPct(
      months[months.length - 1]?.collected ?? 0,
      months[months.length - 2]?.collected ?? 0
    ),
    pipeline: groupBy(
      dealRows,
      (d) => d.stage,
      (k) => DEAL_STAGE_FR[k] ?? k,
      (d) => Number(d.amount)
    ),
    companies: (companies ?? []).length,
    contacts: (contacts ?? []).length,
    leads: (leads ?? []).length,
    leadsByStatus: groupBy(
      leads ?? [],
      (l) => l.status,
      (k) => LEAD_STATUS_FR[k] ?? k,
      (l) => Number(l.estimated_value ?? 0)
    ),
    leadsByPole: leadPoles(leads ?? []),
    dossiersOpen: (dossiers ?? []).filter((d) => d.status !== "done").length,
    dossiersByKind: groupBy(
      dossiers ?? [],
      (d) => d.kind,
      (k) => KIND_FR[k as DossierKind] ?? k,
      () => 0
    ),
    payDue: dueRuns.reduce((s, r) => s + Number(r.amount) + Number(r.bonus ?? 0), 0),
    payDueCount: dueRuns.length,
    months,
    topCompanies: groupBy(
      dealRows.filter((d) => d.companies?.name),
      (d) => d.companies?.name ?? "—",
      (k) => k,
      (d) => Number(d.amount)
    )
      .sort((a, b) => b.value - a.value)
      .slice(0, 5),
    recentDeals: dealRows.slice(0, 5).map((d) => ({
      key: d.id,
      title: d.title,
      company: d.companies?.name ?? "Kalao",
      amount: formatMoney(d.amount),
      probability: Number(d.probability ?? 0),
      stage: DEAL_STAGE_FR[d.stage] ?? d.stage,
    })),
    recentLeads: (leads ?? []).slice(0, 5).map((l) => ({
      key: l.id,
      name: l.contacts
        ? `${l.contacts.first_name} ${l.contacts.last_name}`.trim()
        : l.title,
      company: l.companies?.name ?? l.title,
      phone: l.contacts?.phone ?? "—",
      status: LEAD_STATUS_FR[l.status] ?? l.status,
      tone: LEAD_TONE[l.status] ?? "secondary",
    })),
    recentDossiers: (dossiers ?? []).slice(0, 5).map((d) => ({
      key: d.id,
      title: d.title,
      company: d.companies?.name ?? "Groupe Kalao",
      kind: d.kind,
      kindLabel: KIND_FR[d.kind] ?? d.kind,
      status: d.status,
      endLabel: d.end_at ? formatDate(d.end_at) : "—",
      members:
        (d.dossier_members ?? [])
          .map((m) => m.employees?.full_name)
          .filter(Boolean)
          .join(", ") || "Équipe Kalao",
    })),
    deadlines: buildDeadlines(activities ?? [], dossiers ?? [], invoices),
    activitiesOpen: openActivities.length,
  };
}

/** Même contrat que useLiveRows : live=false garde la maquette du template. */
export function useKalaoKpis() {
  const [kpis, setKpis] = useState<KalaoKpis | null>(null);
  const [live, setLive] = useState(false);

  const reload = useCallback(async () => {
    try {
      const data = await fetchKalaoKpis();
      if (data) {
        setKpis(data);
        setLive(true);
      }
    } catch (err) {
      console.error("[crm] kpis", err);
      setLive(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { kpis, live, reload };
}

export interface CalendarEvent {
  title: string;
  start: string;
  className: string;
}

const CALENDAR_TONE: Record<string, string> = {
  Visas: "bg-warning",
  Baux: "bg-info",
  Facture: "bg-danger",
  Activité: "bg-primary",
  Chantiers: "bg-success",
  Plantations: "bg-success",
  Voyages: "bg-info",
  Événements: "bg-purple",
};

/** Échéances Kalao (activités, dossiers, factures) sur une fenêtre glissante. */
export async function fetchKalaoDeadlines(): Promise<DeadlineRow[] | null> {
  const [activities, dossiers, invoices] = await Promise.all([
    fetchActivities(),
    fetchDossiers(),
    fetchInvoices(),
  ]);
  if (!activities && !dossiers && !invoices) return null;
  return buildDeadlines(activities ?? [], dossiers ?? [], invoices ?? []);
}

export function toCalendarEvents(rows: DeadlineRow[]): CalendarEvent[] {
  return rows.map((row) => ({
    title: `${row.origin} — ${row.title}`,
    start: row.date.slice(0, 10),
    className: CALENDAR_TONE[row.origin] ?? "bg-primary",
  }));
}

/** Alimente FullCalendar et la colonne « Upcoming Event » sans toucher au HTML. */
export function useKalaoCalendar() {
  const [deadlines, setDeadlines] = useState<DeadlineRow[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await fetchKalaoDeadlines();
        if (rows) {
          setDeadlines(rows);
          setLive(true);
        }
      } catch (err) {
        console.error("[crm] deadlines", err);
      }
    })();
  }, []);

  return { deadlines, events: toCalendarEvents(deadlines), live };
}

export { KIND_FR, formatMoney };
