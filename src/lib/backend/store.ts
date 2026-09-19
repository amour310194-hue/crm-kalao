import { createSeedStore } from "./seed";
import { toIsoDateString } from "./period";
import type { ContactRecord, CrmResource, CrmStore, DealRecord } from "./types";

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

const CLOSED_WON_STAGE = "Closed Won";
const CLOSED_LOST_STAGE = "Closed Lost";
const PIPELINE_STAGE = "Contact Made";

function isClosedStage(stage: string) {
  return stage === CLOSED_WON_STAGE || stage === CLOSED_LOST_STAGE;
}

function dealStatus(payload: Record<string, unknown>): DealRecord["status"] {
  const raw = text(payload, "status", "Status");
  if (raw === "Won" || raw === "Lost") return raw;
  return "Open";
}

function statusFromStage(stage: string): DealRecord["status"] {
  if (stage === CLOSED_WON_STAGE) return "Won";
  if (stage === CLOSED_LOST_STAGE) return "Lost";
  return "Open";
}

function stageFromStatus(status: DealRecord["status"], currentStage?: string) {
  if (status === "Won") return CLOSED_WON_STAGE;
  if (status === "Lost") return CLOSED_LOST_STAGE;
  if (currentStage && !isClosedStage(currentStage)) return currentStage;
  return PIPELINE_STAGE;
}

function probabilityFromStatus(status: DealRecord["status"], current?: number) {
  if (status === "Won") return 100;
  if (status === "Lost") return 0;
  if (current == null || current === 0 || current === 100) return 50;
  return current;
}

function applyDealOutcome(
  payload: Record<string, unknown>,
  current?: Pick<DealRecord, "stage" | "status" | "probability">
) {
  const hasStatus = payload.status != null || payload.Status != null;
  const hasStage = payload.stage != null || payload.Stage != null;
  const stageInput = hasStage ? text(payload, "stage", "Stage") : current?.stage ?? "";
  const status = hasStatus
    ? dealStatus(payload)
    : hasStage
      ? statusFromStage(stageInput)
      : current?.status ?? "Open";
  const stage = hasStage && status === "Open" && !isClosedStage(stageInput)
    ? stageInput
    : stageFromStatus(status, current?.stage);
  return {
    status,
    stage,
    probability: probabilityFromStatus(status, current?.probability),
  };
}

export function createDeal(payload: Record<string, unknown>) {
  const outcome = applyDealOutcome(payload);
  return createRecord("deals", {
    title: text(payload, "title", "DealName", "name") || "Nouvelle affaire",
    companyId: text(payload, "companyId"),
    contactId: text(payload, "contactId"),
    leadId: text(payload, "leadId"),
    stage: outcome.stage,
    amount: numberFrom(payload, "amount", "DealValue") ?? 0,
    tags: text(payload, "tags", "Tags"),
    probability: numberFrom(payload, "probability", "Probability") ?? outcome.probability,
    expectedCloseDate:
      toIsoDateString(payload.expectedCloseDate ?? payload.ExpectedCloseDate) ??
      text(payload, "expectedCloseDate", "ExpectedCloseDate"),
    status: outcome.status,
  });
}

export function updateDeal(id: string, payload: Record<string, unknown>) {
  const existing = getById("deals", id) as DealRecord | null;
  if (!existing) return null;
  const next: Record<string, unknown> = {};
  if (payload.title != null || payload.DealName != null || payload.name != null) {
    next.title = text(payload, "title", "DealName", "name");
  }
  if (payload.companyId != null) next.companyId = text(payload, "companyId");
  if (payload.contactId != null) next.contactId = text(payload, "contactId");
  if (payload.leadId != null) next.leadId = text(payload, "leadId");
  const amount = numberFrom(payload, "amount", "DealValue");
  if (amount != null) next.amount = amount;
  if (payload.tags != null || payload.Tags != null) next.tags = text(payload, "tags", "Tags");
  if (payload.expectedCloseDate != null || payload.ExpectedCloseDate != null) {
    next.expectedCloseDate =
      toIsoDateString(payload.expectedCloseDate ?? payload.ExpectedCloseDate) ??
      text(payload, "expectedCloseDate", "ExpectedCloseDate");
  }
  const hasOutcome = payload.status != null || payload.Status != null || payload.stage != null || payload.Stage != null;
  if (hasOutcome) {
    const outcome = applyDealOutcome(payload, existing);
    next.status = outcome.status;
    next.stage = outcome.stage;
    next.probability = outcome.probability;
  }
  const probability = numberFrom(payload, "probability", "Probability");
  if (probability != null) next.probability = probability;
  return updateRecord("deals", id, next);
}

function contactStatus(payload: Record<string, unknown>, current?: ContactRecord["status"]): ContactRecord["status"] {
  const raw = text(payload, "status", "Status").toLowerCase();
  if (raw === "inactive") return "inactive";
  if (raw === "active") return "active";
  return current ?? "active";
}

function splitName(payload: Record<string, unknown>) {
  const firstName = text(payload, "firstName");
  const lastName = text(payload, "lastName");
  if (firstName || lastName) {
    return { firstName, lastName };
  }
  const name = text(payload, "Name", "name");
  const [first, ...rest] = name.split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") };
}

export function createContact(payload: Record<string, unknown>) {
  const { firstName, lastName } = splitName(payload);
  return createRecord("contacts", {
    id: `ct-${Date.now()}`,
    companyId: text(payload, "companyId"),
    firstName: firstName || "Contact",
    lastName,
    email: text(payload, "email", "Email"),
    phone: text(payload, "phone", "Phone"),
    jobTitle: text(payload, "jobTitle", "Role", "role"),
    location: text(payload, "location", "Location"),
    tags: text(payload, "tags", "Tags") || "Collab",
    rating: text(payload, "rating", "Rating") || "4.0",
    image: text(payload, "image", "Image") || "avatar-01.jpg",
    flags: text(payload, "flags", "Flags") || "fr.svg",
    status: contactStatus(payload),
  });
}

export function updateContact(id: string, payload: Record<string, unknown>) {
  const existing = getById("contacts", id) as ContactRecord | null;
  if (!existing) return null;
  const next: Record<string, unknown> = {};
  if (payload.firstName != null || payload.lastName != null || payload.Name != null || payload.name != null) {
    const { firstName, lastName } = splitName(payload);
    if (payload.firstName != null || firstName) next.firstName = firstName || existing.firstName;
    if (payload.lastName != null || payload.Name != null || payload.name != null) next.lastName = lastName;
  }
  if (payload.email != null || payload.Email != null) next.email = text(payload, "email", "Email");
  if (payload.phone != null || payload.Phone != null) next.phone = text(payload, "phone", "Phone");
  if (payload.jobTitle != null || payload.Role != null || payload.role != null) {
    next.jobTitle = text(payload, "jobTitle", "Role", "role");
  }
  if (payload.location != null || payload.Location != null) next.location = text(payload, "location", "Location");
  if (payload.companyId != null) next.companyId = text(payload, "companyId");
  if (payload.tags != null || payload.Tags != null) next.tags = text(payload, "tags", "Tags");
  if (payload.rating != null || payload.Rating != null) next.rating = text(payload, "rating", "Rating");
  if (payload.status != null || payload.Status != null) next.status = contactStatus(payload, existing.status);
  return updateRecord("contacts", id, next);
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
