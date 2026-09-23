import { KALAO_NOREPLY_EMAIL, KALAO_NOREPLY_FROM } from "@/lib/org";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://crm.groupe-kalao.com";

export function siteUrl(path: string): string {
  return `${SITE.replace(/\/$/, "")}${path}`;
}

export async function sendNoreplyMail(input: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ dispatched: boolean; detail?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { dispatched: false, detail: "RESEND_API_KEY manquant" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || KALAO_NOREPLY_FROM,
      to: [input.to],
      subject: input.subject,
      text: input.body,
      headers: {
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
      },
    }),
  });
  if (res.ok) return { dispatched: true };
  const raw = await res.text();
  return { dispatched: false, detail: raw.slice(0, 280) };
}

export function resetMailBody(_email: string, code: string, token: string): string {
  return [
    "Bonjour,",
    "",
    "Vous avez demandé à réinitialiser le mot de passe du CRM Groupe Kalao.",
    `Code : ${code}`,
    `Lien : ${siteUrl(`/reset-password?token=${encodeURIComponent(token)}`)}`,
    "",
    "Ce code expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
    "",
    "Ce message est automatique. Merci de ne pas y répondre.",
    `Envoyé par ${KALAO_NOREPLY_EMAIL}`,
    "",
    "Groupe Kalao",
  ].join("\n");
}

export function welcomeMailBody(name: string, email: string, token: string, code?: string): string {
  return [
    `Bonjour ${name},`,
    "",
    "Un compte CRM Groupe Kalao a été créé pour vous.",
    `Identifiant : ${email}`,
    code ? `Code : ${code}` : "",
    `Choisissez votre mot de passe : ${siteUrl(`/reset-password?token=${encodeURIComponent(token)}`)}`,
    "",
    "Ce message est automatique. Merci de ne pas y répondre.",
    `Envoyé par ${KALAO_NOREPLY_EMAIL}`,
    "",
    "Groupe Kalao",
  ]
    .filter(Boolean)
    .join("\n");
}
