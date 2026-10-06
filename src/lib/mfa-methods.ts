export type MfaKind = "totp" | "phone" | "webauthn";

export type MfaFactor = {
  id: string;
  status: string;
  factor_type: string;
  friendly_name?: string;
};

export const MFA_METHOD_LABEL: Record<MfaKind, string> = {
  totp: "Application authenticator",
  phone: "Code SMS",
  webauthn: "Clé de sécurité / passkey",
};

export function factorKind(factor: MfaFactor): MfaKind | null {
  if (factor.factor_type === "totp" || factor.factor_type === "phone" || factor.factor_type === "webauthn") {
    return factor.factor_type;
  }
  return null;
}

export function collectMfaFactors(listed: {
  totp?: MfaFactor[] | null;
  phone?: MfaFactor[] | null;
  webauthn?: MfaFactor[] | null;
  all?: MfaFactor[] | null;
}): MfaFactor[] {
  if (listed.all?.length) return listed.all.filter((f) => factorKind(f));
  return [...(listed.totp ?? []), ...(listed.phone ?? []), ...(listed.webauthn ?? [])];
}

export function verifiedFactors(factors: MfaFactor[]): MfaFactor[] {
  return factors.filter((f) => f.status === "verified" && factorKind(f));
}

export function hasVerifiedMfa(factors: MfaFactor[]): boolean {
  return verifiedFactors(factors).length > 0;
}

/** Normalise un numéro Cameroun / international vers E.164. */
export function toE164(input: string): string | null {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8) return null;
  if (trimmed.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.startsWith("237") && digits.length >= 11 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 9) return `+237${digits}`;
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return null;
}

export function explainMfaError(message: string | undefined): string {
  const raw = (message ?? "").toLowerCase();
  if (!raw) return "Action impossible. Réessayez.";
  if (raw.includes("sms") || raw.includes("twilio") || raw.includes("phone provider") || raw.includes("unsupported")) {
    return "Le SMS n’est pas configuré sur Auth. Utilisez l’application authenticator ou une clé.";
  }
  if (raw.includes("webauthn") || raw.includes("not allowed") || raw.includes("not supported")) {
    return "Cette clé ou ce navigateur n’accepte pas WebAuthn. Essayez Chrome/Edge en HTTPS.";
  }
  return "Action impossible. Réessayez.";
}
