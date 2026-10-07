export interface InvoiceLineInput {
  catalogItemId?: string | null;
  label: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface InstallmentInput {
  label: string;
  amount: number;
  dueDate: string;
  conditional: boolean;
  condition: string;
}

export function lineTotal(line: Pick<InvoiceLineInput, "quantity" | "unitPrice" | "discount" | "taxRate">): number {
  const net = line.quantity * line.unitPrice - line.discount;
  return Math.round(net * (1 + line.taxRate / 100));
}

export function invoiceTotal(lines: InvoiceLineInput[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function formatInvoiceNumber(year: number, sequence: number): string {
  return `FAC-KALAO-${year}-${String(sequence).padStart(4, "0")}`;
}

export function validateLine(line: InvoiceLineInput): string | null {
  if (!line.label.trim()) return "Chaque ligne a une désignation.";
  if (!(line.quantity > 0)) return "La quantité doit être supérieure à 0.";
  if (!(line.unitPrice >= 0)) return "Le prix unitaire ne peut pas être négatif.";
  if (!(line.discount >= 0)) return "La remise ne peut pas être négative.";
  if (line.discount > line.quantity * line.unitPrice) return "La remise dépasse le montant de la ligne.";
  if (!(line.taxRate >= 0)) return "Le taux de taxe ne peut pas être négatif.";
  return null;
}

export function validateInstallment(part: InstallmentInput): string | null {
  if (!part.label.trim()) return "Chaque échéance a un libellé.";
  if (!(Math.round(part.amount) > 0)) return "Chaque échéance a un montant supérieur à 0.";
  if (part.conditional) {
    if (!part.condition.trim()) return "Indiquez la condition de l'échéance.";
    return null;
  }
  if (!part.dueDate) return "Chaque échéance a une date, sauf si elle est conditionnelle.";
  return null;
}

export function validateSchedule(total: number, parts: InstallmentInput[]): string | null {
  if (!parts.length) return "Ajoutez au moins une échéance.";
  for (const part of parts) {
    const error = validateInstallment(part);
    if (error) return error;
  }
  const sum = parts.reduce((acc, part) => acc + Math.round(part.amount), 0);
  if (sum !== total) {
    return `La somme des échéances (${sum} FCFA) doit égaler le total (${total} FCFA).`;
  }
  return null;
}

export function validateDraft(input: {
  contactId: string;
  dossierId: string;
  lines: InvoiceLineInput[];
  installments: InstallmentInput[];
}): string | null {
  if (!input.contactId) return "Choisissez un client.";
  if (!input.dossierId) return "Choisissez un dossier.";
  if (!input.lines.length) return "Ajoutez au moins une ligne.";
  for (const line of input.lines) {
    const error = validateLine(line);
    if (error) return error;
  }
  return validateSchedule(invoiceTotal(input.lines), input.installments);
}

/** Découpe le total en parts entières. Le reste va sur la dernière échéance. */
export function splitEven(total: number, count: number): number[] {
  if (!(count > 0) || !(total > 0)) return [];
  const base = Math.floor(total / count);
  const parts = Array.from({ length: count }, () => base);
  parts[count - 1] = total - base * (count - 1);
  return parts;
}

export function installmentLabels(count: number): string[] {
  if (count <= 1) return ["Solde"];
  return Array.from({ length: count }, (_, index) => {
    if (index === 0) return "Avance";
    if (index === count - 1) return "Solde";
    return `${index + 1}e échéance`;
  });
}

export function explainInvoiceError(message: string): string {
  if (message.includes("client_dossier_requis")) return "Le client et le dossier sont obligatoires.";
  if (message.includes("dossier_client")) return "Ce dossier n'appartient pas au client choisi.";
  if (message.includes("lignes_requises")) return "Ajoutez au moins une ligne.";
  if (message.includes("echeances_requises")) return "Ajoutez au moins une échéance.";
  if (message.includes("echeances_total")) return "La somme des échéances doit égaler le total.";
  if (message.includes("echeance_date")) return "Chaque échéance a une date, sauf si elle est conditionnelle.";
  if (message.includes("echeance_condition")) return "Indiquez la condition de l'échéance.";
  if (message.includes("remise_trop_forte")) return "La remise dépasse le montant de la ligne.";
  if (message.includes("reserve_finance")) return "Réservé à la finance ou à un administrateur.";
  if (message.includes("deja_emise")) return "Cette facture est déjà émise.";
  if (message.includes("emission_reservee")) return "Le numéro est attribué par l'émission.";
  if (message.includes("brouillon_non_encaisse")) return "Un brouillon ne s'encaisse pas. Émettez la facture d'abord.";
  if (message.includes("facture_figee")) return "Les lignes d'une facture émise ne se modifient plus.";
  return message;
}
