import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/email/inbound/route";

const SECRET_BYTES = Buffer.from("unit-test-secret-bytes!!");
const SECRET = "whsec_" + SECRET_BYTES.toString("base64");

describe("POST /api/email/inbound", () => {
  it("refuse un POST non signé", async () => {
    const request = new NextRequest("http://localhost/api/email/inbound", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "email.received",
        data: { from: "phish@example.com", to: ["contact@groupe-kalao.com"], subject: "x", text: "y" },
      }),
    });
    const res = await POST(request);
    expect(res.status).toBe(401);
  });

  it("refuse une signature Svix invalide", async () => {
    const prev = process.env.RESEND_WEBHOOK_SECRET;
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const request = new NextRequest("http://localhost/api/email/inbound", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "svix-id": "msg_bad",
        "svix-timestamp": String(Math.floor(Date.now() / 1000)),
        "svix-signature": "v1,not-a-signature",
      },
      body: JSON.stringify({ type: "email.received" }),
    });
    const res = await POST(request);
    process.env.RESEND_WEBHOOK_SECRET = prev;
    expect(res.status).toBe(401);
  });

  it("accepte une signature Svix valide (ne renvoie pas 401)", async () => {
    const prev = process.env.RESEND_WEBHOOK_SECRET;
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const rawBody = JSON.stringify({
      type: "email.received",
      data: { subject: "auth-only" },
    });
    const svixId = "msg_ok";
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const svixSignature =
      "v1," +
      createHmac("sha256", SECRET_BYTES).update(`${svixId}.${svixTimestamp}.${rawBody}`).digest("base64");
    const request = new NextRequest("http://localhost/api/email/inbound", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      },
      body: rawBody,
    });
    const res = await POST(request);
    process.env.RESEND_WEBHOOK_SECRET = prev;
    expect(res.status).not.toBe(401);
  });
});
