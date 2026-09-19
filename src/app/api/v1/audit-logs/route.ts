import { NextResponse } from "next/server";
import { listAuditLogs, toAuditUiRow } from "@/lib/backend/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { source, records } = await listAuditLogs();
    return NextResponse.json({
      resource: "audit-logs",
      source,
      data: records.map(toAuditUiRow),
      records,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Journal indisponible";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
