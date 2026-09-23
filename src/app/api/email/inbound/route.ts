import { NextRequest } from "next/server";
import { extractAddresses } from "@/lib/inbound-mail";
import { inboundEndpoint } from "@/lib/org";
import { ingestReceivedEmail, storeInboundEmail } from "@/lib/store-inbound";

export async function GET() {
  return Response.json({
    ok: true,
    endpoint: inboundEndpoint(),
    accepts: ["email.received", "n0c_forward"],
  });
}

export async function POST(request: NextRequest) {
  let payload: {
    type?: string;
    email_id?: string;
    data?: {
      email_id?: string;
      from?: string;
      to?: string[] | string;
      received_for?: string[];
      subject?: string;
      text?: string;
      html?: string;
    };
  };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }

  const data = payload.data ?? {};
  const emailId = data.email_id || payload.email_id;
  if ((payload.type === "email.received" || emailId) && emailId) {
    const result = await ingestReceivedEmail(emailId);
    const status = result.reason === "inbound_store_missing" ? 503 : 200;
    return Response.json({ ok: result.stored || result.reason === "duplicate", ...result }, { status });
  }

  const result = await storeInboundEmail({
    from: String(data.from ?? ""),
    to: extractAddresses(data.to),
    receivedFor: extractAddresses(data.received_for),
    subject: String(data.subject ?? "Sans objet"),
    body: String(data.text || data.html || ""),
  });
  const status = result.reason === "inbound_store_missing" ? 503 : 200;
  return Response.json({ ok: result.stored, ...result }, { status });
}
