import { parseCrmDate } from "./period";
import { getStore } from "./store";
import type { TravelRecord } from "./types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type TravelRow = {
  id: string;
  number: string;
  account_name: string;
  account_type: "individual" | "company";
  destination: string;
  departure_date: string | null;
  return_date: string | null;
  status: string;
  amount: number | string;
  pax: number | null;
  itinerary: string | null;
};

function formatDateOnly(value: string | null | undefined) {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }
  return value;
}

function toDateParam(value: unknown) {
  if (value == null || String(value).trim() === "") return null;
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = parseCrmDate(raw);
  if (!parsed) return null;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function text(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

function toTravelRecord(row: TravelRow): TravelRecord {
  return {
    id: row.id,
    number: row.number,
    accountName: row.account_name,
    accountType: row.account_type,
    destination: row.destination,
    departureDate: formatDateOnly(row.departure_date),
    returnDate: formatDateOnly(row.return_date),
    status: row.status,
    amount: Number(row.amount) || 0,
    pax: row.pax ?? 1,
    itinerary: row.itinerary ?? "",
  };
}

function hydrate(rows: TravelRecord[]) {
  getStore().travel = rows;
  return rows;
}

async function nextNumber() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return `VOY-${new Date().getFullYear()}-001`;
  const year = new Date().getFullYear();
  const { data } = await supabase.from("travel_dossiers").select("number").like("number", `VOY-${year}-%`);
  const max = (data ?? []).reduce((current, row) => {
    const match = String(row.number).match(/(\d+)$/);
    return Math.max(current, match ? Number(match[1]) : 0);
  }, 0);
  return `VOY-${year}-${String(max + 1).padStart(3, "0")}`;
}

export async function listTravel(): Promise<TravelRecord[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("travel_dossiers")
    .select("id, number, account_name, account_type, destination, departure_date, return_date, status, amount, pax, itinerary")
    .order("departure_date", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return hydrate((data ?? []).map((row) => toTravelRecord(row as TravelRow)));
}

export async function getTravel(id: string): Promise<TravelRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("travel_dossiers")
    .select("id, number, account_name, account_type, destination, departure_date, return_date, status, amount, pax, itinerary")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data ? toTravelRecord(data as TravelRow) : null;
}

export async function createTravel(payload: Record<string, unknown>): Promise<TravelRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const accountType = text(payload, "accountType", "Type") === "company" ? "company" : "individual";
  const insert = {
    number: text(payload, "number") || (await nextNumber()),
    account_name: text(payload, "accountName", "Client") || "Client",
    account_type: accountType,
    destination: text(payload, "destination") || "—",
    departure_date: toDateParam(payload.departureDate),
    return_date: toDateParam(payload.returnDate),
    status: text(payload, "status") || "Devis",
    amount: Number(payload.amount ?? 0) || 0,
    pax: Number(payload.pax ?? 1) || 1,
    itinerary: text(payload, "itinerary"),
  };
  const { data, error } = await supabase.from("travel_dossiers").insert(insert).select("*").single();
  if (error) {
    throw new Error(error.message);
  }
  const record = toTravelRecord(data as TravelRow);
  const store = getStore();
  store.travel = [record, ...store.travel.filter((row) => row.id !== record.id)];
  return record;
}

export async function updateTravel(id: string, payload: Record<string, unknown>): Promise<TravelRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (payload.accountName != null) patch.account_name = text(payload, "accountName", "Client");
  if (payload.accountType != null || payload.Type != null) {
    const type = text(payload, "accountType", "Type");
    patch.account_type = type === "company" || type === "Société" ? "company" : "individual";
  }
  if (payload.destination != null) patch.destination = text(payload, "destination");
  if (payload.departureDate != null) patch.departure_date = toDateParam(payload.departureDate);
  if (payload.returnDate != null) patch.return_date = toDateParam(payload.returnDate);
  if (payload.status != null) patch.status = text(payload, "status");
  if (payload.amount != null) patch.amount = Number(payload.amount) || 0;
  if (payload.pax != null) patch.pax = Number(payload.pax) || 1;
  if (payload.itinerary != null) patch.itinerary = text(payload, "itinerary");
  if (payload.number != null) patch.number = text(payload, "number");

  const { data, error } = await supabase.from("travel_dossiers").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;
  const record = toTravelRecord(data as TravelRow);
  const store = getStore();
  store.travel = store.travel.map((row) => (row.id === id ? record : row));
  return record;
}

export async function deleteTravel(id: string): Promise<boolean | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("travel_dossiers").delete().eq("id", id).select("id");
  if (error) {
    throw new Error(error.message);
  }
  const ok = Boolean(data?.length);
  if (ok) {
    getStore().travel = getStore().travel.filter((row) => row.id !== id);
  }
  return ok;
}
