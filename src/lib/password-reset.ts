import { createHash, randomBytes, randomInt } from "crypto";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { hashesEqual } from "@/lib/rate-limit";
import { resetMailBody, sendNoreplyMail } from "@/lib/transactional-mail";

export const RESET_TTL_MS = 15 * 60 * 1000;
export const MAX_RESET_ATTEMPTS = 5;
export const MIN_PASSWORD_LENGTH = 12;
export const RESET_FAIL_MESSAGE = "Code ou lien invalide, ou expiré.";

export type ResetRow = {
  id: string;
  user_id: string;
  email: string;
  code_hash: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  attempts: number;
};

export type ResetStore = {
  lookupUserIdByEmail(email: string): Promise<string | null>;
  deleteUnusedForEmail(email: string): Promise<void>;
  insert(row: {
    user_id: string;
    email: string;
    code_hash: string;
    token_hash: string;
    expires_at: string;
  }): Promise<void>;
  findUnusedByEmail(email: string): Promise<ResetRow | null>;
  findUnusedByTokenHash(tokenHash: string): Promise<ResetRow | null>;
  incrementAttempts(id: string): Promise<number>;
  invalidate(id: string): Promise<void>;
  markUsed(id: string): Promise<void>;
  updateUserPassword(userId: string, password: string): Promise<void>;
  signOutAllSessions(userId: string): Promise<void>;
};

export class ResetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResetError";
  }
}

export function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function makeResetSecrets() {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const token = randomBytes(24).toString("hex");
  return { code, token, codeHash: hashSecret(code), tokenHash: hashSecret(token) };
}

export function assertNewPassword(password: string, email: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ResetError(`Le mot de passe doit avoir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  }
  if (password.toLowerCase() === email.trim().toLowerCase()) {
    throw new ResetError("Le mot de passe ne peut pas être identique à l'e-mail.");
  }
}

export function isExpired(expiresAt: string, now = Date.now()): boolean {
  return new Date(expiresAt).getTime() <= now;
}

export async function issuePasswordResetWithStore(
  store: ResetStore,
  email: string,
  userId: string,
  options?: { sendEmail?: boolean }
) {
  const secrets = makeResetSecrets();
  const expires = new Date(Date.now() + RESET_TTL_MS).toISOString();
  await store.deleteUnusedForEmail(email);
  await store.insert({
    user_id: userId,
    email,
    code_hash: secrets.codeHash,
    token_hash: secrets.tokenHash,
    expires_at: expires,
  });
  if (options?.sendEmail === false) {
    return { ...secrets, dispatched: false as const };
  }
  const mail = await sendNoreplyMail({
    to: email,
    subject: "Réinitialisation du mot de passe — CRM Kalao",
    body: resetMailBody(email, secrets.code, secrets.token),
  });
  return { ...secrets, dispatched: mail.dispatched, detail: mail.detail };
}

export async function consumePasswordResetWithStore(
  store: ResetStore,
  input: { email?: string; code?: string; token?: string; password: string }
): Promise<void> {
  const password = input.password.trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const code = input.code?.trim();
  const token = input.token?.trim();
  if (!code && !token) throw new ResetError(RESET_FAIL_MESSAGE);

  let row: ResetRow | null = null;
  if (token) {
    row = await store.findUnusedByTokenHash(hashSecret(token));
  } else {
    if (!email) throw new ResetError(RESET_FAIL_MESSAGE);
    row = await store.findUnusedByEmail(email);
  }
  if (!row) throw new ResetError(RESET_FAIL_MESSAGE);
  if (isExpired(row.expires_at)) throw new ResetError(RESET_FAIL_MESSAGE);

  const expected = token ? row.token_hash : row.code_hash;
  const provided = hashSecret(token || code || "");
  if (!hashesEqual(expected, provided)) {
    const attempts = await store.incrementAttempts(row.id);
    if (attempts >= MAX_RESET_ATTEMPTS) await store.invalidate(row.id);
    throw new ResetError(RESET_FAIL_MESSAGE);
  }

  assertNewPassword(password, row.email);
  await store.updateUserPassword(row.user_id, password);
  await store.markUsed(row.id);
  await store.signOutAllSessions(row.user_id);
}

function mapRow(raw: Record<string, unknown> | null): ResetRow | null {
  if (!raw) return null;
  return {
    id: String(raw.id),
    user_id: String(raw.user_id),
    email: String(raw.email),
    code_hash: String(raw.code_hash),
    token_hash: String(raw.token_hash),
    expires_at: String(raw.expires_at),
    used_at: raw.used_at ? String(raw.used_at) : null,
    attempts: Number(raw.attempts ?? 0),
  };
}

export function supabaseResetStore(): ResetStore {
  const admin = () => getServiceSupabase();
  return {
    async lookupUserIdByEmail(email) {
      const db = admin();
      const { data, error } = await db.rpc("lookup_auth_user_id", { p_email: email });
      if (error) throw new ResetError(error.message);
      if (data) return String(data);
      const { data: employee } = await db
        .from("employees")
        .select("profile_id")
        .ilike("email", email)
        .not("profile_id", "is", null)
        .maybeSingle();
      return employee?.profile_id ? String(employee.profile_id) : null;
    },
    async deleteUnusedForEmail(email) {
      const { error } = await admin().from("password_resets").delete().eq("email", email).is("used_at", null);
      if (error) throw new ResetError(error.message);
    },
    async insert(row) {
      const { error } = await admin().from("password_resets").insert({ ...row, attempts: 0 });
      if (error) throw new ResetError(error.message);
    },
    async findUnusedByEmail(email) {
      const { data, error } = await admin()
        .from("password_resets")
        .select("id, user_id, email, code_hash, token_hash, expires_at, used_at, attempts")
        .eq("email", email)
        .is("used_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new ResetError(error.message);
      return mapRow(data as Record<string, unknown> | null);
    },
    async findUnusedByTokenHash(tokenHash) {
      const { data, error } = await admin()
        .from("password_resets")
        .select("id, user_id, email, code_hash, token_hash, expires_at, used_at, attempts")
        .eq("token_hash", tokenHash)
        .is("used_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new ResetError(error.message);
      return mapRow(data as Record<string, unknown> | null);
    },
    async incrementAttempts(id) {
      const db = admin();
      const { data, error } = await db
        .from("password_resets")
        .select("attempts")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new ResetError(error.message);
      const next = Number(data?.attempts ?? 0) + 1;
      const { error: upd } = await db.from("password_resets").update({ attempts: next }).eq("id", id);
      if (upd) throw new ResetError(upd.message);
      return next;
    },
    async invalidate(id) {
      const { error } = await admin()
        .from("password_resets")
        .update({ used_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new ResetError(error.message);
    },
    async markUsed(id) {
      const { error } = await admin()
        .from("password_resets")
        .update({ used_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new ResetError(error.message);
    },
    async updateUserPassword(userId, password) {
      const { error } = await admin().auth.admin.updateUserById(userId, { password });
      if (error) throw new ResetError(error.message);
    },
    async signOutAllSessions(userId) {
      const authAdmin = admin().auth.admin as { signOut?: (id: string, scope?: string) => Promise<{ error: Error | null }> };
      if (typeof authAdmin.signOut === "function") {
        await authAdmin.signOut(userId, "global");
        return;
      }
      await admin().auth.admin.updateUserById(userId, {
        app_metadata: { session_epoch: Date.now() },
      });
    },
  };
}

export async function issuePasswordReset(
  email: string,
  userId: string,
  options?: { sendEmail?: boolean }
) {
  return issuePasswordResetWithStore(supabaseResetStore(), email, userId, options);
}

export async function consumePasswordReset(input: {
  email?: string;
  code?: string;
  token?: string;
  password: string;
}): Promise<void> {
  return consumePasswordResetWithStore(supabaseResetStore(), input);
}

export async function lookupUserIdByEmail(email: string): Promise<string | null> {
  return supabaseResetStore().lookupUserIdByEmail(email);
}
