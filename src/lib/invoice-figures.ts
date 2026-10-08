import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { figureStatusLabel, type FigureSnapshot } from "@/lib/finance-rules";

export interface InvoiceFigure {
  id: string;
  number: string | null;
  legacy_ref: string | null;
  company_id: string | null;
  contact_id: string | null;
  dossier_id: string | null;
  due_date: string | null;
  amount: number;
  paid_amount: number;
  remaining: number;
  computed_status: string;
  days_late: number;
  is_conditional: boolean;
}

export async function fetchInvoiceFigures(): Promise<InvoiceFigure[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("invoice_figures")
    .select(
      "id, number, legacy_ref, company_id, contact_id, dossier_id, due_date, amount, paid_amount, remaining, computed_status, days_late, is_conditional"
    );
  if (error) throw new Error(error.message);
  return (data ?? []) as InvoiceFigure[];
}

export function toFigureSnapshot(row: InvoiceFigure): FigureSnapshot {
  return {
    amount: Number(row.amount),
    paidAmount: Number(row.paid_amount),
    remaining: Number(row.remaining),
    computedStatus: row.computed_status,
    daysLate: Number(row.days_late),
    dueDate: row.due_date,
  };
}

export function figureExportRows(rows: InvoiceFigure[]): string[][] {
  return rows.map((row) => [
    row.number ?? "Brouillon",
    row.legacy_ref ?? "",
    String(row.amount),
    String(row.paid_amount),
    String(row.remaining),
    figureStatusLabel(row.computed_status, Number(row.days_late)),
    row.due_date ?? "",
  ]);
}
