export type DateRange = {
  from: Date;
  to: Date;
};

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, janv: 0,
  feb: 1, february: 1, fevr: 1, févr: 1,
  mar: 2, march: 2, mars: 2,
  apr: 3, april: 3, avr: 3,
  may: 4, mai: 4,
  jun: 5, june: 5, juin: 5,
  jul: 6, july: 6, juil: 6,
  aug: 7, august: 7, aout: 7, août: 7,
  sep: 8, sept: 8, september: 8, septembre: 8,
  oct: 9, october: 9, octobre: 9,
  nov: 10, november: 10, novembre: 10,
  dec: 11, december: 11, decembre: 11, décembre: 11,
};

export function parseCrmDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}$/.test(trimmed)) return null;

  const isoLocal = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(trimmed);
  if (isoLocal) {
    return new Date(
      Number(isoLocal[1]),
      Number(isoLocal[2]) - 1,
      Number(isoLocal[3]),
      Number(isoLocal[4] || 0),
      Number(isoLocal[5] || 0),
      Number(isoLocal[6] || 0)
    );
  }

  const named = /^(\d{1,2})\s+([A-Za-zÀ-ÿ.]+)\s+(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(trimmed.replace(",", ""));
  if (named) {
    const month = MONTHS[named[2].replace(/\./g, "").toLowerCase()];
    if (month != null) {
      return new Date(Number(named[3]), month, Number(named[1]), Number(named[4] || 0), Number(named[5] || 0));
    }
  }

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

export function formatDisplayDateTime(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
