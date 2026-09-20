import type { ProductsListInterface } from "@/core/json/productsListData";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type CatalogKind = "product" | "service";

export interface CatalogItem {
  id: string;
  kind: CatalogKind;
  name: string;
  sku: string | null;
  description: string | null;
  category: string | null;
  unit_price: number;
  tax_rate: number;
  status: "active" | "inactive";
  unit: string | null;
  track_stock: boolean;
  stock_qty: number | null;
  duration_minutes: number | null;
  billing_type: "one_time" | "hourly" | "daily" | "monthly" | "yearly" | null;
}

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function formatCatalogPrice(value: number): string {
  return euro.format(value);
}

export function catalogKindLabel(kind: CatalogKind): string {
  return kind === "service" ? "Service" : "Produit";
}

export function toProductsListRow(item: CatalogItem): ProductsListInterface {
  const stock =
    item.track_stock && item.stock_qty != null
      ? ` · stock ${item.stock_qty}`
      : "";
  return {
    key: item.id,
    ProductID: item.sku ? `#${item.sku}` : `#${item.id.slice(0, 8).toUpperCase()}`,
    ProductName: item.name,
    Category: item.category ?? "—",
    Kind: catalogKindLabel(item.kind),
    SKU: `${item.sku ?? "—"}${stock}`,
    UnitPrice: formatCatalogPrice(item.unit_price),
    Tax: String(item.tax_rate),
    Status: item.status === "active" ? "Active" : "Inactive",
  };
}

export async function fetchCatalogItems(): Promise<CatalogItem[] | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catalog_items")
    .select(
      "id, kind, name, sku, description, category, unit_price, tax_rate, status, unit, track_stock, stock_qty, duration_minutes, billing_type"
    )
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CatalogItem[];
}
