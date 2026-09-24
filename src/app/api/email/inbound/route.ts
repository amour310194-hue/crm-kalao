import { NextRequest } from "next/server";
import { extractAddresses, inboundEmailId } from "@/lib/inbound-mail";
import { inboundEndpoint } from "@/lib/org";
import { ingestReceivedEmail, storeInboundEmail } from "@/lib/store-inbound";

function inboundStatus(reason: string, stored: boolean) {
  if (reason === "inbound_store_missing") return 503;
  if (stored || reason === "duplicate") return 200;
  return 500;
}

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
    id?: string;
    data?: {
      email_id?: string;
      id?: string;
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
  const emailId = inboundEmailId(payload);
  const fallback = {
    from: String(data.from ?? ""),
    to: data.to,
    receivedFor: data.received_for,
    subject: String(data.subject ?? "Sans objet"),
    body: String(data.text || data.html || ""),
  };

  if (payload.type === "email.received" || emailId) {
    const result = emailId
      ? await ingestReceivedEmail(emailId, fallback)
      : await storeInboundEmail({
          from: fallback.from,
          to: extractAddresses(fallback.to),
          receivedFor: extractAddresses(fallback.receivedFor),
          subject: fallback.subject,
          body: fallback.body || "(contenu à récupérer)",
        });
    return Response.json(
      { ok: result.stored || result.reason === "duplicate", ...result },
      { status: inboundStatus(result.reason, result.stored) }
    );
  }

  const result = await storeInboundEmail({
    from: fallback.from,
    to: extractAddresses(fallback.to),
    receivedFor: extractAddresses(fallback.receivedFor),
    subject: fallback.subject,
    body: fallback.body,
  });
  return Response.json(
    { ok: result.stored, ...result },
    { status: inboundStatus(result.reason, result.stored) }
  );
}
