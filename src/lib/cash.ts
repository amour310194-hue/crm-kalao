import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { EXPENSE_METHODS, todayDouala, type ExpenseMethod } from "@/lib/expenses";
import { assertCanEditFinance, assertCanEditFinanceRecord } from "@/lib/roles";

export const CASH_KINDS = [
  { value: "recette", label: "Recette" },
  { value: "depot", label: "Dépôt" },
  { value: "retrait", label: "Retrait" },
  { value: "operation", label: "Opération" },
] as const;

export type CashKind = (typeof CASH_KINDS)[number]["value"];
export type CashDirection = "entree" | "sortie";

export interface CashOperationRow {
  id: string;
  kind: CashKind;
  direction: CashDirection;
  label: string;
  amount: number;
  occurred_at: string;
  method: ExpenseMethod;
  counterparty: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
}

export type CashOperationInput = {
  kind: CashKind;
  label: string;
  amount: number;
  occurred_at: string;
  method: ExpenseMethod;
  direction?: CashDirection;
  counterparty?: string | null;
  notes?: string | null;
};

export { EXPENSE_METHODS as CASH_METHODS, todayDouala };

export function cashKindLabel(value: string): string {
  return CASH_KINDS.find((item) => item.value === value)?.label ?? value;
}

export function impliedDirection(kind: CashKind, direction?: CashDirection): CashDirection {
  if (kind === "recette" || kind === "retrait") return "entree";
  if (kind === "depot") return "sortie";
  return direction === "sortie" ? "sortie" : "entree";
}

/** Impact caisse : entrée positive, sortie négative. */
export function cashDelta(row: Pick<CashOperationRow, "amount" | "direction">): number {
  const amount = Number(row.amount);
  return row.direction === "sortie" ? -amount : amount;
}

export function validateCashOperationInput(input: CashOperationInput): string | null {
  if (!input.label.trim()) return "Le libellé est requis.";
  if (!(Number(input.amount) > 0)) return "Le montant doit être supérieur à 0.";
  if (!input.occurred_at) return "La date est requise.";
  if (!CASH_KINDS.some((item) => item.value === input.kind)) return "Type d'opération invalide.";
  return null;
}

export function toCashOperationInsert(input: CashOperationInput) {
  const error = validateCashOperationInput(input);
  if (error) throw new Error(error);
  const direction = impliedDirection(input.kind, input.direction);
  return {
    kind: input.kind,
    direction,
    label: input.label.trim(),
    amount: Number(input.amount),
    occurred_at: input.occurred_at,
    method: input.method,
    counterparty: input.counterparty?.trim() || null,
    notes: input.notes?.trim() || null,
  };
}

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function fetchCashOperations(): Promise<CashOperationRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("cash_operations")
    .select("*")
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as CashOperationRow[];
}

export async function createCashOperation(input: CashOperationInput): Promise<CashOperationRow> {
  await assertCanEditFinance();
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const payload = toCashOperationInsert(input);
  const { data, error } = await supabase.from("cash_operations").insert(payload).select("*").single();
  throwIf(error);
  return data as CashOperationRow;
}

export async function updateCashOperation(id: string, input: CashOperationInput) {
  await assertCanEditFinanceRecord();
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const payload = toCashOperationInsert(input);
  const { error } = await supabase.from("cash_operations").update(payload).eq("id", id);
  throwIf(error);
}

export async function deleteCashOperation(id: string) {
  await assertCanEditFinanceRecord();
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("cash_operations").delete().eq("id", id);
  throwIf(error);
}
