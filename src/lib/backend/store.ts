import { createSeedStore } from "./seed";
import type { CrmResource, CrmStore } from "./types";

type GlobalStore = typeof globalThis & {
  __crmKalaoStore?: CrmStore;
};

const aliases: Record<string, CrmResource> = {
  companies: "companies",
  contacts: "contacts",
  leads: "leads",
  deals: "deals",
  catalog: "catalog",
  products: "catalog",
  quotes: "quotes",
  quotations: "quotes",
  invoices: "invoices",
  activities: "activities",
  departments: "departments",
  travel: "travel",
  voyages: "travel",
  immigration: "immigration",
  events: "events",
  evenements: "events",
  plantations: "plantations",
  agriculture: "plantations",
  sites: "sites",
  chantiers: "sites",
  properties: "properties",
  immobilier: "properties",
  payroll: "payroll",
  paie: "payroll",
};

export function resolveResource(name: string): CrmResource | null {
  return aliases[name] ?? null;
}

export function getStore(): CrmStore {
  const glob = globalThis as GlobalStore;
  if (!glob.__crmKalaoStore) {
    glob.__crmKalaoStore = createSeedStore();
  }
  return glob.__crmKalaoStore;
}

export function listResource(resource: CrmResource) {
  return getStore()[resource];
}

export function getById(resource: CrmResource, id: string) {
  return listResource(resource).find((row) => row.id === id) ?? null;
}

export function createRecord(resource: CrmResource, payload: Record<string, unknown>) {
  const store = getStore();
  const record = {
    id: `${resource.slice(0, 2)}-${Date.now()}`,
    ...payload,
  };
  (store[resource] as unknown[]).unshift(record);
  return record;
}

export function updateRecord(
  resource: CrmResource,
  id: string,
  payload: Record<string, unknown>
) {
  const store = getStore();
  const rows = store[resource] as Array<{ id: string }>;
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) {
    return null;
  }
  rows[index] = { ...rows[index], ...payload, id };
  return rows[index];
}

export function deleteRecord(resource: CrmResource, id: string) {
  const store = getStore();
  const rows = store[resource] as Array<{ id: string }>;
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) {
    return false;
  }
  rows.splice(index, 1);
  return true;
}

export function resetStore() {
  const glob = globalThis as GlobalStore;
  glob.__crmKalaoStore = createSeedStore();
  return glob.__crmKalaoStore;
}
