import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const PREFIX = "v1";

export function deriveIntegrationKey(master: string): Buffer {
  return scryptSync(master, "kalao-integrations-v1", 32);
}

export function encryptSecret(plain: string, master: string): string {
  const key = deriveIntegrationKey(master);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [PREFIX, iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptSecret(blob: string, master: string): string {
  const [version, ivB64, tagB64, dataB64] = blob.split(".");
  if (version !== PREFIX || !ivB64 || !tagB64 || !dataB64) {
    throw new Error("secret_invalide");
  }
  const key = deriveIntegrationKey(master);
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf8");
}

export function secretLast4(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 4) return trimmed;
  return trimmed.slice(-4);
}

export function integrationMasterKey(): string | null {
  const key = process.env.INTEGRATION_MASTER_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return key.trim() ? key : null;
}
