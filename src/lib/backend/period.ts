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

export function toIsoRange(range: DateRange) {
  return {
    from: range.from.toISOString(),
    to: range.to.toISOString(),
  };
}
