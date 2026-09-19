import { createSeedStore } from "./seed";
import { toIsoDateString } from "./period";
import type { CrmResource, CrmStore, DealRecord } from "./types";

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
  equipment: "siteEquipment",
  materiel: "siteEquipment",
  "site-equipment": "siteEquipment",
  siteequipment: "siteEquipment",
  assignments: "siteAssignments",
  equipes: "siteAssignments",
  "site-assignments": "siteAssignments",
  siteassignments: "siteAssignments",
  milestones: "siteMilestones",
  avancement: "siteMilestones",
  "site-milestones": "siteMilestones",
  sitemilestones: "siteMilestones",
  properties: "properties",
  immobilier: "properties",
  payroll: "payroll",
  paie: "payroll",
  payments: "payments",
  payment: "payments",
  paiements: "payments",
  paiement: "payments",
  encaissements: "payments",
  encaissement: "payments",
  leases: "leases",
  lease: "leases",
  baux: "leases",
  bail: "leases",
  loyers: "leases",
  loyer: "leases",
  eventLines: "eventLines",
  eventlines: "eventLines",
  "event-lines": "eventLines",
  event_lines: "eventLines",
  lignes: "eventLines",
  ligne: "eventLines",
  attachments: "attachments",
};

function normalizeResourceName(name: string) {
  return name.trim().replace(/^\//, "");
}

export function resolveResource(name: string): CrmResource | null {
  const raw = normalizeResourceName(name);
  return (
    aliases[raw] ??
    aliases[raw.toLowerCase()] ??
    aliases[raw.replace(/[-_]/g, "")] ??
    aliases[raw.toLowerCase().replace(/[-_]/g, "")] ??
    null
  );
}

export function getStore(): CrmStore {
  const glob = globalThis as GlobalStore;
  if (!glob.__crmKalaoStore || !glob.__crmKalaoStore.siteEquipment || !glob.__crmKalaoStore.payments) {
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

function text(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key];
    if (value != null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
}

function numberFrom(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key];
    if (value == null || value === "") continue;
    const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
}

function dealStatus(payload: Record<string, unknown>): DealRecord["status"] {
  const raw = text(payload, "status", "Status");
  if (raw === "Won" || raw === "Lost") return raw;
  return "Open";
}

export function createDeal(payload: Record<string, unknown>) {
  const status = dealStatus(payload);
  const stage =
    text(payload, "stage", "Stage") ||
    (status === "Won" ? "Closed Won" : status === "Lost" ? "Closed Lost" : "Contact Made");
  return createRecord("deals", {
    title: text(payload, "title", "DealName", "name") || "Nouvelle affaire",
    companyId: text(payload, "companyId"),
    contactId: text(payload, "contactId"),
    leadId: text(payload, "leadId"),
    stage,
    amount: numberFrom(payload, "amount", "DealValue") ?? 0,
    tags: text(payload, "tags", "Tags"),
    probability: numberFrom(payload, "probability", "Probability") ?? 0,
    expectedCloseDate:
      toIsoDateString(payload.expectedCloseDate ?? payload.ExpectedCloseDate) ??
      text(payload, "expectedCloseDate", "ExpectedCloseDate"),
    status,
  });
}

export function updateDeal(id: string, payload: Record<string, unknown>) {
  if (!getById("deals", id)) return null;
  const next: Record<string, unknown> = {};
  if (payload.title != null || payload.DealName != null || payload.name != null) {
    next.title = text(payload, "title", "DealName", "name");
  }
  if (payload.companyId != null) next.companyId = text(payload, "companyId");
  if (payload.contactId != null) next.contactId = text(payload, "contactId");
  if (payload.leadId != null) next.leadId = text(payload, "leadId");
  if (payload.stage != null || payload.Stage != null) next.stage = text(payload, "stage", "Stage");
  const amount = numberFrom(payload, "amount", "DealValue");
  if (amount != null) next.amount = amount;
  if (payload.tags != null || payload.Tags != null) next.tags = text(payload, "tags", "Tags");
  const probability = numberFrom(payload, "probability", "Probability");
  if (probability != null) next.probability = probability;
  if (payload.expectedCloseDate != null || payload.ExpectedCloseDate != null) {
    next.expectedCloseDate =
      toIsoDateString(payload.expectedCloseDate ?? payload.ExpectedCloseDate) ??
      text(payload, "expectedCloseDate", "ExpectedCloseDate");
  }
  if (payload.status != null || payload.Status != null) next.status = dealStatus(payload);
  return updateRecord("deals", id, next);
}

export function createAccount(payload: Record<string, unknown>) {
  const type = text(payload, "Type", "type", "accountType");
  const isPerson = type === "Particulier" || type === "individual";
  if (isPerson) {
    const name = text(payload, "Name", "name");
    const [firstName, ...rest] = name.split(/\s+/);
    return createRecord("contacts", {
      companyId: "",
      firstName: firstName || "Client",
      lastName: rest.join(" "),
      email: text(payload, "Email", "email"),
      phone: text(payload, "Phone", "phone"),
      jobTitle: "",
      location: text(payload, "City", "city", "location"),
      tags: text(payload, "Tags", "tags"),
      rating: "",
      image: "avatar-01.jpg",
      flags: "assets/img/flags/ci.svg",
      status: "active",
    });
  }
  return createRecord("companies", {
    name: text(payload, "Name", "name") || "Société",
    industry: text(payload, "industry") || "Services",
    website: "",
    phone: text(payload, "Phone", "phone"),
    email: text(payload, "Email", "email"),
    address: "",
    city: text(payload, "City", "city"),
    country: "Côte d'Ivoire",
    tags: text(payload, "Tags", "tags"),
    ownerName: "Super Admin Kalao",
    ownerImage: "avatar-01.jpg",
    image: "company-icon-01.svg",
    status: "active",
  });
}

function accountTarget(id: string): { resource: CrmResource; id: string } | null {
  if (getById("companies", id)) return { resource: "companies", id };
  if (getById("contacts", id)) return { resource: "contacts", id };
  return null;
}

export function updateAccount(id: string, payload: Record<string, unknown>) {
  const target = accountTarget(id);
  if (!target) return null;
  if (target.resource === "contacts") {
    const name = text(payload, "Name", "name");
    const [firstName, ...rest] = name ? name.split(/\s+/) : ["", ""];
    return updateRecord("contacts", id, {
      ...(name ? { firstName: firstName || "Client", lastName: rest.join(" ") } : {}),
      email: payload.Email ?? payload.email,
      phone: payload.Phone ?? payload.phone,
      location: payload.City ?? payload.city ?? payload.location,
      tags: payload.Tags ?? payload.tags,
    });
  }
  return updateRecord("companies", id, {
    name: payload.Name ?? payload.name,
    email: payload.Email ?? payload.email,
    phone: payload.Phone ?? payload.phone,
    city: payload.City ?? payload.city,
    tags: payload.Tags ?? payload.tags,
  });
}

export function deleteAccount(id: string) {
  const target = accountTarget(id);
  if (!target) return false;
  return deleteRecord(target.resource, id);
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
