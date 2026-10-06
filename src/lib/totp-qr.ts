/** Convertit le QR TOTP Auth (SVG ou data URI) en src d’image affichable. */
export function totpQrSrc(qr: string): string {
  const trimmed = qr.trim();
  if (!trimmed) return "";
  const svgAt = trimmed.indexOf("<svg");
  if (svgAt >= 0) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(trimmed.slice(svgAt))}`;
  }
  if (trimmed.startsWith("data:") || trimmed.startsWith("http")) return trimmed;
  return trimmed;
}
