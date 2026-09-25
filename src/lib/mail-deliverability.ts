import { resolve4, resolveMx, resolveTxt } from "node:dns/promises";
import { KALAO_CONTACT_EMAIL, KALAO_LOGO_URL, KALAO_NOREPLY_EMAIL } from "@/lib/org";

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
  const [mxRoot, mailIps, spfRoot, dkimResend] = await Promise.all([
    mx("groupe-kalao.com"),
    a("mail.groupe-kalao.com"),
    txt("groupe-kalao.com"),
    txt("resend._domainkey.groupe-kalao.com"),
  ]);
  const spf = spfRoot.find((row) => row.startsWith("v=spf1")) ?? "";
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
      ok: spf.includes("include:amazonses.com") || spf.includes("include:resend.com"),
      label: "SPF (anti-spam envoi)",
      current: spf || "(aucun SPF)",
      expected: RECOMMENDED_SPF,
    },
    {
      ok: dkimResend.some((row) => row.includes("p=")),
      label: "DKIM Resend",
      current: dkimResend.length ? "resend._domainkey présent" : "(absent)",
      expected: "TXT resend._domainkey (déjà fourni par Resend)",
    },
  ];

  const fix: string[] = [];
  if (mailPointsVercel || !mxLooksN0c) {
    fix.push(
      `Dans N0C → DNS : l’enregistrement A de mail.groupe-kalao.com doit être ${N0C_MAIL_IP} (pas ${VERCEL_ANYCAST}). Ou remplacer le MX par ${N0C_MAIL_HOST}.`
    );
  }
  if (!spf.includes("include:amazonses.com") && !spf.includes("include:resend.com")) {
    fix.push(
      `Dans N0C → DNS : remplacer le TXT SPF racine par exactement : ${RECOMMENDED_SPF} (on garde l’IP N0C, on ajoute Resend). Ne pas toucher default._domainkey ni le MX une fois N0C rétabli.`
    );
  }
  fix.push(
    "Dans N0C → E-mail : redirection de chaque adresse vers le même local-part@ildiielkie.resend.app, en conservant une copie."
  );

  return {
    mxOk: checks[0].ok,
    spfOk: checks[1].ok,
    dkimOk: checks[2].ok,
    checks,
    fix,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function fromAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] || from).trim();
}

export function crmMailHtml(body: string): string {
  const paragraphs = escapeHtml(body)
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 12px;line-height:1.55;font-size:15px">${block.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#efece4;font-family:Arial,Helvetica,sans-serif;color:#1a2a32">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;background:#efece4">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #d9d2c3;max-width:600px">
<tr><td style="background:#164B5A;padding:18px 24px">
<img src="${KALAO_LOGO_URL}" alt="Kalao" width="180" height="36" style="display:block;height:36px;width:auto;border:0;outline:none"/>
</td></tr>
<tr><td style="height:4px;background:#E8A317;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:28px 28px 8px">
${paragraphs}
<p style="margin:28px 0 0;font-size:12px;color:#5c6573">Message envoyé depuis le CRM Kalao. Répondez à cet e-mail pour joindre l’expéditeur.</p>
</td></tr>
<tr><td style="background:#164B5A;padding:14px 24px;font-size:11px;line-height:1.45;color:#d7e4e8">
Groupe Kalao · Bastos, Yaoundé, Cameroun<br/>
${KALAO_CONTACT_EMAIL} · +237 694 635 250
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export function crmMailHeaders(from: string) {
  const address = fromAddress(from);
  return {
    "Reply-To": address,
    "List-Unsubscribe": `<mailto:${KALAO_NOREPLY_EMAIL}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
