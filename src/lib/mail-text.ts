/** Répare les accents cassés (UTF-8 lu en Latin-1, ou � déjà substitué). */
const MOJIBAKE: Array<[RegExp, string]> = [
  [/Ã©/g, "é"],
  [/Ã¨/g, "è"],
  [/Ãª/g, "ê"],
  [/Ã«/g, "ë"],
  [/Ã /g, "à"],
  [/Ã¢/g, "â"],
  [/Ã¤/g, "ä"],
  [/Ã®/g, "î"],
  [/Ã¯/g, "ï"],
  [/Ã´/g, "ô"],
  [/Ã¶/g, "ö"],
  [/Ã¹/g, "ù"],
  [/Ã»/g, "û"],
  [/Ã¼/g, "ü"],
  [/Ã§/g, "ç"],
  [/Ã‰/g, "É"],
  [/Ãˆ/g, "È"],
  [/ÃŠ/g, "Ê"],
  [/Ã€/g, "À"],
  [/ÃŽ/g, "Î"],
  [/Ã”/g, "Ô"],
  [/Ã™/g, "Ù"],
  [/Ãœ/g, "Ü"],
  [/Ã‡/g, "Ç"],
  [/â€™/g, "’"],
  [/â€˜/g, "‘"],
  [/â€œ/g, "“"],
  [/â€�/g, "”"],
  [/â€“/g, "–"],
  [/â€”/g, "—"],
  [/â€¦/g, "…"],
];

const REPLACEMENT: Array<[RegExp, string]> = [
  [/V�rif/gi, "Vérif"],
  [/r�ception/gi, "réception"],
  [/R�ception/g, "Réception"],
  [/apr�s/gi, "après"],
  [/contr�le/gi, "contrôle"],
  [/Contr�le/g, "Contrôle"],
  [/�ch�ance/gi, "échéance"],
  [/pi�ce/gi, "pièce"],
  [/Pi�ce/g, "Pièce"],
  [/d�j�/gi, "déjà"],
  [/entr�e/gi, "entrée"],
  [/envoy�/gi, "envoyé"],
  [/re�u/gi, "reçu"],
  [/Re�u/g, "Reçu"],
  [/bo�te/gi, "boîte"],
  [/Bo�te/g, "Boîte"],
  [/acc�s/gi, "accès"],
  [/r�ponse/gi, "réponse"],
  [/R�ponse/g, "Réponse"],
  [/modifi�/gi, "modifié"],
  [/annul�/gi, "annulé"],
  [/cr��/gi, "créé"],
  [/num�ro/gi, "numéro"],
  [/t�l/gi, "tél"],
  [/int�r/gi, "intér"],
  [/s�cur/gi, "sécur"],
  [/h�berg/gi, "héberg"],
  [/validit�/gi, "validité"],
  [/identit�/gi, "identité"],
];

export function repairMailText(value: string | null | undefined): string {
  if (!value) return "";
  let text = value;
  if (/[ÃÂ]|â€/.test(text)) {
    for (const [pattern, next] of MOJIBAKE) text = text.replace(pattern, next);
  }
  if (text.includes("�")) {
    for (const [pattern, next] of REPLACEMENT) text = text.replace(pattern, next);
  }
  return text;
}

export function applyMailVars(
  template: string,
  vars: Record<string, string | null | undefined>
): string {
  return template.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_, key: string) => {
    const value = vars[key] ?? vars[key.toLowerCase()];
    return value?.trim() || "";
  });
}

export async function filesToMailPayload(files: File[]): Promise<
  { filename: string; content: string; contentType?: string }[]
> {
  const out = [];
  for (const file of files) {
    if (file.size > 8 * 1024 * 1024) continue;
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    out.push({
      filename: file.name,
      content: btoa(binary),
      contentType: file.type || undefined,
    });
  }
  return out;
}
