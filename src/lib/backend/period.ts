export type DateRange = {
  from: Date;
  to: Date;
};

export function parseCrmDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}$/.test(trimmed)) return null;

  const cleaned = trimmed.replace(",", "");
  const timestamp = Date.parse(cleaned);
  if (!Number.isNaN(timestamp)) {
    return new Date(timestamp);
  }

  return null;
}

export function inRange(value: string | undefined | null, range?: DateRange | null, includeIfMissing = true) {
  if (!range) return true;
  const date = parseCrmDate(value);
  if (!date) return includeIfMissing;
  const time = date.getTime();
  return time >= range.from.getTime() && time <= range.to.getTime();
}

export function overlapsRange(
  startValue: string | undefined | null,
  endValue: string | undefined | null,
  range?: DateRange | null,
) {
  if (!range) return true;
  const start = parseCrmDate(startValue);
  const end = parseCrmDate(endValue);
  if (!start && !end) return true;
  const startTime = (start ?? range.from).getTime();
  const endTime = (end ?? range.to).getTime();
  return startTime <= range.to.getTime() && endTime >= range.from.getTime();
}

export function thisMonthRange(now = new Date()): DateRange {
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

export function last30DaysRange(now = new Date()): DateRange {
  return {
    from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0),
    to: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
  };
}

export function parseIsoRange(fromRaw?: string | null, toRaw?: string | null): DateRange | null {
  if (!fromRaw || !toRaw) return null;
  const from = new Date(fromRaw);
  const to = new Date(toRaw);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
  return { from, to };
}

function parseIsoLocal(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return parseCrmDate(iso);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function toIsoDateString(value: unknown): string | null {
  if (value == null || String(value).trim() === "") return null;
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = parseCrmDate(raw);
  if (!parsed) return null;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value: unknown) {
  const iso = toIsoDateString(value);
  if (!iso) return value == null || String(value).trim() === "" ? "" : String(value);
  const date = parseIsoLocal(iso);
  if (!date) return String(value);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function nightsBetween(start: unknown, end: unknown) {
  const from = toIsoDateString(start);
  const to = toIsoDateString(end);
  if (!from || !to) return null;
  const startDate = parseIsoLocal(from);
  const endDate = parseIsoLocal(to);
  if (!startDate || !endDate) return null;
  return Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000);
}

export function formatPeriodLabel(range: DateRange, locale = "fr-FR") {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return `${range.from.toLocaleDateString(locale, options)} – ${range.to.toLocaleDateString(locale, options)}`;
}
