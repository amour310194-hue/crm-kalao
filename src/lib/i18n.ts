/** Libellés FR centralisés. Clés stables pour un locale `en` plus tard. */
export const fr = {
  appName: "Kalao CRM",
  signIn: "Se connecter",
  email: "Adresse email",
  password: "Mot de passe",
  forgotPassword: "Mot de passe oublié ?",
  rememberMe: "Se souvenir de moi",
  noDeals: "Aucune affaire pour l’instant",
  noLeads: "Aucun prospect pour l’instant",
  noActivities: "Aucune activité pour l’instant",
  createDeal: "Créer une affaire",
  overdue: "En retard",
  today: "Aujourd’hui",
  upcoming7d: "Échéances 7 jours",
  collected: "Encaissé",
  outstanding: "Reste à encaisser",
  invoices: "Factures",
  payments: "Paiements",
  paidAt: "Date de paiement",
  emptyChart: "Pas encore de données à afficher",
} as const;

export type MessageKey = keyof typeof fr;

export function t(key: MessageKey): string {
  return fr[key];
}
