import { describe, expect, it } from "vitest";
import { isLoginToken, issueLoginToken } from "@/lib/login-token";

describe("issueLoginToken", () => {
  it("émet un jeton unique au format CXN-AAAAMMJJ-XXXXXXXX", () => {
    const a = issueLoginToken(new Date("2026-10-06T20:00:00Z"));
    const b = issueLoginToken(new Date("2026-10-06T20:00:00Z"));
    expect(isLoginToken(a)).toBe(true);
    expect(a.startsWith("CXN-20261006-")).toBe(true);
    expect(a).not.toBe(b);
  });
});
