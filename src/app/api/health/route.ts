import { NextResponse } from "next/server";
import { getStore } from "@/lib/backend/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    ok: true,
    name: "CRM Kalao API",
    locale: "fr",
    counts: {
      companies: store.companies.length,
      contacts: store.contacts.length,
      leads: store.leads.length,
      deals: store.deals.length,
      catalog: store.catalog.length,
      quotes: store.quotes.length,
      invoices: store.invoices.length,
      activities: store.activities.length,
    },
  });
}
