import { NextResponse } from "next/server";
import { auditMutation } from "@/lib/backend/audit";
import { convertQuoteToInvoice, QuoteConversionError, resolveResource } from "@/lib/backend/store";
import { toInvoiceRows } from "@/lib/backend/views";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resource: string; id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  const resource = resolveResource(raw);
  if (resource !== "quotes") {
    return NextResponse.json({ error: "Conversion disponible uniquement pour les devis." }, { status: 404 });
  }

  try {
    const result = convertQuoteToInvoice(id);
    if (result.created && result.invoice) {
      await auditMutation(request, "create", "invoices", result.invoice, result.invoice.id);
    }
    if (result.quote) {
      await auditMutation(request, "update", "quotes", result.quote, id);
    }
    return NextResponse.json(
      {
        resource: "invoices",
        created: result.created,
        data: toInvoiceRows([result.invoice])[0],
        quote: result.quote,
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    if (error instanceof QuoteConversionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Conversion impossible";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
