export type MfaKind = "totp" | "email";

export type MfaFactor = {
  id: string;
  status: string;
  factor_type: string;
  friendly_name?: string;
};

export const MFA_METHOD_LABEL: Record<MfaKind, string> = {
  totp: "Appli d’authentification",
  email: "Authentification par e-mail",
};

export function factorKind(factor: MfaFactor): MfaKind | null {
  if (factor.factor_type === "totp") return "totp";
  return null;
}

export function collectMfaFactors(listed: {
  totp?: MfaFactor[] | null;
  phone?: MfaFactor[] | null;
  webauthn?: MfaFactor[] | null;
  all?: MfaFactor[] | null;
}): MfaFactor[] {
  const rows = listed.all?.length
    ? listed.all
    : [...(listed.totp ?? []), ...(listed.phone ?? []), ...(listed.webauthn ?? [])];
  return rows.filter((f) => f.factor_type === "totp");
}

export function verifiedFactors(factors: MfaFactor[]): MfaFactor[] {
  return factors.filter((f) => f.status === "verified" && factorKind(f));
}

export function hasVerifiedMfa(factors: MfaFactor[]): boolean {
  return verifiedFactors(factors).length > 0;
}

export function unverifiedFactors(factors: MfaFactor[]): MfaFactor[] {
  return factors.filter((f) => f.status !== "verified" && factorKind(f));
}

export function explainMfaError(message: string | undefined): string {
  const raw = (message ?? "").toLowerCase();
  if (!raw) return "Action impossible. Réessayez.";
  if (raw.includes("already exists") || raw.includes("friendly name")) {
    return "Une appli d’authentification est déjà en cours. Validez-la ou retirez-la, puis réessayez.";
  }
  if (raw.includes("maximum") || raw.includes("too many")) {
    return "Trop de méthodes enregistrées. Retirez une méthode non validée puis réessayez.";
  }
  return "Action impossible. Réessayez.";
}
