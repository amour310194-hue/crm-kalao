import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { assertCanEditFinance, assertCanEditFinanceRecord } from "@/lib/roles";

export const EXPENSE_CATEGORIES = [
  { value: "achat_stock", label: "Achat de stock" },
  { value: "loyer", label: "Loyer" },
  { value: "salaire_ponctuel", label: "Salaire ponctuel" },
  { value: "carburant", label: "Carburant" },
  { value: "fourniture", label: "Fourniture" },
  { value: "maintenance", label: "Maintenance" },
  { value: "autre", label: "Autre" },
] as const;

export const EXPENSE_METHODS = [
  { value: "cash", label: "Espèces" },
  { value: "bank_transfer", label: "Virement" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "card", label: "Carte" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["value"];
export type ExpenseMethod = (typeof EXPENSE_METHODS)[number]["value"];

export interface ExpenseRow {
  id: string;
  category: ExpenseCategory;
  label: string;
  amount: number;
  spent_at: string;
  method: ExpenseMethod;
  supplier: string | null;
  catalog_item_id: string | null;
  stock_location_id: string | null;
  qty: number | null;
  attachment_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export type ExpenseInput = {
  category: ExpenseCategory;
  label: string;
  amount: number;
  spent_at: string;
  method: ExpenseMethod;
  supplier?: string | null;
  catalog_item_id?: string | null;
  stock_location_id?: string | null;
  qty?: number | null;
  notes?: string | null;
  attachment_id?: string | null;
};

export function todayDouala(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Douala" }).format(new Date());
}

export function expenseCategoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find((item) => item.value === value)?.label ?? value;
}

export function expenseMethodLabel(value: string): string {
  return EXPENSE_METHODS.find((item) => item.value === value)?.label ?? value;
}

/** Refuse un achat de stock sans article/quantité, avant tout appel Supabase. */
export function validateExpenseInput(input: ExpenseInput): string | null {
  if (!input.label.trim()) return "Le libellé est requis.";
  if (!(Number(input.amount) > 0)) return "Le montant doit être supérieur à 0.";
  if (!input.spent_at) return "La date est requise.";
  if (input.category === "achat_stock") {
    if (!input.catalog_item_id) return "Choisissez un article pour un achat de stock.";
    if (input.qty == null || !(Number(input.qty) > 0)) return "Indiquez une quantité positive.";
  }
  return null;
}

export function toExpenseInsert(input: ExpenseInput) {
  const error = validateExpenseInput(input);
  if (error) throw new Error(error);
  const isStock = input.category === "achat_stock";
  return {
    category: input.category,
    label: input.label.trim(),
    amount: Number(input.amount),
    spent_at: input.spent_at,
    method: input.method,
    supplier: input.supplier?.trim() || null,
    catalog_item_id: isStock ? input.catalog_item_id || null : null,
    stock_location_id: isStock ? input.stock_location_id || null : null,
    qty: isStock ? Number(input.qty) : null,
    notes: input.notes?.trim() || null,
    attachment_id: input.attachment_id || null,
  };
}

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function fetchExpenses(): Promise<ExpenseRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase.from("expenses").select("*").order("spent_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as ExpenseRow[];
}

export async function createExpense(input: ExpenseInput): Promise<ExpenseRow> {
  await assertCanEditFinance();
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const payload = toExpenseInsert(input);
  const { data, error } = await supabase.from("expenses").insert(payload).select("*").single();
  throwIf(error);
  return data as ExpenseRow;
}

export async function updateExpense(id: string, input: ExpenseInput) {
  await assertCanEditFinanceRecord();
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const payload = toExpenseInsert(input);
  const { error } = await supabase.from("expenses").update(payload).eq("id", id);
  throwIf(error);
}

export async function deleteExpense(id: string) {
  await assertCanEditFinanceRecord();
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  throwIf(error);
}
