/** HTML des mails : conversions texte/HTML, citations, sujets, mise en page sortante. Sans DOM. */

import { KALAO_CONTACT_EMAIL, KALAO_LOGO_URL } from "@/lib/org";
import { formatFullDate } from "@/lib/mail/format";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const URL_RE = /\bhttps?:\/\/[^\s<>"']+/g;

/** Texte brut → HTML (paragraphes, retours à la ligne, liens cliquables). */
export function textToHtml(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => {
      const escaped = escapeHtml(block).replace(URL_RE, (url) => `<a href="${url}">${url}</a>`);
      return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

/** HTML → texte lisible (partie text/plain des envois, extrait, recherche). */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(style|script|head|title)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, label: string) => {
        const text = label.replace(/<[^>]+>/g, "").trim();
        return text && text !== href ? `${text} (${href})` : href;
      })
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function makeSnippet(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/** Enlève les « Re: », « TR : », « Fwd: »… en tête (pour regrouper les fils). */
export function normalizeSubject(subject: string): string {
  let s = subject.trim();
  const re = /^((re|tr|fw|fwd|réf|ref|aw|wg)\s*(\[\d+\])?\s*:\s*)+/i;
  for (let i = 0; i < 5 && re.test(s); i += 1) s = s.replace(re, "").trim();
  return s.toLowerCase();
}

export function replySubject(subject: string): string {
  return /^re\s*:/i.test(subject.trim()) ? subject.trim() : `Re: ${subject.trim() || "(sans objet)"}`;
}

export function forwardSubject(subject: string): string {
  return /^(tr|fwd?)\s*:/i.test(subject.trim()) ? subject.trim() : `Tr: ${subject.trim() || "(sans objet)"}`;
}

export function makeMessageId(id: string, domain = "groupe-kalao.com"): string {
  return `<${id}@${domain}>`;
}

type QuoteSource = {
  from_name: string | null;
  from_email: string;
  to_emails: string[];
  to_email: string;
  cc_emails: string[];
  subject: string;
  created_at: string;
  html: string | null;
  body: string;
};

function sourceHtml(source: QuoteSource): string {
  return source.html?.trim() ? source.html : textToHtml(source.body || "");
}

function who(source: QuoteSource): string {
  return source.from_name ? `${source.from_name} &lt;${escapeHtml(source.from_email)}&gt;` : escapeHtml(source.from_email);
}

/** Citation d'une réponse (style Gmail). */
export function replyQuoteHtml(source: QuoteSource): string {
  const date = formatFullDate(source.created_at).replace(/\s*\(.*\)$/, "");
  return `<br><div class="kalao_quote"><div>Le ${escapeHtml(date)}, ${who(source)} a écrit :</div><blockquote style="margin:0 0 0 .8ex;border-left:1px solid #ccc;padding-left:1ex">${sourceHtml(source)}</blockquote></div>`;
}

/** En-tête « Message transféré » (style Gmail). */
export function forwardHtml(source: QuoteSource): string {
  const to = (source.to_emails.length ? source.to_emails : [source.to_email]).map(escapeHtml).join(", ");
  const cc = source.cc_emails.length ? `<br>Cc : ${source.cc_emails.map(escapeHtml).join(", ")}` : "";
  return `<br><div class="kalao_quote">---------- Message transféré ---------<br>De : ${who(source)}<br>Date : ${escapeHtml(formatFullDate(source.created_at).replace(/\s*\(.*\)$/, ""))}<br>Objet : ${escapeHtml(source.subject)}<br>À : ${to}${cc}<br><br>${sourceHtml(source)}</div>`;
}

export type TemplateVars = Record<string, string | null | undefined>;

/** Remplace {{variable}} ; les valeurs sont échappées ; variable inconnue → vide. */
export function fillTemplate(template: string, vars: TemplateVars, html = true): string {
  return template.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_, key: string) => {
    const value = vars[key] ?? vars[key.toLowerCase()] ?? "";
    return html ? escapeHtml(String(value)) : String(value);
  });
}

export const TEMPLATE_VARIABLES: { key: string; label: string }[] = [
  { key: "nom", label: "Nom du client" },
  { key: "prenom", label: "Prénom" },
  { key: "entreprise", label: "Entreprise" },
  { key: "email", label: "E-mail du client" },
  { key: "dossier", label: "Dossier en cours" },
  { key: "facture", label: "Dernière facture" },
  { key: "reste_a_payer", label: "Reste à payer" },
  { key: "echeance", label: "Prochaine échéance" },
  { key: "expediteur", label: "Votre nom" },
];

/**
 * Mise en page sortante.
 * - personal / contact : le message tel qu'écrit (comme Gmail), police lisible, pas de bandeau publicitaire.
 * - noreply : gabarit Kalao, mention claire « ne répondez pas » et adresse de contact.
 */
export function wrapOutgoingHtml(bodyHtml: string, kind: "personal" | "contact" | "noreply"): string {
  if (kind !== "noreply") {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;padding:0"><div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#202124">${bodyHtml}</div></body></html>`;
  }
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#efece4;font-family:Arial,Helvetica,sans-serif;color:#1a2a32">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;background:#efece4"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #d9d2c3;max-width:600px">
<tr><td style="background:#164B5A;padding:18px 24px"><img src="${KALAO_LOGO_URL}" alt="Kalao" width="180" height="36" style="display:block;height:36px;width:auto;border:0"></td></tr>
<tr><td style="height:4px;background:#E8A317;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:28px 28px 8px;font-size:15px;line-height:1.55">${bodyHtml}
<p style="margin:28px 0 0;font-size:12px;color:#5c6573">Ce message est envoyé automatiquement : merci de ne pas y répondre. Pour nous écrire : <a href="mailto:${KALAO_CONTACT_EMAIL}">${KALAO_CONTACT_EMAIL}</a>.</p>
</td></tr>
<tr><td style="background:#164B5A;padding:14px 24px;font-size:11px;line-height:1.45;color:#d7e4e8">Groupe Kalao · Bastos, Yaoundé, Cameroun<br>${KALAO_CONTACT_EMAIL} · +237 694 635 250</td></tr>
</table></td></tr></table></body></html>`;
}

/** Remplace les images « cid: » d'un mail reçu par l'URL de la pièce jointe stockée. */
export function replaceCidImages(html: string, map: Record<string, string>): string {
  return html.replace(/(["'(])cid:([^"')\s>]+)/gi, (full, prefix: string, cid: string) => {
    const key = cid.replace(/^<|>$/g, "").toLowerCase();
    return map[key] ? `${prefix}${map[key]}` : full;
  });
}

/** Nom de fichier sûr pour un chemin de stockage. */
export function safeFilename(name: string): string {
  const base = name.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._]+/, "");
  return (cleaned || "fichier").slice(-120);
}
