export const KALAO_TEAL = "#164B5A";
export const KALAO_GOLD = "#E8A317";
export const KALAO_LOGO_PATH = "/assets/img/kalao-logo.png";
export const KALAO_MARK_PATH = "/assets/img/kalao-mark.jpg";
export const KALAO_LOGO_URL = "https://crm.groupe-kalao.com/assets/img/kalao-logo.png";
export const KALAO_CONTACT_EMAIL = "contact@groupe-kalao.com";
export const KALAO_NOREPLY_EMAIL = "no-reply@groupe-kalao.com";
export const KALAO_NOREPLY_FROM = `CRM Kalao <${KALAO_NOREPLY_EMAIL}>`;
export const KALAO_INBOUND_RESEND = "ildiielkie.resend.app";
export const KALAO_INBOUND_DOMAIN = "inbound.groupe-kalao.com";

export function inboundResendAlias(proEmail: string): string {
  const local = proEmail.split("@")[0]?.trim().toLowerCase() || "";
  return `${local}@${KALAO_INBOUND_RESEND}`;
}

export function inboundEndpoint(): string {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://crm.groupe-kalao.com").replace(/\/$/, "");
  return `${site}/api/email/inbound`;
}

export const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super-admin",
  admin: "Admin",
  manager: "Manager",
  direction: "Direction",
  finance: "Finance",
  commercial: "Commercial",
  rh: "RH",
  staff: "Secrétaire",
  agent: "Agent",
};

export type KalaoEntityKey = "groupe" | "consulting";
export type KalaoPoleKey = "travel" | "event" | "picture";

/** Enseignes commerciales — pas des personnes morales. */
export const KALAO_POLES: Record<KalaoPoleKey, { name: string; activity: string }> = {
  travel: { name: "Kalao Globe Trek", activity: "Voyages" },
  event: { name: "Kalao Event", activity: "Événementiel" },
  picture: { name: "Kalao Picture", activity: "Photo" },
};

export type KalaoBank = {
  bankName: string;
  accountName: string;
  iban: string;
  swift: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  key: string;
  agency: string;
};

export type KalaoEntity = {
  key: KalaoEntityKey;
  legalName: string;
  tradeName: string;
  sigle: string | null;
  rccm: string | null;
  niu: string | null;
  taxRegime: string | null;
  shareCapital: string | null;
  phones: string[];
  email: string;
  address: string;
  city: string;
  representative: string;
  representativeTitle: string;
  logoSrc: string;
  bank: KalaoBank | null;
};

export const KALAO_GROUPE: KalaoEntity = {
  key: "groupe",
  legalName: "GROUPE KALAO",
  tradeName: "Groupe Kalao",
  sigle: null,
  rccm: null,
  niu: null,
  taxRegime: null,
  shareCapital: null,
  phones: ["+237 694 635 250", "+237 673 794 702"],
  email: KALAO_CONTACT_EMAIL,
  address: "Bastos",
  city: "Yaoundé, Cameroun",
  representative: "Amour OKALA",
  representativeTitle: "PDG",
  logoSrc: KALAO_LOGO_PATH,
  bank: null,
};

/** Coordonnées issues du RCCM 13 juin 2025, de l’attestation CFCE et de l’IBAN Afriland. */
export const KALAO_CONSULTING_BANK: KalaoBank = {
  bankName: "Afriland First Bank",
  accountName: "KALAO CONSULTING SARL",
  iban: "CM21 10005 00046 10442121001-13",
  swift: "CCEICMCX",
  bankCode: "10005",
  branchCode: "00046",
  accountNumber: "10442121001",
  key: "13",
  agency: "Yaoundé — First Bank Marché Central",
};

export const KALAO_CONSULTING: KalaoEntity = {
  key: "consulting",
  legalName: "KALAO CONSULTING SARL",
  tradeName: "Groupe Kalao",
  sigle: "KC SARL",
  rccm: "CM-NSI-01-2025-B12-01116",
  niu: "M062517806851C",
  taxRegime: "Impôt Général Synthétique",
  shareCapital: "990 000 FCFA",
  phones: ["+237 694 68 34 47", "+237 673 794 702"],
  email: "contact@kalao-consulting.com",
  address: "Carrefour Bastos",
  city: "Yaoundé, Cameroun",
  representative: "NDZOMO ELOUNDOU Thaddée Junior",
  representativeTitle: "Gérant",
  logoSrc: KALAO_LOGO_PATH,
  bank: KALAO_CONSULTING_BANK,
};

/** Personne morale unique sur les pièces (factures, devis, contrats, bulletins). */
export function entityForDoc(_kind?: string): KalaoEntity {
  return KALAO_CONSULTING;
}

export function entityFooter(entity: KalaoEntity): string {
  const ids = [
    entity.rccm ? `RCCM ${entity.rccm}` : null,
    entity.niu ? `NIU ${entity.niu}` : null,
    entity.taxRegime,
    entity.shareCapital ? `Capital ${entity.shareCapital}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const bank = entity.bank
    ? `${entity.bank.bankName} · IBAN ${entity.bank.iban} · SWIFT ${entity.bank.swift}`
    : null;
  return [
    entity.sigle ? `${entity.legalName} (${entity.sigle})` : entity.legalName,
    ids,
    `Tél. ${entity.phones.join(" / ")}`,
    entity.email,
    `Siège : ${entity.address}, ${entity.city}`,
    bank,
  ]
    .filter(Boolean)
    .join(" — ");
}

export function invoiceTaxMention(entity: KalaoEntity): string {
  if (entity.taxRegime === "Impôt Général Synthétique") {
    return "Régime fiscal : Impôt Général Synthétique — TVA non applicable.";
  }
  if (entity.taxRegime) return `Régime fiscal : ${entity.taxRegime}.`;
  return "Mentions de TVA à compléter.";
}

export function invoicePaymentMention(entity: KalaoEntity): string {
  if (entity.bank) {
    return `Règlement par virement (${entity.bank.bankName}, IBAN ${entity.bank.iban}) ou en espèces.`;
  }
  return "Règlement par virement ou en espèces.";
}

export const CANADA_OPENING = 1_100_000;
export const CANADA_BASSIN = 1_500_000;

export type CanadaTranche = {
  key: "ouverture" | "bassin" | "solde";
  label: string;
  amount: number;
  when: string;
};

export function isCanadaProcedure(...texts: (string | null | undefined)[]): boolean {
  return texts.some((t) => /canada/i.test(t ?? ""));
}

export function canadaSchedule(total: number): CanadaTranche[] {
  const opening = CANADA_OPENING;
  const bassin = CANADA_BASSIN;
  const rest = Math.max(0, Math.round(total) - opening - bassin);
  return [
    {
      key: "ouverture",
      label: "1re échéance — ouverture de dossier",
      amount: opening,
      when: "À la signature",
    },
    {
      key: "bassin",
      label: "2e échéance — si tiré du bassin",
      amount: bassin,
      when: "Lorsque le client est tiré du bassin",
    },
    {
      key: "solde",
      label: "3e échéance — solde au retrait du visa",
      amount: rest,
      when: "À l'obtention du visa",
    },
  ];
}
