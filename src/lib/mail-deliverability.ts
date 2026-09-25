import { resolve4, resolveMx, resolveTxt } from "node:dns/promises";

export const N0C_MAIL_HOST = "node46-ca.n0c.com";
export const N0C_MAIL_IP = "209.16.158.37";
export const VERCEL_ANYCAST = "76.76.21.21";
export const RECOMMENDED_SPF = `v=spf1 a mx ip4:${N0C_MAIL_IP} include:amazonses.com ~all`;

export type DnsCheck = {
  ok: boolean;
  label: string;
  current: string;
  expected: string;
};

export type MailDnsReport = {
  mxOk: boolean;
  spfOk: boolean;
  dkimOk: boolean;
  dmarcOk: boolean;
  checks: DnsCheck[];
  fix: string[];
};

async function txt(name: string): Promise<string[]> {
  try {
    return (await resolveTxt(name)).map((parts) => parts.join(""));
  } catch {
    return [];
  }
}

async function mx(name: string): Promise<string[]> {
  try {
    return (await resolveMx(name)).map((row) => row.exchange.toLowerCase());
  } catch {
    return [];
  }
}

async function a(name: string): Promise<string[]> {
  try {
    return await resolve4(name);
  } catch {
    return [];
  }
}

export async function diagnoseMailDns(): Promise<MailDnsReport> {
  const [mxRoot, mailIps, spfRoot, dkimResend, spfSend, dmarcRows] = await Promise.all([
    mx("groupe-kalao.com"),
    a("mail.groupe-kalao.com"),
    txt("groupe-kalao.com"),
    txt("resend._domainkey.groupe-kalao.com"),
    txt("send.groupe-kalao.com"),
    txt("_dmarc.groupe-kalao.com"),
  ]);
  const spf = spfRoot.find((row) => row.startsWith("v=spf1")) ?? "";
  // Resend signe l'enveloppe avec le sous-domaine « send » : c'est là que son SPF doit être présent.
  const spfResend = spfSend.find((row) => row.startsWith("v=spf1")) ?? "";
  const dmarc = dmarcRows.find((row) => row.toLowerCase().startsWith("v=dmarc1")) ?? "";
  const mailPointsVercel = mailIps.includes(VERCEL_ANYCAST);
  const mailPointsN0c = mailIps.includes(N0C_MAIL_IP);
  const mxLooksN0c =
    mxRoot.some((host) => host.includes("n0c.com") || host.includes("planethoster")) ||
    (mxRoot.includes("mail.groupe-kalao.com") && mailPointsN0c);

  const checks: DnsCheck[] = [
    {
      ok: mxLooksN0c && !mailPointsVercel,
      label: "MX (réception)",
      current: mailPointsVercel
        ? `mail.groupe-kalao.com → ${VERCEL_ANYCAST} (Vercel, pas une boîte mail)`
        : mxRoot.join(", ") || "(aucun MX)",
      expected: `${N0C_MAIL_HOST} ou A mail.groupe-kalao.com = ${N0C_MAIL_IP}`,
    },
    {
      ok:
        spfResend.includes("include:amazonses.com") ||
        spf.includes("include:amazonses.com") ||
        spf.includes("include:resend.com"),
      label: "SPF (anti-spam envoi)",
      current: spfResend ? `send.groupe-kalao.com : ${spfResend}` : spf || "(aucun SPF)",
      expected: "TXT send.groupe-kalao.com = v=spf1 include:amazonses.com ~all (fourni par Resend)",
    },
    {
      ok: dkimResend.some((row) => row.includes("p=")),
      label: "DKIM Resend",
      current: dkimResend.length ? "resend._domainkey présent" : "(absent)",
      expected: "TXT resend._domainkey (déjà fourni par Resend)",
    },
    {
      ok: Boolean(dmarc),
      label: "DMARC (exigé par Gmail / Yahoo)",
      current: dmarc || "(absent)",
      expected: "TXT _dmarc.groupe-kalao.com = v=DMARC1; p=none; rua=mailto:contact@groupe-kalao.com",
    },
  ];

  const fix: string[] = [];
  if (mailPointsVercel || !mxLooksN0c) {
    fix.push(
      `Dans N0C → DNS : l’enregistrement A de mail.groupe-kalao.com doit être ${N0C_MAIL_IP} (pas ${VERCEL_ANYCAST}). Ou remplacer le MX par ${N0C_MAIL_HOST}.`
    );
  }
  if (!checks[1].ok) {
    fix.push(
      "Dans N0C → DNS : ajouter les enregistrements du sous-domaine « send » affichés par Resend (MX et TXT v=spf1 include:amazonses.com ~all). Le SPF racine N0C reste inchangé."
    );
  }
  if (!dmarc) {
    fix.push(
      "Dans N0C → DNS : ajouter TXT _dmarc.groupe-kalao.com = « v=DMARC1; p=none; rua=mailto:contact@groupe-kalao.com », puis passer à p=quarantine après quelques semaines sans rejet."
    );
  }
  fix.push(
    "Dans N0C → E-mail : redirection de chaque adresse vers le même local-part@ildiielkie.resend.app, en conservant une copie."
  );

  return {
    mxOk: checks[0].ok,
    spfOk: checks[1].ok,
    dkimOk: checks[2].ok,
    dmarcOk: checks[3].ok,
    checks,
    fix,
  };
}

export function fromAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] || from).trim();
}
