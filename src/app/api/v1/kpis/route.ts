import { NextResponse } from "next/server";
import { getDashboardKpis } from "@/lib/backend/kpis";
import type { DateRange } from "@/lib/backend/period";

export const dynamic = "force-dynamic";

function parseRange(request: Request): DateRange | null {
  const url = new URL(request.url);
  const fromRaw = url.searchParams.get("from");
  const toRaw = url.searchParams.get("to");
  if (!fromRaw || !toRaw) return null;
  const from = new Date(fromRaw);
  const to = new Date(toRaw);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
  return { from, to };
}

export async function GET(request: Request) {
  const range = parseRange(request);
  return NextResponse.json({
    resource: "kpis",
    range: range
      ? { from: range.from.toISOString(), to: range.to.toISOString() }
      : null,
    data: getDashboardKpis(range),
  });
}
