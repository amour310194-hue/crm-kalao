// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { sanitizeMailHtml } from "@/lib/mail/sanitize";

describe("nettoyage du HTML reçu", () => {
  it("retire scripts, gestionnaires d'événements, formulaires et cadres", () => {
    const { html } = sanitizeMailHtml(
      '<p onclick="steal()">Bonjour</p><script>alert(1)</script><img src=x onerror="steal()"><form action="https://evil"><input name="pwd"></form><iframe src="https://evil"></iframe><a href="javascript:alert(1)">clic</a>',
      { showImages: true }
    );
    expect(html).not.toMatch(/script|onclick|onerror|<form|<input|<iframe|javascript:/i);
    expect(html).toContain("Bonjour");
  });

  it("bloque les images distantes par défaut et les compte", () => {
    const res = sanitizeMailHtml('<img src="https://tracker.example/p.gif"><div style="background:url(https://t.ex/x)">a</div>', {
      showImages: false,
    });
    expect(res.blockedImages).toBe(2);
    expect(res.html).not.toMatch(/\ssrc="https:\/\/tracker/);
    expect(res.html).not.toContain("url(");
  });

  it("ouvre les liens dans un nouvel onglet sans référent", () => {
    const { html } = sanitizeMailHtml('<a href="https://groupe-kalao.com">site</a>', { showImages: false });
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("remplace les images intégrées par leur URL signée", () => {
    const id = "11111111-2222-3333-4444-555555555555";
    const { html, blockedImages } = sanitizeMailHtml(`<img src="/api/mail/attachments?id=${id}">`, {
      showImages: false,
      inlineUrls: { [id]: "https://signed.example/img" },
    });
    expect(html).toContain("https://signed.example/img");
    expect(blockedImages).toBe(0);
  });
});
