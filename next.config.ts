import type { NextConfig } from "next";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function envFromLocalFile() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return {} as Record<string, string>;
  const out: Record<string, string> = {};
  for (const line of readFileSync(file, "utf8").split(/\r\n|\n|\r/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim().replace(/^\uFEFF/, "");
    out[key] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const local = envFromLocalFile();
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || local.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  local.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    "[kalao] NEXT_PUBLIC_SUPABASE_* manquantes — le login client restera désactivé."
  );
} else {
  console.info("[kalao] Variables Supabase chargées pour le client.");
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon,
  },
};

export default nextConfig;
