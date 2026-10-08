/** Couleurs du thème Signal. Le drapeau data-theme-kalao les active. */

export type ContrastPair = {
  name: string;
  fg: string;
  bg: string;
  min: number;
};

export const KALAO_BRAND = "#0071bc";
export const KALAO_ACCENT = "#fbb03b";

export const KALAO_CONTRAST_PAIRS: ContrastPair[] = [
  { name: "bouton principal", fg: "#ffffff", bg: "#0071bc", min: 4.5 },
  { name: "bouton principal survol", fg: "#ffffff", bg: "#005a96", min: 4.5 },
  { name: "texte sur fond", fg: "#102033", bg: "#f3f6f8", min: 4.5 },
  { name: "texte sur surface", fg: "#102033", bg: "#ffffff", min: 4.5 },
  { name: "texte atténué", fg: "#3d5166", bg: "#ffffff", min: 4.5 },
  { name: "succès", fg: "#0c6b3c", bg: "#e5f6ec", min: 4.5 },
  { name: "avertissement", fg: "#7a4e00", bg: "#fff3d6", min: 4.5 },
  { name: "danger", fg: "#9f1239", bg: "#fde8e8", min: 4.5 },
  { name: "information", fg: "#0a4f80", bg: "#e5f2fb", min: 4.5 },
  { name: "bouton succès", fg: "#ffffff", bg: "#0c6b3c", min: 4.5 },
  { name: "bouton danger", fg: "#ffffff", bg: "#9f1239", min: 4.5 },
  { name: "texte sombre", fg: "#e7f0f7", bg: "#0b1824", min: 4.5 },
  { name: "texte sombre sur surface", fg: "#e7f0f7", bg: "#132433", min: 4.5 },
  { name: "texte atténué sombre", fg: "#b7c7d6", bg: "#132433", min: 4.5 },
  { name: "lien sombre", fg: "#8ecff2", bg: "#0b1824", min: 4.5 },
  { name: "menu", fg: "#e8f1f8", bg: "#0b3a5b", min: 4.5 },
  { name: "menu actif", fg: "#ffffff", bg: "#0071bc", min: 4.5 },
  { name: "succès sombre", fg: "#8ee0b2", bg: "#10281c", min: 4.5 },
  { name: "avertissement sombre", fg: "#f5d48a", bg: "#2e2412", min: 4.5 },
  { name: "danger sombre", fg: "#ffb4c0", bg: "#3a1620", min: 4.5 },
  { name: "information sombre", fg: "#8ecff2", bg: "#10283a", min: 4.5 },
];

function channel(hex: string, start: number): number {
  const value = parseInt(hex.slice(start, start + 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const color = hex.replace("#", "");
  return 0.2126 * channel(color, 0) + 0.7152 * channel(color, 2) + 0.0722 * channel(color, 4);
}

export function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
