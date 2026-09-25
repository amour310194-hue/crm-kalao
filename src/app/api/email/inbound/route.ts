import { NextRequest } from "next/server";
import { extractAddresses, inboundEmailId } from "@/lib/inbound-mail";
import { inboundEndpoint } from "@/lib/org";
import { ingestReceivedEmail, storeInboundEmail } from "@/lib/store-inbound";
import {
  WebhookAuthError,
  verifySharedInboundSecret,
  verifySvixSignature,
} from "@/lib/svix-verify";

function inboundStatus(reason: string, stored: boolean) {
  if (reason === "inbound_store_missing") return 503;
  if (stored || reason === "duplicate") return 200;
  return 500;
}

function header(request: NextRequest, name: string) {
  return request.headers.get(name) ?? request.headers.get(name.toLowerCase()) ?? "";
}

export async function GET() {
  return Response.json({
    ok: true,
    endpoint: inboundEndpoint(),
    accepts: ["email.received", "n0c_forward"],
  });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
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
    payload = JSON.parse(rawBody || "{}") as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }

  try {
    const svixId = header(request, "svix-id");
    const svixTimestamp = header(request, "svix-timestamp");
    const svixSignature = header(request, "svix-signature");
    if (svixId || svixTimestamp || svixSignature || payload.type === "email.received") {
      verifySvixSignature({
        rawBody,
        svixId,
        svixTimestamp,
        svixSignature,
        secret: process.env.RESEND_WEBHOOK_SECRET || "",
      });
    } else if (payload.type === "n0c_forward") {
      verifySharedInboundSecret(
        header(request, "x-kalao-inbound-secret"),
        process.env.INBOUND_FORWARD_SECRET || process.env.INBOUND_INGEST_SECRET
      );
    } else {
      throw new WebhookAuthError("unauthorized");
    }
  } catch (err) {
    const reason = err instanceof WebhookAuthError ? err.message : "unauthorized";
    return Response.json({ ok: false, reason }, { status: 401 });
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
