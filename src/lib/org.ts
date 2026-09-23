export const KALAO_CONTACT_EMAIL = "contact@groupe-kalao.com";
export const KALAO_NOREPLY_EMAIL = "no-reply@groupe-kalao.com";
export const KALAO_NOREPLY_FROM = `CRM Kalao <${KALAO_NOREPLY_EMAIL}>`;

export const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super-admin",
  admin: "Admin",
  manager: "Manager",
  rh: "RH",
  staff: "Secrétaire",
};

export type KalaoEntityKey = "groupe" | "globe" | "consulting";

export type KalaoEntity = {
  key: KalaoEntityKey;
  legalName: string;
  tradeName: string;
  rccm: string | null;
  niu: string | null;
  phones: string[];
  email: string;
  address: string;
  city: string;
  representative: string;
  representativeTitle: string;
  logoSrc: string;
};

export const KALAO_GROUPE: KalaoEntity = {
  key: "groupe",
  legalName: "GROUPE KALAO",
  tradeName: "Groupe Kalao",
  rccm: null,
  niu: null,
  phones: ["+237 694 635 250", "+237 673 794 702"],
  email: KALAO_CONTACT_EMAIL,
  address: "Bastos",
  city: "Yaoundé, Cameroun",
  representative: "Amour OKALA",
  representativeTitle: "PDG",
  logoSrc: "/assets/img/kalao-logo.jpg",
};

export const KALAO_GLOBE_TREK: KalaoEntity = {
  key: "globe",
  legalName: "ETS KALAO GLOB TREK",
  tradeName: "Kalao Globe Trek",
  rccm: "RC/YAO/2025/38",
  niu: "P019416937161C",
  phones: ["+237 694 635 250", "+237 673 794 702"],
  email: "contact@kalao-globe-trek.com",
  address: "Bastos",
  city: "Yaoundé, Cameroun",
  representative: "NDZOMO ELOUNDOU Thaddée",
  representativeTitle: "Responsable",
  logoSrc: "/assets/img/kalao-logo.jpg",
};

export const KALAO_CONSULTING: KalaoEntity = {
  key: "consulting",
  legalName: "KALAO CONSULTING",
  tradeName: "Kalao Consulting",
  rccm: null,
  niu: null,
  phones: ["+237 694 155 966", "+237 673 794 702"],
  email: "contact@kalao-consulting.com",
  address: "Bastos",
  city: "Yaoundé, Cameroun",
  representative: "NDZOMO ELOUNDOU Thaddée",
  representativeTitle: "Directeur Général",
  logoSrc: "/assets/img/kalao-logo.jpg",
};

export function entityForDoc(kind: string): KalaoEntity {
  if (kind === "employment" || kind === "certificate" || kind === "payslip") {
    return KALAO_CONSULTING;
  }
  if (kind === "visa") return KALAO_GLOBE_TREK;
  return KALAO_GROUPE;
}

export function entityFooter(entity: KalaoEntity): string {
  const ids = [entity.rccm ? `RCCM ${entity.rccm}` : null, entity.niu ? `NIU ${entity.niu}` : null]
    .filter(Boolean)
    .join(" · ");
  return [
    entity.legalName,
    ids,
    `Tél. ${entity.phones.join(" / ")}`,
    entity.email,
    `Siège : ${entity.address}, ${entity.city}`,
  ]
    .filter(Boolean)
    .join(" — ");
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
