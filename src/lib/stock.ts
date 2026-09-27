import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface StockLocation {
  id: string;
  code: string;
  name: string;
  kind: string;
}

export interface StockMovement {
  id: string;
  catalog_item_id: string;
  location_id: string | null;
  qty: number;
  reason: string | null;
  created_at: string;
}

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export function qtyForItemAtLocation(
  movements: StockMovement[],
  itemId: string,
  locationId?: string | null
): number {
  return movements
    .filter((row) => row.catalog_item_id === itemId && (!locationId || row.location_id === locationId))
    .reduce((sum, row) => sum + Number(row.qty ?? 0), 0);
}

export async function fetchStockLocations(): Promise<StockLocation[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase.from("stock_locations").select("*").order("name");
  throwIf(error);
  return (data ?? []) as StockLocation[];
}

export async function fetchStockMovements(catalogItemId?: string): Promise<StockMovement[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let query = supabase.from("stock_movements").select("*").order("created_at", { ascending: false });
  if (catalogItemId) query = query.eq("catalog_item_id", catalogItemId);
  const { data, error } = await query;
  throwIf(error);
  return (data ?? []) as StockMovement[];
}

export async function createStockMovement(input: {
  catalog_item_id: string;
  location_id: string | null;
  qty: number;
  reason: string;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  if (!input.catalog_item_id) throw new Error("Choisissez un article.");
  if (!Number.isFinite(input.qty) || input.qty === 0) throw new Error("La quantité ne peut pas être nulle.");
  const { error } = await supabase.from("stock_movements").insert({
    catalog_item_id: input.catalog_item_id,
    location_id: input.location_id,
    qty: input.qty,
    reason: input.reason.trim() || "mouvement",
  });
  throwIf(error);
}
