import { formatDisplayDateTime } from "./period";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuditAction = "create" | "update" | "delete";

export type AuditLogRecord = {
  id: string;
  number: string;
  actor: string;
  action: AuditAction;
  resource: string;
  recordId: string;
  recordLabel: string;
  ip: string;
  createdAt: string;
};

type AuditRow = {
  id: string;
  number: string;
  actor: string;
  action: AuditAction;
  resource: string;
  record_id: string;
  record_label: string;
  ip: string;
  created_at: string;
};

type AuditGlobal = typeof globalThis & {
  __crmKalaoAuditLogs?: AuditLogRecord[];
};

const ACTION_LABEL: Record<AuditAction, string> = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
};

const MODULE_LABEL: Record<string, string> = {
  accounts: "Clients",
  companies: "Sociétés",
  contacts: "Contacts",
  leads: "Prospects",
  deals: "Affaires",
  catalog: "Catalogue",
  quotes: "Devis",
  quoteLines: "Lignes devis",
  invoices: "Factures",
  payments: "Paiements",
  activities: "Activités",
  departments: "Départements",
  travel: "Voyages",
  immigration: "Immigration",
  events: "Événements",
  eventLines: "Lignes événement",
  plantations: "Agriculture",
  sites: "Chantiers",
  siteEquipment: "Matériel",
  siteAssignments: "Équipes terrain",
  siteMilestones: "Avancement",
  properties: "Immobilier",
  leases: "Baux",
  payroll: "Paie",
  attachments: "Pièces jointes",
};

function memoryLogs() {
  const glob = globalThis as AuditGlobal;
  if (!glob.__crmKalaoAuditLogs) {
    glob.__crmKalaoAuditLogs = [];
  }
  return glob.__crmKalaoAuditLogs;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

export function recordLabel(record: unknown, fallback = "") {
  const row = asRecord(record);
  for (const key of ["number", "Name", "name", "title", "accountName", "code", "employee", "destination"]) {
    const value = row[key];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  if (row.firstName || row.lastName) {
    return `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
  }
  return fallback || String(row.id ?? "");
}

export function actorFrom(request: Request) {
  return (request.headers.get("x-crm-actor") || "Système").trim().slice(0, 120) || "Système";
}

export function ipFrom(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return (request.headers.get("x-real-ip") || "").trim().slice(0, 64);
}

function toRecord(row: AuditRow): AuditLogRecord {
  return {
    id: row.id,
    number: row.number,
    actor: row.actor,
    action: row.action,
    resource: row.resource,
    recordId: row.record_id,
    recordLabel: row.record_label,
    ip: row.ip,
    createdAt: row.created_at,
  };
}

export function toAuditUiRow(row: AuditLogRecord) {
  return {
    key: row.id,
    id: row.id,
    LogId: row.number,
    User: row.actor,
    Action: ACTION_LABEL[row.action] ?? row.action,
    Module: MODULE_LABEL[row.resource] ?? row.resource,
    RecordId: row.recordLabel || row.recordId,
    ActionDate: formatDisplayDateTime(row.createdAt),
    IpAddress: row.ip || "—",
  };
}

async function nextNumber() {
  const supabase = getSupabaseServerClient();
  const year = new Date().getFullYear();
  const prefix = `AUD-${year}-`;
  if (!supabase) {
    const max = memoryLogs().reduce((current, row) => {
      const match = row.number.match(/(\d+)$/);
      return Math.max(current, match ? Number(match[1]) : 0);
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  }
  const { data } = await supabase.from("audit_logs").select("number").like("number", `${prefix}%`);
  const max = (data ?? []).reduce((current, row) => {
    const match = String(row.number).match(/(\d+)$/);
    return Math.max(current, match ? Number(match[1]) : 0);
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export async function listAuditLogs(): Promise<{ source: "supabase" | "memory"; records: AuditLogRecord[] }> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, number, actor, action, resource, record_id, record_label, ip, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!error) {
      return { source: "supabase", records: (data ?? []).map((row) => toRecord(row as AuditRow)) };
    }
  }
  return {
    source: "memory",
    records: [...memoryLogs()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export async function writeAudit(input: {
  actor: string;
  action: AuditAction;
  resource: string;
  recordId: string;
  recordLabel: string;
  ip: string;
}) {
  const record: AuditLogRecord = {
    id: `aud-${Date.now()}`,
    number: await nextNumber(),
    actor: input.actor || "Système",
    action: input.action,
    resource: input.resource,
    recordId: input.recordId,
    recordLabel: input.recordLabel,
    ip: input.ip,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        number: record.number,
        actor: record.actor,
        action: record.action,
        resource: record.resource,
        record_id: record.recordId,
        record_label: record.recordLabel,
        ip: record.ip,
      })
      .select("id, number, actor, action, resource, record_id, record_label, ip, created_at")
      .single();
    if (!error && data) {
      return toRecord(data as AuditRow);
    }
  }

  memoryLogs().unshift(record);
  return record;
}

export async function auditMutation(
  request: Request,
  action: AuditAction,
  resource: string,
  record: unknown,
  fallbackId = "",
) {
  try {
    const row = asRecord(record);
    const id = String(row.id ?? fallbackId);
    await writeAudit({
      actor: actorFrom(request),
      action,
      resource,
      recordId: id,
      recordLabel: recordLabel(row, id),
      ip: ipFrom(request),
    });
  } catch {
    // The business write already succeeded; never fail because of the journal.
  }
}
