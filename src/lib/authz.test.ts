import { describe, expect, it } from "vitest";
import { isPublicPath } from "@/lib/authz";

describe("isPublicPath", () => {
  it("laisse passer login et reset", () => {
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/reset-password")).toBe(true);
    expect(isPublicPath("/forgot-password")).toBe(true);
    expect(isPublicPath("/mfa-setup")).toBe(true);
  });

  it("protège le CRM", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/crm/contact-grid")).toBe(false);
    expect(isPublicPath("/docs/invoice/x")).toBe(false);
  });
});
