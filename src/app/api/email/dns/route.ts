import { diagnoseMailDns } from "@/lib/mail-deliverability";

export const runtime = "nodejs";

export async function GET() {
  const report = await diagnoseMailDns();
  return Response.json({ ok: report.mxOk && report.spfOk, ...report });
}
