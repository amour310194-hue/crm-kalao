"use client";

import DOMPurify from "dompurify";

export type SanitizedMail = { html: string; blockedImages: number };

const REMOTE = /^(https?:)?\/\//i;

/**
 * Nettoie le HTML d'un mail avant affichage (dans un cadre isolé, sans scripts).
 * Les images distantes sont bloquées par défaut (pixels de suivi), comme Gmail/Outlook :
 * « Afficher les images » les rétablit.
 */
export function sanitizeMailHtml(
  html: string,
  options: { showImages: boolean; inlineUrls?: Record<string, string> }
): SanitizedMail {
  let blocked = 0;
  const purify = DOMPurify();
  purify.addHook("afterSanitizeAttributes", (node) => {
    const el = node as Element;
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") ?? "";
      const inline = src.match(/\/api\/mail\/attachments\?id=([0-9a-f-]{36})/i);
      if (inline && options.inlineUrls?.[inline[1]]) {
        el.setAttribute("src", options.inlineUrls[inline[1]]);
      } else if (REMOTE.test(src) && !options.showImages) {
        el.setAttribute("data-kalao-src", src);
        el.removeAttribute("src");
        el.removeAttribute("srcset");
        blocked += 1;
      }
    }
    const style = el.getAttribute("style");
    if (style && !options.showImages && /url\(/i.test(style)) {
      el.setAttribute("style", style.replace(/url\([^)]*\)/gi, "none"));
      blocked += 1;
    }
  });
  const clean = purify.sanitize(html, {
    WHOLE_DOCUMENT: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button", "textarea", "select", "meta", "link", "base"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "formaction"],
    ADD_ATTR: ["target"],
    ALLOW_DATA_ATTR: false,
  });
  return { html: String(clean), blockedImages: blocked };
}

/** Document complet injecté dans l'iframe (srcdoc). */
export function mailFrameDocument(bodyHtml: string, dark: boolean): string {
  const color = dark ? "#e8eaed" : "#202124";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"><style>
html,body{margin:0;padding:0;background:transparent;color:${color};font:14px/1.5 Arial,Helvetica,sans-serif;word-wrap:break-word;overflow-wrap:anywhere}
img{max-width:100%;height:auto}
table{max-width:100%}
blockquote{margin:0 0 0 .8ex;border-left:1px solid #ccc;padding-left:1ex}
a{color:${dark ? "#8ab4f8" : "#1a73e8"}}
pre{white-space:pre-wrap}
</style></head><body>${bodyHtml}</body></html>`;
}
