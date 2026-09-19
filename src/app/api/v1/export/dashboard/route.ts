import { NextResponse } from "next/server";
import { getDashboardExportCsv, getDashboardExportLines } from "@/lib/backend/kpis";
import { buildSimplePdf } from "@/lib/backend/pdf";
import { parseIsoRange } from "@/lib/backend/period";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const range = parseIsoRange(url.searchParams.get("from"), url.searchParams.get("to"));
  const format = (url.searchParams.get("format") ?? "pdf").toLowerCase();
  const stampDate = range?.from ?? new Date();
  const stamp = `${stampDate.getFullYear()}-${String(stampDate.getMonth() + 1).padStart(2, "0")}-${String(stampDate.getDate()).padStart(2, "0")}`;

  if (format === "csv" || format === "excel" || format === "xls") {
    const csv = `\ufeff${getDashboardExportCsv(range)}`;
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tableau-de-bord-${stamp}.csv"`,
      },
    });
  }

  const pdf = buildSimplePdf("Tableau de bord — Groupe Kalao", getDashboardExportLines(range));
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="tableau-de-bord-${stamp}.pdf"`,
    },
  });
}
