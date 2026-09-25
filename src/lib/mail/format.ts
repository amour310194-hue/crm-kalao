/** Formats d'affichage de la messagerie (fuseau Africa/Douala, français). */

export const MAIL_TZ = "Africa/Douala";

function parts(date: Date) {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: MAIL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) map[p.type] = p.value;
  return { y: Number(map.year), m: Number(map.month), d: Number(map.day) };
}

function sameDay(a: Date, b: Date) {
  const x = parts(a);
  const y = parts(b);
  return x.y === y.y && x.m === y.m && x.d === y.d;
}

/** Colonne date de la liste : « 14:05 » aujourd'hui, « 12 sept. » cette année, « 12/09/2025 » sinon. */
export function formatListDate(value: string | null | undefined, now = new Date()): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (sameDay(date, now)) {
    return date.toLocaleTimeString("fr-FR", { timeZone: MAIL_TZ, hour: "2-digit", minute: "2-digit" });
  }
  if (parts(date).y === parts(now).y) {
    return date.toLocaleDateString("fr-FR", { timeZone: MAIL_TZ, day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("fr-FR", { timeZone: MAIL_TZ, day: "2-digit", month: "2-digit", year: "numeric" });
}

/** En-tête d'un message : « ven. 25 sept. 2026, 14:05 (il y a 3 heures) ». */
export function formatFullDate(value: string | null | undefined, now = new Date()): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const main = date.toLocaleString("fr-FR", {
    timeZone: MAIL_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const rel = formatRelative(date, now);
  return rel ? `${main} (${rel})` : main;
}

export function formatRelative(date: Date, now = new Date()): string {
  const diff = Math.round((now.getTime() - date.getTime()) / 1000);
  if (diff < 0) {
    const ahead = -diff;
    if (ahead < 3600) return `dans ${Math.max(1, Math.round(ahead / 60))} min`;
    if (ahead < 86400) return `dans ${Math.round(ahead / 3600)} h`;
    return `dans ${Math.round(ahead / 86400)} j`;
  }
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.round(diff / 60)} min`;
  if (diff < 86400) {
    const h = Math.round(diff / 3600);
    return `il y a ${h} heure${h > 1 ? "s" : ""}`;
  }
  const days = Math.round(diff / 86400);
  if (days < 30) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  return "";
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 o";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

const AVATAR_COLORS = [
  "#164B5A", "#E8A317", "#1e88e5", "#43a047", "#8e24aa",
  "#f4511e", "#00897b", "#6d4c41", "#3949ab", "#c0ca33",
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function initials(nameOrEmail: string): string {
  const clean = nameOrEmail.replace(/<.*>/, "").trim();
  const base = clean.includes("@") ? clean.split("@")[0].replace(/[._-]+/g, " ") : clean;
  const words = base.split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** Nom court d'un participant : prénom si nom complet, partie locale si adresse. */
export function shortName(value: string): string {
  const v = value.trim();
  if (v.includes("@") && !v.includes(" ")) return v.split("@")[0];
  return v.split(/\s+/)[0] || v;
}

/**
 * Colonne expéditeurs de la liste façon Gmail : « Edith, moi (3) ».
 * `participants` vient de mail_threads (ordre chronologique, « __me__ » = message sortant).
 */
export function formatParticipants(participants: string[], count: number, meLabel = "moi"): string {
  const seen: string[] = [];
  for (const p of participants) {
    const label = p === "__me__" ? meLabel : p;
    if (!seen.includes(label)) seen.push(label);
  }
  let text: string;
  if (seen.length === 1) text = seen[0] === meLabel ? meLabel : seen[0];
  else if (seen.length <= 3) text = seen.map((p) => (p === meLabel ? p : shortName(p))).join(", ");
  else {
    const first = seen[0] === meLabel ? meLabel : shortName(seen[0]);
    const lastTwo = seen.slice(-2).map((p) => (p === meLabel ? p : shortName(p)));
    text = `${first} … ${lastTwo.join(", ")}`;
  }
  return count > 1 ? `${text} (${count})` : text;
}

const EMAIL_RE = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** « Nom <a@b.c> » → { name, email }. */
export function parseAddress(value: string): { name: string; email: string } {
  const v = value.trim();
  const match = v.match(/^(.*)<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^"|"$/g, "").trim(), email: match[2].trim().toLowerCase() };
  }
  return { name: "", email: v.toLowerCase() };
}

/** Découpe un champ collé « a@b.c; Nom <d@e.f>, g@h.i » en adresses. */
export function splitRecipients(value: string): string[] {
  return value
    .split(/[,;\n]+/)
    .map((part) => parseAddress(part).email)
    .filter(Boolean);
}

export function uniqueEmails(values: string[]): string[] {
  const out: string[] = [];
  for (const v of values) {
    const email = parseAddress(v).email;
    if (email && !out.includes(email)) out.push(email);
  }
  return out;
}

export const DELIVERY_LABEL: Record<string, string> = {
  queued: "En file d'envoi",
  scheduled: "Programmé",
  sent: "Envoyé",
  delivered: "Délivré",
  opened: "Délivré",
  delayed: "Retardé",
  bounced: "Rejeté par le destinataire",
  complained: "Signalé comme spam",
  failed: "Échec de l'envoi",
  cancelled: "Envoi annulé",
  suppressed: "Adresse bloquée (rejets précédents)",
};

export function deliveryTone(status: string | null | undefined): "success" | "warning" | "danger" | "secondary" {
  if (status === "delivered" || status === "opened") return "success";
  if (status === "bounced" || status === "complained" || status === "failed" || status === "suppressed") return "danger";
  if (status === "delayed" || status === "scheduled" || status === "queued") return "warning";
  return "secondary";
}
