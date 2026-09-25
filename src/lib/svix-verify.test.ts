import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import {
  SVIX_MAX_SKEW_SECONDS,
  WebhookAuthError,
  verifySharedInboundSecret,
  verifySvixSignature,
} from "@/lib/svix-verify";

const SECRET = "whsec_" + Buffer.from("kalao-test-secret-bytes!!").toString("base64");
const secretBytes = Buffer.from("kalao-test-secret-bytes!!");

function sign(id: string, ts: string, body: string) {
  const digest = createHmac("sha256", secretBytes).update(`${id}.${ts}.${body}`).digest("base64");
  return `v1,${digest}`;
}

describe("verifySvixSignature", () => {
  it("accepte une signature valide récente", () => {
    const rawBody = JSON.stringify({ type: "email.received" });
    const svixId = "msg_1";
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    expect(() =>
      verifySvixSignature({
        rawBody,
        svixId,
        svixTimestamp,
        svixSignature: sign(svixId, svixTimestamp, rawBody),
        secret: SECRET,
      })
    ).not.toThrow();
  });

  it("refuse une mauvaise signature", () => {
    const rawBody = "{}";
    const svixId = "msg_1";
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    expect(() =>
      verifySvixSignature({
        rawBody,
        svixId,
        svixTimestamp,
        svixSignature: "v1,aaaa",
        secret: SECRET,
      })
    ).toThrow(WebhookAuthError);
  });

  it("refuse un horodatage de plus de 5 minutes", () => {
    const rawBody = "{}";
    const svixId = "msg_stale";
    const svixTimestamp = String(Math.floor(Date.now() / 1000) - SVIX_MAX_SKEW_SECONDS - 10);
    expect(() =>
      verifySvixSignature({
        rawBody,
        svixId,
        svixTimestamp,
        svixSignature: sign(svixId, svixTimestamp, rawBody),
        secret: SECRET,
      })
    ).toThrow(/stale_timestamp/);
  });
});

describe("verifySharedInboundSecret", () => {
  it("accepte le secret partagé n0c", () => {
    expect(() => verifySharedInboundSecret("s3cret", "s3cret")).not.toThrow();
  });
  it("refuse un secret absent ou faux", () => {
    expect(() => verifySharedInboundSecret("nope", "s3cret")).toThrow(WebhookAuthError);
    expect(() => verifySharedInboundSecret("s3cret", undefined)).toThrow(WebhookAuthError);
  });
});
