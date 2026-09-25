import { applyMailVars } from "@/lib/mail-text";

export type MailTemplateVars = {
  name?: string | null;
  email?: string | null;
  company?: string | null;
};

export type MailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

export const CRM_MAIL_TEMPLATES: MailTemplate[] = [
  {
    id: "accueil",
    name: "Accueil client",
    subject: "Bienvenue chez Groupe Kalao",
    body: `Bonjour {{name}},

Merci de nous avoir contactés. Nous avons bien reçu votre demande et un conseiller Kalao vous répond sous 24 heures.

Vous pouvez répondre à cet e-mail pour nous transmettre des précisions ou des pièces.

Cordialement,
Groupe Kalao
Bastos, Yaoundé
contact@groupe-kalao.com`,
  },
  {
    id: "accuse",
    name: "Accusé de réception",
    subject: "Nous avons bien reçu votre message",
    body: `Bonjour {{name}},

Votre message est bien arrivé dans notre boîte. Nous le traitons et revenons vers vous dès que possible.

Cordialement,
Groupe Kalao`,
  },
  {
    id: "devis",
    name: "Relance devis",
    subject: "Votre devis Groupe Kalao",
    body: `Bonjour {{name}},

Nous revenons vers vous au sujet du devis préparé pour {{company}}.

Dites-nous si vous souhaitez le valider, le modifier, ou planifier un échange.

Cordialement,
Groupe Kalao`,
  },
  {
    id: "visa",
    name: "Suivi visa",
    subject: "Suivi de votre dossier visa",
    body: `Bonjour {{name}},

Nous faisons le point sur votre dossier visa. Merci de nous indiquer où vous en êtes et de joindre les pièces manquantes le cas échéant :

- Passeport en cours de validité
- CNI recto / verso
- Photos d'identité
- Justificatif d'hébergement
- Relevés bancaires 3 mois
- Assurance voyage

Nous restons à votre écoute.

Cordialement,
Groupe Kalao`,
  },
  {
    id: "pieces",
    name: "Demande de pièces",
    subject: "Pièces à nous transmettre",
    body: `Bonjour {{name}},

Pour avancer votre dossier, merci de nous envoyer les documents demandés en réponse à cet e-mail (PDF ou photo lisible).

Si un document n'est pas encore disponible, indiquez-nous la date prévue.

Cordialement,
Groupe Kalao`,
  },
  {
    id: "rdv",
    name: "Confirmation rendez-vous",
    subject: "Confirmation de rendez-vous — Groupe Kalao",
    body: `Bonjour {{name}},

Votre rendez-vous avec Groupe Kalao est confirmé. Merci d'arriver avec les pièces déjà échangées.

Pour déplacer le créneau, répondez simplement à ce message.

Cordialement,
Groupe Kalao
Bastos, Yaoundé`,
  },
  {
    id: "remerciement",
    name: "Remerciement",
    subject: "Merci — Groupe Kalao",
    body: `Bonjour {{name}},

Merci pour votre confiance. Nous restons disponibles pour la suite de votre dossier.

Cordialement,
Groupe Kalao`,
  },
];

export function fillMailTemplate(template: MailTemplate, vars: MailTemplateVars) {
  const name = vars.name?.trim() || "Madame, Monsieur";
  const email = vars.email?.trim() || "";
  const company = vars.company?.trim() || "votre dossier";
  return {
    subject: applyMailVars(template.subject, { name, email, company }),
    body: applyMailVars(template.body, { name, email, company }),
  };
}
