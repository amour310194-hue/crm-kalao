import { NextResponse } from "next/server";
import { getDashboardKpis } from "@/lib/backend/kpis";
import { parseIsoRange } from "@/lib/backend/period";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const range = parseIsoRange(url.searchParams.get("from"), url.searchParams.get("to"));
  return NextResponse.json({
    resource: "kpis",
    range: range
      ? { from: range.from.toISOString(), to: range.to.toISOString() }
      : null,
    data: getDashboardKpis(range),
  });
}
