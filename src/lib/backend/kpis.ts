import { formatPeriodLabel, inRange, overlapsRange, type DateRange } from "./period";
import { getStore } from "./store";

export type MetierKpiItem = {
  id: string;
  label: string;
  count: number;
};

export type DashboardKpiData = {
  deals: {
    openCount: number;
    wonCount: number;
    lostCount: number;
    pipelineAmount: number;
    wonAmount: number;
  };
  invoices: {
    count: number;
    unpaidCount: number;
    totalAmount: number;
    paidAmount: number;
    outstanding: number;
  };
  payments: {
    count: number;
    totalAmount: number;
  };
  metiers: {
    total: number;
    items: MetierKpiItem[];
  };
};

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function getDashboardKpis(range?: DateRange | null): DashboardKpiData {
  const store = getStore();
  const deals = store.deals.filter((row) => inRange(row.expectedCloseDate, range));
  const invoices = store.invoices.filter((row) => inRange(row.dueDate, range));
  const payments = store.payments.filter((row) => inRange(row.paidAt, range, false));
  const openDeals = deals.filter((row) => row.status === "Open");
  const wonDeals = deals.filter((row) => row.status === "Won");
  const lostDeals = deals.filter((row) => row.status === "Lost");
  const outstandingInvoices = invoices.filter((row) => row.paidAmount < row.amount);
  const metierItems: MetierKpiItem[] = [
    { id: "travel", label: "Voyages", count: store.travel.filter((row) => inRange(row.departureDate, range)).length },
    { id: "immigration", label: "Immigration", count: store.immigration.filter((row) => inRange(row.dueDate, range)).length },
    { id: "events", label: "Événements", count: store.events.filter((row) => inRange(row.eventDate, range)).length },
    { id: "plantations", label: "Agriculture", count: store.plantations.filter((row) => inRange(row.season, range)).length },
    { id: "sites", label: "BTP", count: store.sites.filter((row) => overlapsRange(row.startDate, row.endDate, range)).length },
    { id: "properties", label: "Immobilier", count: store.properties.length },
    { id: "payroll", label: "Paie", count: store.payroll.filter((row) => inRange(row.period, range)).length },
  ];

  return {
    deals: {
      openCount: openDeals.length,
      wonCount: wonDeals.length,
      lostCount: lostDeals.length,
      pipelineAmount: sum(openDeals.map((row) => row.amount)),
      wonAmount: sum(wonDeals.map((row) => row.amount)),
    },
    invoices: {
      count: invoices.length,
      unpaidCount: outstandingInvoices.length,
      totalAmount: sum(invoices.map((row) => row.amount)),
      paidAmount: sum(invoices.map((row) => row.paidAmount)),
      outstanding: sum(invoices.map((row) => Math.max(0, row.amount - row.paidAmount))),
    },
    payments: {
      count: payments.length,
      totalAmount: sum(payments.map((row) => row.amount)),
    },
    metiers: {
      total: sum(metierItems.map((item) => item.count)),
      items: metierItems,
    },
  };
}

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export type DashboardExportRow = {
  indicateur: string;
  valeur: string;
};

export function getDashboardExportRows(range?: DateRange | null): DashboardExportRow[] {
  const kpis = getDashboardKpis(range);
  const period = range ? formatPeriodLabel(range) : "Toutes périodes";
  return [
    { indicateur: "Période", valeur: period },
    { indicateur: "Affaires ouvertes", valeur: String(kpis.deals.openCount) },
    { indicateur: "Affaires gagnées", valeur: String(kpis.deals.wonCount) },
    { indicateur: "Affaires perdues", valeur: String(kpis.deals.lostCount) },
    { indicateur: "Pipeline", valeur: money.format(kpis.deals.pipelineAmount) },
    { indicateur: "Montant gagné", valeur: money.format(kpis.deals.wonAmount) },
    { indicateur: "Factures", valeur: String(kpis.invoices.count) },
    { indicateur: "Factures impayées", valeur: String(kpis.invoices.unpaidCount) },
    { indicateur: "Montant facturé", valeur: money.format(kpis.invoices.totalAmount) },
    { indicateur: "Montant encaissé factures", valeur: money.format(kpis.invoices.paidAmount) },
    { indicateur: "Reste dû", valeur: money.format(kpis.invoices.outstanding) },
    { indicateur: "Paiements", valeur: String(kpis.payments.count) },
    { indicateur: "Encaissé", valeur: money.format(kpis.payments.totalAmount) },
    { indicateur: "Dossiers métiers", valeur: String(kpis.metiers.total) },
    ...kpis.metiers.items.map((item) => ({
      indicateur: `Dossiers ${item.label}`,
      valeur: String(item.count),
    })),
  ];
}

export function getDashboardExportCsv(range?: DateRange | null) {
  const rows = getDashboardExportRows(range);
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return ["Indicateur;Valeur", ...rows.map((row) => `${escape(row.indicateur)};${escape(row.valeur)}`)].join("\n");
}

export function getDashboardExportLines(range?: DateRange | null) {
  return getDashboardExportRows(range).map((row) => `${row.indicateur} : ${row.valeur}`);
}
