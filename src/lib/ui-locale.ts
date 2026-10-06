/** Locales réellement servies par l’interface. Pas de pourcentages ni de « Connected ». */
export type UiLocaleStatus = "interface";

export type UiLocale = {
  code: string;
  name: string;
  rtl: boolean;
  status: UiLocaleStatus;
};

export const CRM_UI_LOCALES: readonly UiLocale[] = [
  {
    code: "fr",
    name: "Français",
    rtl: false,
    status: "interface",
  },
];

export function localeStatusLabel(status: UiLocaleStatus): string {
  if (status === "interface") return "Langue de l’interface";
  return "Non disponible";
}

export const CRM_UI_TIMEZONE = "Africa/Douala";
export const CRM_UI_CURRENCY = "XAF";
