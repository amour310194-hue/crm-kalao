import { inRange, overlapsRange, type DateRange } from "./period";
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
