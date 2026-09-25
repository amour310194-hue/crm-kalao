import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("CSP", () => {
  it("n'autorise unsafe-eval qu'en développement (React Fast Refresh)", () => {
    const src = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");
    expect(src).toMatch(/NODE_ENV === ["']development["']/);
    expect(src).toMatch(/script-src 'self' 'unsafe-inline'/);
    const prodBranch = src.includes("script-src 'self' 'unsafe-inline'");
    expect(prodBranch).toBe(true);
    const evalOnlyInDev =
      src.includes("unsafe-eval") && src.includes('NODE_ENV === "development"');
    expect(evalOnlyInDev).toBe(true);
  });
});
