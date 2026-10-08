/** Qualité des fiches clients. Aucune coordonnée n'est inventée. */

export function normalizePhone(raw: string | null | undefined, defaultCountry = "+237"): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) throw new Error("Le téléphone est obligatoire.");
  let value = trimmed.replace(/[\s.\-()]/g, "");
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (value.startsWith("0")) value = `${defaultCountry}${value.slice(1)}`;
  if (!value.startsWith("+")) value = `${defaultCountry}${value}`;
  if (!/^\+[1-9]\d{7,14}$/.test(value)) {
    throw new Error("Téléphone invalide. Exemple : +237699000000.");
  }
  return value;
}

export function validateEmail(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("E-mail invalide.");
  return value.toLowerCase();
}

export function missingCoordinates(row: { phone?: string | null; email?: string | null }): boolean {
  return !row.phone?.trim() || !row.email?.trim();
}

export interface DuplicateCandidate {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
}

function fold(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findDuplicates<T extends DuplicateCandidate>(
  rows: T[],
  input: { first_name: string; last_name: string; phone?: string | null; email?: string | null },
  ignoreId?: string
): T[] {
  const name = fold(`${input.first_name} ${input.last_name}`);
  const email = input.email?.trim().toLowerCase() || "";
  let phone = "";
  try {
    phone = input.phone?.trim() ? normalizePhone(input.phone) : "";
  } catch {
    phone = input.phone?.trim() || "";
  }
  return rows.filter((row) => {
    if (ignoreId && row.id === ignoreId) return false;
    if (phone && row.phone) {
      try {
        if (normalizePhone(row.phone) === phone) return true;
      } catch {
        if (row.phone.trim() === phone) return true;
      }
    }
    if (email && row.email && row.email.trim().toLowerCase() === email) return true;
    const rowName = fold(`${row.first_name} ${row.last_name}`);
    return Boolean(name && rowName && rowName === name);
  });
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cell = "";
  let row: string[] = [];
  let quoted = false;
  const source = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === "," || char === ";") {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n") {
      row.push(cell.trim());
      if (row.some((value) => value)) rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") cell += char;
  }
  row.push(cell.trim());
  if (row.some((value) => value)) rows.push(row);
  return rows;
}

export const CSV_FIELDS = ["first_name", "last_name", "phone", "email", "job_title", "city", "nationality", "source"] as const;

export function previewImport(
  table: string[][],
  mapping: Record<string, number>,
  existing: DuplicateCandidate[]
): { ok: Record<string, string>[]; errors: { line: number; message: string }[]; duplicates: { line: number; name: string }[] } {
  const [header, ...body] = table;
  if (!header?.length) return { ok: [], errors: [{ line: 1, message: "Fichier vide." }], duplicates: [] };
  const ok: Record<string, string>[] = [];
  const errors: { line: number; message: string }[] = [];
  const duplicates: { line: number; name: string }[] = [];
  body.forEach((cells, index) => {
    const line = index + 2;
    const record: Record<string, string> = {};
    for (const field of CSV_FIELDS) {
      const column = mapping[field];
      record[field] = column == null || column < 0 ? "" : cells[column] ?? "";
    }
    if (!record.first_name && !record.last_name) {
      errors.push({ line, message: "Nom manquant." });
      return;
    }
    try {
      record.phone = normalizePhone(record.phone);
      record.email = validateEmail(record.email) ?? "";
    } catch (err) {
      errors.push({ line, message: err instanceof Error ? err.message : "Ligne invalide." });
      return;
    }
    const dupes = findDuplicates(existing, {
      first_name: record.first_name,
      last_name: record.last_name,
      phone: record.phone,
      email: record.email,
    });
    if (dupes.length) duplicates.push({ line, name: `${record.first_name} ${record.last_name}`.trim() });
    else ok.push(record);
  });
  return { ok, errors, duplicates };
}

const DAY = 24 * 60 * 60 * 1000;

export function canRestore(archivedAt: string, now = new Date()): boolean {
  const stamp = new Date(archivedAt).getTime();
  if (Number.isNaN(stamp)) return false;
  return now.getTime() - stamp <= 30 * DAY;
}
