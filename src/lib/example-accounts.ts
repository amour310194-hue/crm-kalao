import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const EXAMPLE_EMAIL = /[a-z0-9._%+-]+@example\.com/i;
const AUTH_INSERT = /insert\s+into\s+auth\.users/i;

export type AuthLikeAccount = {
  email: string;
  role?: string | null;
  banned?: boolean;
};

export function isExampleComEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@example.com");
}

/** Compte Auth example.com encore capable de se connecter avec un rôle métier. */
export function activeExampleComAccounts(rows: AuthLikeAccount[]): AuthLikeAccount[] {
  return rows.filter(
    (row) => isExampleComEmail(row.email) && !row.banned && Boolean(row.role && row.role !== "anon")
  );
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "travel") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (/\.(sql|ts|js|json)$/.test(name)) acc.push(full);
  }
  return acc;
}

export function productionSeedFilesCreatingExampleAuth(root = process.cwd()): string[] {
  const dirs = ["supabase/migrations", "supabase/seed"].map((d) => join(root, d));
  const hits: string[] = [];
  for (const dir of dirs) {
    try {
      statSync(dir);
    } catch {
      continue;
    }
    for (const file of walk(dir)) {
      const text = readFileSync(file, "utf8");
      if (AUTH_INSERT.test(text) && EXAMPLE_EMAIL.test(text)) hits.push(file);
    }
  }
  return hits;
}
