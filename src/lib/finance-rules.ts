/** Règles de facturation partagées par l'interface, les KPI et les tests. */

export const PAYMENT_METHODS = [
  { value: "cash", label: "Espèces" },
  { value: "mtn_momo", label: "Mobile Money MTN" },
  { value: "orange_money", label: "Mobile Money Orange" },
  { value: "bank_transfer", label: "Virement" },
  { value: "cheque", label: "Chèque" },
  { value: "card", label: "Carte" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

const LEGACY_METHOD_LABELS: Record<string, string> = {
  mobile_money: "Mobile Money",
  mobile: "Mobile Money",
  transfer: "Virement",
};

export type ComputedStatus =
  | "draft"
  | "issued"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "conditional"
  | "cancelled";

export const STATUS_LABELS: Record<ComputedStatus, string> = {
  draft: "Brouillon",
  issued: "Émise",
  partially_paid: "Partiellement payée",
  paid: "Payée",
  overdue: "En retard",
  conditional: "Conditionnelle",
  cancelled: "Annulée",
};

export type ReminderKind = "invoice_due_3d" | "invoice_due_0d" | "invoice_overdue_3d" | "invoice_overdue_7d";

export type CashBucket = "especes" | "mtn" | "orange" | "banque";

export interface StatusInput {
  status: string;
  isConditional?: boolean | null;
  amount: number;
  paidAmount: number;
  dueDate?: string | null;
}

export function paymentMethodLabel(method: string): string {
  return (
    PAYMENT_METHODS.find((item) => item.value === method)?.label ??
    LEGACY_METHOD_LABELS[method] ??
    method
  );
}

export function referenceRequired(method: string): boolean {
  return method !== "cash";
}

export function remainingDue(amount: number, paidAmount: number): number {
  return Math.max(0, Math.round(Number(amount) - Number(paidAmount)));
}

/** Refuse un encaissement supérieur au reste dû. */
export function validateCollection(input: {
  amount: number;
  method: string;
  paidAt: string;
  reference?: string | null;
  remaining: number;
}): string | null {
  if (!(Number(input.amount) > 0)) return "Le montant doit être supérieur à 0.";
  if (!input.paidAt) return "La date réelle est requise.";
  if (!PAYMENT_METHODS.some((item) => item.value === input.method)) return "Mode de paiement inconnu.";
  if (referenceRequired(input.method) && !input.reference?.trim()) {
    return "La référence de transaction est obligatoire, sauf pour les espèces.";
  }
  if (Math.round(Number(input.amount)) > Math.round(Number(input.remaining))) {
    return `Trop-perçu refusé : il reste ${Math.round(input.remaining)} FCFA sur cette facture.`;
  }
  return null;
}

export function computedInvoiceStatus(row: StatusInput, today: string): ComputedStatus {
  if (row.status === "draft") return "draft";
  if (row.status === "cancelled") return "cancelled";
  const remaining = remainingDue(row.amount, row.paidAmount);
  if (row.isConditional && remaining > 0) return "conditional";
  if (remaining <= 0 && Number(row.amount) > 0) return "paid";
  const due = row.dueDate?.slice(0, 10) ?? "";
  if (due && due < today && remaining > 0) return "overdue";
  if (Number(row.paidAmount) > 0) return "partially_paid";
  return "issued";
}

export function statusLabel(row: StatusInput, today: string): string {
  const status = computedInvoiceStatus(row, today);
  if (status === "overdue") {
    const days = daysLate(row.dueDate, today, remainingDue(row.amount, row.paidAmount), row.status);
    return days > 0 ? `En retard · ${days} j` : STATUS_LABELS.overdue;
  }
  return STATUS_LABELS[status];
}

export function daysLate(dueDate: string | null | undefined, today: string, remaining: number, status: string): number {
  if (!dueDate || remaining <= 0 || status === "draft" || status === "cancelled") return 0;
  const due = dueDate.slice(0, 10);
  if (due >= today) return 0;
  const start = Date.parse(`${due}T12:00:00Z`);
  const end = Date.parse(`${today}T12:00:00Z`);
  return Math.round((end - start) / 86400000);
}

export function doualaToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Douala" }).format(now);
}

export function addIsoDays(iso: string, days: number): string {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Relance planifiée : uniquement le jour exact J-3, J0, J+3 ou J+7. */
export function scheduledReminderKind(dueDate: string | null | undefined, today: string): ReminderKind | null {
  if (!dueDate) return null;
  const due = dueDate.slice(0, 10);
  if (due === addIsoDays(today, 3)) return "invoice_due_3d";
  if (due === today) return "invoice_due_0d";
  if (due === addIsoDays(today, -3)) return "invoice_overdue_3d";
  if (due === addIsoDays(today, -7)) return "invoice_overdue_7d";
  return null;
}

/** Le bouton Relancer reprend le même modèle, le plus proche de la situation. */
export function manualReminderKind(dueDate: string | null | undefined, today: string): ReminderKind {
  return scheduledReminderKind(dueDate, today) ?? (dueDate && dueDate.slice(0, 10) < today ? "invoice_overdue_7d" : "invoice_due_3d");
}

export function invoiceCounts(row: StatusInput): { invoiced: boolean; exigible: boolean; conditional: boolean } {
  const remaining = remainingDue(row.amount, row.paidAmount);
  const cancelled = row.status === "cancelled";
  const draft = row.status === "draft";
  return {
    invoiced: !draft && !cancelled,
    exigible: !draft && !cancelled && !row.isConditional && remaining > 0,
    conditional: !draft && !cancelled && Boolean(row.isConditional) && remaining > 0,
  };
}

export function isUpcomingDue(dueDate: string | null | undefined, today: string, withinDays = 30): boolean {
  if (!dueDate) return false;
  const due = dueDate.slice(0, 10);
  return due >= today && due <= addIsoDays(today, withinDays);
}

export interface InvoiceEditSnapshot {
  project: string;
  dueDate: string;
  dossierId: string;
  amount: number;
}

/** Aucun appel si l'écran n'a rien changé. Le montant émis n'est jamais dans le patch. */
export function issuedEditPatch(
  current: InvoiceEditSnapshot,
  next: InvoiceEditSnapshot
): { patch: Record<string, string | null>; unchanged: boolean } | { error: string } {
  if (Math.round(next.amount) !== Math.round(current.amount)) {
    return { error: "Le montant d'une facture émise est verrouillé. Passez par un avoir." };
  }
  const patch: Record<string, string | null> = {};
  if ((next.project || "") !== (current.project || "")) patch.project = next.project.trim() || null;
  if ((next.dueDate || "") !== (current.dueDate || "")) patch.due_date = next.dueDate || null;
  if ((next.dossierId || "") !== (current.dossierId || "")) patch.dossier_id = next.dossierId || null;
  return { patch, unchanged: Object.keys(patch).length === 0 };
}

export function cashBucket(method: string): CashBucket {
  if (method === "cash") return "especes";
  if (method === "mtn_momo" || method === "mobile_money" || method === "mobile") return "mtn";
  if (method === "orange_money") return "orange";
  return "banque";
}

export interface JournalLine {
  id: string;
  on: string;
  label: string;
  delta: number;
  bucket: CashBucket;
}

/** Solde progressif, par journal. */
export function runningBalances(lines: JournalLine[]): (JournalLine & { balance: number })[] {
  const ordered = [...lines].sort((a, b) => a.on.localeCompare(b.on) || a.id.localeCompare(b.id));
  const totals: Record<CashBucket, number> = { especes: 0, mtn: 0, orange: 0, banque: 0 };
  return ordered.map((line) => {
    totals[line.bucket] += line.delta;
    return { ...line, balance: totals[line.bucket] };
  });
}

export function bookBalance(lines: JournalLine[], bucket: CashBucket, through: string): number {
  return lines
    .filter((line) => line.bucket === bucket && line.on.slice(0, 10) <= through)
    .reduce((sum, line) => sum + line.delta, 0);
}

export function closeVariance(counted: number, book: number): number {
  return Math.round(counted) - Math.round(book);
}

export function monthKeyOf(iso: string): string {
  return iso.slice(0, 7);
}

/** Une écriture dont le mois est clôturé ne se modifie plus. */
export function periodAllowsWrite(day: string, closedMonths: string[], closedDays: string[]): boolean {
  return !closedMonths.includes(monthKeyOf(day)) && !closedDays.includes(day.slice(0, 10));
}

export function canApproveFinance(role: string | null | undefined, requesterId: string, actorId: string): boolean {
  if (!actorId || actorId === requesterId) return false;
  return role === "super_admin" || role === "admin" || role === "direction";
}

export function canRequestCancel(role: string | null | undefined): boolean {
  return role === "super_admin" || role === "admin" || role === "direction" || role === "finance";
}

export function authorMayCancelPayment(collectedBy: string | null | undefined, actorId: string): boolean {
  return !collectedBy || collectedBy !== actorId;
}
