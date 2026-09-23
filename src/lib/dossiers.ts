import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { emptyUuid, type DossierRow } from "@/lib/crm";

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function parseAmount(raw: string | number | undefined | null): number {
  if (raw === null || raw === undefined || raw === "") return 0;
  const n = Number(String(raw).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export interface DossierMilestoneRow {
  id: string;
  dossier_id: string;
  label: string;
  due_at: string | null;
  done_at: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  dossiers?: { title: string | null; kind: string | null } | null;
}

export interface DossierPurchaseRow {
  id: string;
  dossier_id: string;
  label: string;
  amount: number;
  spent_at: string | null;
  supplier: string | null;
  notes: string | null;
  created_at: string;
}

export interface DossierChecklistRow {
  id: string;
  dossier_id: string;
  label: string;
  provided: boolean;
  attachment_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface RentReceiptRow {
  id: string;
  dossier_id: string;
  period: string;
  amount: number;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
}

export async function fetchDossier(id: string): Promise<DossierRow | null> {
  const supabase = db();
  if (!supabase || !id) return null;
  const { data, error } = await supabase
    .from("dossiers")
    .select("*, companies(name), dossier_members(employee_id, employees(full_name))")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    const retry = await supabase.from("dossiers").select("*, companies(name)").eq("id", id).maybeSingle();
    throwIf(retry.error);
    return (retry.data as DossierRow) ?? null;
  }
  return (data as DossierRow) ?? null;
}

export async function updateDossier(
  id: string,
  input: {
    title?: string;
    kind?: string | null;
    company_id?: string | null;
    status?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    notes?: string | null;
  }
) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.kind !== undefined && input.kind) patch.kind = input.kind;
  if (input.company_id !== undefined) patch.company_id = emptyUuid(input.company_id);
  if (input.status !== undefined && input.status) patch.status = input.status;
  if (input.start_at !== undefined) patch.start_at = input.start_at || null;
  if (input.end_at !== undefined) patch.end_at = input.end_at || null;
  if (input.notes !== undefined) patch.notes = input.notes || null;
  if (patch.status === "done") {
    const { data: current, error: curErr } = await supabase
      .from("dossiers")
      .select("kind")
      .eq("id", id)
      .maybeSingle();
    throwIf(curErr);
    if (current?.kind === "visa") {
      const { data: items, error: chkErr } = await supabase
        .from("dossier_checklist")
        .select("provided")
        .eq("dossier_id", id);
      throwIf(chkErr);
      const pending = (items ?? []).filter((row) => !row.provided).length;
      if (pending > 0) {
        throw new Error(
          `Pièces manquantes : ${pending} pièce(s) encore en attente. Le visa ne peut pas être marqué livré.`
        );
      }
    }
  }
  const { data, error } = await supabase
    .from("dossiers")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  throwIf(error);
  return data as DossierRow;
}

export async function deleteDossier(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("dossiers").delete().eq("id", id);
  throwIf(error);
}

export async function fetchMilestones(dossierId?: string): Promise<DossierMilestoneRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase
    .from("dossier_milestones")
    .select("*, dossiers(title, kind)")
    .order("due_at", { ascending: true, nullsFirst: false });
  if (dossierId) q = q.eq("dossier_id", dossierId);
  const { data, error } = await q;
  throwIf(error);
  return (data ?? []) as DossierMilestoneRow[];
}

export async function createMilestone(input: {
  dossier_id: string;
  label: string;
  due_at?: string | null;
  notes?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("dossier_milestones")
    .insert({
      dossier_id: input.dossier_id,
      label: input.label,
      due_at: input.due_at || null,
      notes: input.notes || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as DossierMilestoneRow;
}

export async function updateMilestone(
  id: string,
  input: { label?: string; due_at?: string | null; status?: string; done_at?: string | null }
) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const patch: Record<string, unknown> = {};
  if (input.label !== undefined) patch.label = input.label;
  if (input.due_at !== undefined) patch.due_at = input.due_at || null;
  if (input.status !== undefined) patch.status = input.status;
  if (input.done_at !== undefined) patch.done_at = input.done_at || null;
  const { error } = await supabase.from("dossier_milestones").update(patch).eq("id", id);
  throwIf(error);
}

/** Bascule todo -> done et horodate la réalisation, pour que la timeline reste lisible. */
export async function toggleMilestone(row: DossierMilestoneRow) {
  const done = row.status !== "done";
  await updateMilestone(row.id, {
    status: done ? "done" : "todo",
    done_at: done ? new Date().toISOString().slice(0, 10) : null,
  });
}

export async function deleteMilestone(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("dossier_milestones").delete().eq("id", id);
  throwIf(error);
}

export async function fetchPurchases(dossierId?: string): Promise<DossierPurchaseRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase
    .from("dossier_purchases")
    .select("*")
    .order("spent_at", { ascending: false, nullsFirst: false });
  if (dossierId) q = q.eq("dossier_id", dossierId);
  const { data, error } = await q;
  throwIf(error);
  return (data ?? []) as DossierPurchaseRow[];
}

export async function createPurchase(input: {
  dossier_id: string;
  label: string;
  amount: string | number;
  spent_at?: string | null;
  supplier?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("dossier_purchases")
    .insert({
      dossier_id: input.dossier_id,
      label: input.label,
      amount: parseAmount(input.amount),
      spent_at: input.spent_at || null,
      supplier: input.supplier || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as DossierPurchaseRow;
}

export async function deletePurchase(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("dossier_purchases").delete().eq("id", id);
  throwIf(error);
}

export async function fetchChecklist(dossierId?: string): Promise<DossierChecklistRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase
    .from("dossier_checklist")
    .select("*")
    .order("created_at", { ascending: true });
  if (dossierId) q = q.eq("dossier_id", dossierId);
  const { data, error } = await q;
  throwIf(error);
  return (data ?? []) as DossierChecklistRow[];
}

export async function createChecklistItem(input: {
  dossier_id: string;
  label: string;
  notes?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("dossier_checklist")
    .insert({
      dossier_id: input.dossier_id,
      label: input.label,
      notes: input.notes || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as DossierChecklistRow;
}

export async function setChecklistProvided(
  id: string,
  provided: boolean,
  attachmentId?: string | null
) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const patch: Record<string, unknown> = { provided };
  if (attachmentId !== undefined) patch.attachment_id = attachmentId;
  const { error } = await supabase.from("dossier_checklist").update(patch).eq("id", id);
  throwIf(error);
}

export async function deleteChecklistItem(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("dossier_checklist").delete().eq("id", id);
  throwIf(error);
}

export async function fetchRentReceipts(dossierId?: string): Promise<RentReceiptRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase
    .from("rent_receipts")
    .select("*")
    .order("period", { ascending: false });
  if (dossierId) q = q.eq("dossier_id", dossierId);
  const { data, error } = await q;
  throwIf(error);
  return (data ?? []) as RentReceiptRow[];
}

export async function createRentReceipt(input: {
  dossier_id: string;
  period: string;
  amount: string | number;
  paid_at?: string | null;
  notes?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("rent_receipts")
    .insert({
      dossier_id: input.dossier_id,
      period: input.period,
      amount: parseAmount(input.amount),
      paid_at: input.paid_at || null,
      notes: input.notes || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as RentReceiptRow;
}

export async function deleteRentReceipt(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("rent_receipts").delete().eq("id", id);
  throwIf(error);
}
