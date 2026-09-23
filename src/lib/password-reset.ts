import { createHash, randomBytes, randomInt } from "crypto";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { resetMailBody, sendNoreplyMail } from "@/lib/transactional-mail";

export function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function makeResetSecrets() {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const token = randomBytes(24).toString("hex");
  return { code, token, codeHash: hashSecret(code), tokenHash: hashSecret(token) };
}

export async function issuePasswordReset(
  email: string,
  userId: string,
  options?: { sendEmail?: boolean }
) {
  const admin = getServiceSupabase();
  const secrets = makeResetSecrets();
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await admin.from("password_resets").delete().eq("email", email).is("used_at", null);
  const { error } = await admin.from("password_resets").insert({
    user_id: userId,
    email,
    code_hash: secrets.codeHash,
    token_hash: secrets.tokenHash,
    expires_at: expires,
  });
  if (error) throw new Error(error.message);
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

export async function consumePasswordReset(input: {
  email?: string;
  code?: string;
  token?: string;
  password: string;
}): Promise<void> {
  const password = input.password.trim();
  if (password.length < 8) throw new Error("Le mot de passe doit avoir au moins 8 caractères.");
  const admin = getServiceSupabase();
  const codeHash = input.code ? hashSecret(input.code.trim()) : null;
  const tokenHash = input.token ? hashSecret(input.token.trim()) : null;
  if (!codeHash && !tokenHash) throw new Error("Code ou lien manquant.");

  let query = admin
    .from("password_resets")
    .select("id, user_id, email, expires_at, used_at")
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1);
  if (tokenHash) query = query.eq("token_hash", tokenHash);
  else {
    query = query.eq("code_hash", codeHash as string);
    if (input.email) query = query.eq("email", input.email.trim().toLowerCase());
  }
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Code ou lien invalide, ou expiré.");

  const { error: upd } = await admin.auth.admin.updateUserById(data.user_id, { password });
  if (upd) throw new Error(upd.message);
  await admin.from("password_resets").update({ used_at: new Date().toISOString() }).eq("id", data.id);
}
