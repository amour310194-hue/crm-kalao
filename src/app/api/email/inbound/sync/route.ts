import { NextRequest } from "next/server";
import { listReceivedEmailIds } from "@/lib/inbound-mail";
import { ingestReceivedEmail } from "@/lib/store-inbound";
import { requireUser } from "@/lib/require-user";

async function inboundSyncAllowed(request: NextRequest) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  const token = new URL(request.url).searchParams.get("secret");
  if (secret && (auth === `Bearer ${secret}` || token === secret)) return true;
  try {
    return Boolean(await requireUser(request));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await inboundSyncAllowed(request))) {
    return Response.json({ ok: false, reason: "auth" }, { status: 401 });
  }
  const ids = await listReceivedEmailIds(50);
  const results = [];
  for (const id of ids) {
    results.push({ id, ...(await ingestReceivedEmail(id)) });
  }
  return Response.json({ ok: true, count: results.length, results });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
