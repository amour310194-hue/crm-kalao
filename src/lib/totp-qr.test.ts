import { describe, expect, it } from "vitest";
import { totpQrSrc } from "@/lib/totp-qr";

describe("totpQrSrc", () => {
  it("n’affiche pas le préfixe data: comme texte", () => {
    const src = totpQrSrc("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg'></svg>");
    expect(src.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true);
    expect(decodeURIComponent(src.split(",")[1] ?? "")).toContain("<svg");
  });

  it("encode un SVG brut", () => {
    expect(totpQrSrc("<svg></svg>").startsWith("data:image/svg+xml")).toBe(true);
  });
});
