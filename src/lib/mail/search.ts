/**
 * Recherche façon Gmail : texte libre + opérateurs.
 *   de:/from:  à:/to:  objet:/subject:  has:attachment / a:pj
 *   is:unread|read|starred|important  (est:nonlu|lu|suivi)
 *   after:/apres:  before:/avant:  (AAAA-MM-JJ, AAAA/MM/JJ ou JJ/MM/AAAA)
 *   newer_than:7d  older_than:2m  label:nom  in:sent|drafts|spam|trash|anywhere
 * Les valeurs avec espaces se mettent entre guillemets : de:"Edith Nlend".
 */

export type ParsedSearch = {
  text: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  unread?: boolean;
  starred?: boolean;
  important?: boolean;
  after?: string;
  before?: string;
  label?: string;
  inFolder?: string;
};

const KEY_ALIASES: Record<string, string> = {
  from: "from",
  de: "from",
  to: "to",
  a: "to",
  "à": "to",
  subject: "subject",
  objet: "subject",
  has: "has",
  is: "is",
  est: "is",
  after: "after",
  apres: "after",
  "après": "after",
  before: "before",
  avant: "before",
  newer_than: "newer",
  older_than: "older",
  label: "label",
  libelle: "label",
  "libellé": "label",
  in: "in",
  dans: "in",
};

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  const re = /(\S+?:"[^"]*"|"[^"]*"|\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input))) tokens.push(match[1]);
  return tokens;
}

function unquote(value: string): string {
  return value.replace(/^"(.*)"$/, "$1").trim();
}

/** Date au format ISO (début de journée UTC) ou undefined. */
export function parseSearchDate(value: string): string | undefined {
  const v = value.trim();
  let y: number, m: number, d: number;
  let match = v.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (match) {
    [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else {
    match = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (!match) return undefined;
    [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) return undefined;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1) return undefined;
  return date.toISOString();
}

/** « 7d », « 2w », « 3m », « 1y » → date ISO relative à now. */
export function parseRelative(value: string, now = Date.now()): string | undefined {
  const match = value.trim().match(/^(\d+)([dwmy]|j|s|a)$/i);
  if (!match) return undefined;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  const date = new Date(now);
  if (unit === "d" || unit === "j") date.setUTCDate(date.getUTCDate() - n);
  else if (unit === "w" || unit === "s") date.setUTCDate(date.getUTCDate() - 7 * n);
  else if (unit === "m") date.setUTCMonth(date.getUTCMonth() - n);
  else date.setUTCFullYear(date.getUTCFullYear() - n);
  return date.toISOString();
}

export function parseSearch(input: string, now = Date.now()): ParsedSearch {
  const out: ParsedSearch = { text: "" };
  const free: string[] = [];
  for (const token of tokenize(input.trim())) {
    const colon = token.indexOf(":");
    const rawKey = colon > 0 ? token.slice(0, colon).toLowerCase() : "";
    const key = KEY_ALIASES[rawKey];
    const value = colon > 0 ? unquote(token.slice(colon + 1)) : "";
    if (!key || !value) {
      free.push(unquote(token));
      continue;
    }
    const lower = value.toLowerCase();
    switch (key) {
      case "from":
        out.from = value;
        break;
      case "to":
        out.to = value;
        break;
      case "subject":
        out.subject = value;
        break;
      case "has":
        if (["attachment", "pj", "piece", "pièce", "piecejointe"].includes(lower)) out.hasAttachment = true;
        else free.push(token);
        break;
      case "is":
        if (["unread", "nonlu", "non-lu"].includes(lower)) out.unread = true;
        else if (["read", "lu"].includes(lower)) out.unread = false;
        else if (["starred", "suivi", "etoile", "étoilé"].includes(lower)) out.starred = true;
        else if (["important"].includes(lower)) out.important = true;
        else free.push(token);
        break;
      case "after":
        out.after = parseSearchDate(value) ?? out.after;
        break;
      case "before":
        out.before = parseSearchDate(value) ?? out.before;
        break;
      case "newer":
        out.after = parseRelative(value, now) ?? out.after;
        break;
      case "older":
        out.before = parseRelative(value, now) ?? out.before;
        break;
      case "label":
        out.label = value;
        break;
      case "in":
        out.inFolder = lower;
        break;
    }
  }
  out.text = free.join(" ").trim();
  return out;
}

/** Vue de dossier à utiliser pour « in:xxx ». */
export function folderForIn(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    inbox: "inbox",
    reception: "inbox",
    sent: "sent",
    envoyes: "sent",
    "envoyés": "sent",
    drafts: "drafts",
    brouillons: "drafts",
    spam: "spam",
    trash: "deleted",
    corbeille: "deleted",
    archive: "archive",
    anywhere: "all",
    partout: "all",
    scheduled: "scheduled",
    snoozed: "snoozed",
  };
  return map[value];
}

export function isEmptySearch(parsed: ParsedSearch): boolean {
  return (
    !parsed.text &&
    !parsed.from &&
    !parsed.to &&
    !parsed.subject &&
    parsed.hasAttachment === undefined &&
    parsed.unread === undefined &&
    !parsed.starred &&
    !parsed.important &&
    !parsed.after &&
    !parsed.before &&
    !parsed.label &&
    !parsed.inFolder
  );
}

/** Reconstruit une requête texte à partir du panneau de recherche avancée. */
export function buildSearchQuery(fields: {
  from?: string;
  to?: string;
  subject?: string;
  words?: string;
  hasAttachment?: boolean;
  after?: string;
  before?: string;
}): string {
  const q = (value: string) => (/\s/.test(value) ? `"${value}"` : value);
  const parts: string[] = [];
  if (fields.from?.trim()) parts.push(`de:${q(fields.from.trim())}`);
  if (fields.to?.trim()) parts.push(`à:${q(fields.to.trim())}`);
  if (fields.subject?.trim()) parts.push(`objet:${q(fields.subject.trim())}`);
  if (fields.hasAttachment) parts.push("has:attachment");
  if (fields.after) parts.push(`après:${fields.after}`);
  if (fields.before) parts.push(`avant:${fields.before}`);
  if (fields.words?.trim()) parts.push(fields.words.trim());
  return parts.join(" ");
}
