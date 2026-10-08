import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { KALAO_ACCENT, KALAO_BRAND, KALAO_CONTRAST_PAIRS, contrastRatio } from "@/lib/kalao-tokens";

describe("contraste du thème Kalao", () => {
  it("reste au moins AA pour chaque paire", () => {
    for (const pair of KALAO_CONTRAST_PAIRS) {
      expect(contrastRatio(pair.fg, pair.bg), pair.name).toBeGreaterThanOrEqual(pair.min);
    }
  });

  it("écrit les mêmes couleurs dans la feuille activée par le drapeau", () => {
    const css = readFileSync("src/style/kalao-theme.css", "utf8");
    expect(css).toContain('[data-theme-kalao]');
    expect(css).not.toContain("!important");
    expect(css).toContain(KALAO_BRAND);
    expect(css).toContain(KALAO_ACCENT);
    for (const pair of KALAO_CONTRAST_PAIRS) {
      expect(css, pair.name).toContain(pair.fg);
      expect(css, pair.name).toContain(pair.bg);
    }
  });
});
