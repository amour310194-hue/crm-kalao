import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchCatalogItems, formatCatalogPrice, type CatalogItem } from "@/lib/catalog";

export type EntityType =
  | "company"
  | "contact"
  | "quote"
  | "invoice"
  | "employee"
  | "lead"
  | "misc"
  | "dossier";

const FILE_MANAGER_ENTITY = "00000000-0000-0000-0000-000000000001";

const numberFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatMoney(value: number | null | undefined): string {
  return `${numberFmt.format(Math.round(Number(value ?? 0)))} FCFA`;
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return dateFmt.format(d);
}

export function readForm(form: HTMLFormElement): Record<string, string> {
  const data = new FormData(form);
  const out: Record<string, string> = {};
  data.forEach((value, key) => {
    if (typeof value !== "string") return;
    out[key] = out[key] ? `${out[key]},${value}` : value;
  });
  return out;
}

export function closeBootstrapChrome(from: HTMLElement) {
  const shell = from.closest(".offcanvas, .modal") as HTMLElement | null;
  if (!shell) return;
  const w = window as unknown as {
    bootstrap?: {
      Offcanvas?: { getOrCreateInstance: (el: Element) => { hide: () => void } };
      Modal?: { getOrCreateInstance: (el: Element) => { hide: () => void } };
    };
  };
  if (shell.classList.contains("offcanvas") && w.bootstrap?.Offcanvas) {
    w.bootstrap.Offcanvas.getOrCreateInstance(shell).hide();
  }
  if (shell.classList.contains("modal") && w.bootstrap?.Modal) {
    w.bootstrap.Modal.getOrCreateInstance(shell).hide();
  }
}

export function showBootstrap(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const w = window as unknown as {
    bootstrap?: {
      Modal?: { getOrCreateInstance: (el: Element) => { show: () => void } };
    };
  };
  w.bootstrap?.Modal?.getOrCreateInstance(el).show();
}

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function docNumber(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function parseAmount(raw: string | undefined): number {
  if (!raw) return 0;
  const n = Number(String(raw).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export interface CompanyRow {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
}

export interface ContactRow {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  notes: string | null;
  companies?: { name: string | null; city: string | null; country: string | null } | null;
}

export interface LeadRow {
  id: string;
  company_id: string | null;
  contact_id: string | null;
  title: string;
  source: string | null;
  status: string;
  estimated_value: number | null;
  notes: string | null;
  created_at: string;
  companies?: { name: string | null; city: string | null; country: string | null } | null;
  contacts?: { first_name: string; last_name: string; phone: string | null } | null;
  lead_affiliations?: { department_id: string; departments?: { name: string; code: string } | null }[];
}

export interface DealRow {
  id: string;
  title: string;
  company_id: string | null;
  contact_id: string | null;
  lead_id: string | null;
  stage: string;
  amount: number;
  probability: number;
  expected_close_date: string | null;
  notes: string | null;
  created_at: string;
  companies?: { name: string | null } | null;
}

export interface QuoteRow {
  id: string;
  number: string | null;
  company_id: string | null;
  contact_id: string | null;
  status: string;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  companies?: { name: string | null } | null;
  quote_lines?: {
    id: string;
    catalog_item_id: string | null;
    kind: string;
    label: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }[];
}

export interface InvoiceRow {
  id: string;
  number: string | null;
  company_id: string | null;
  quote_id: string | null;
  project: string | null;
  due_date: string | null;
  amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
  companies?: { name: string | null } | null;
}

export interface PaymentRow {
  id: string;
  invoice_id: string;
  amount: number;
  paid_at: string;
  method: string;
  transaction_id: string | null;
  invoices?: {
    number: string | null;
    due_date: string | null;
    companies?: { name: string | null } | null;
  } | null;
}

export interface ActivityRow {
  id: string;
  type: string;
  subject: string;
  company_id: string | null;
  contact_id: string | null;
  deal_id: string | null;
  due_at: string | null;
  created_at: string;
  notes: string | null;
}

export interface DepartmentRow {
  id: string;
  code: string;
  name: string;
  head_name: string | null;
  head_image: string | null;
  members_count: string | null;
  location: string | null;
  status: string;
}

export interface EmployeeRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  status: string;
  employee_assignments?: {
    is_primary: boolean;
    departments?: { id: string; name: string; code: string } | null;
  }[];
}

export interface AttachmentRow {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  bucket_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  url?: string;
}

export interface StockLocation {
  id: string;
  code: string;
  name: string;
  kind: string;
}

const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "Not Contacted",
  contacted: "Contacted",
  qualified: "Closed",
  unqualified: "Closed",
  converted: "Closed",
};

const DEAL_STAGE_LABEL: Record<string, string> = {
  qualification: "Qualify To Buy",
  proposal: "Proposal Made",
  negotiation: "Contact Made",
  won: "Qualify To Buy",
  lost: "Proposal Made",
};

const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  call: "Calls",
  email: "Email",
  meeting: "Meeting",
  task: "Task",
  note: "Task",
};

const DEPT_TONE: Record<string, string> = {
  "DEP-COM": "warning",
  "DEP-BTP": "danger",
  "DEP-AGR": "success",
  "DEP-EVE": "info",
  "DEP-VOY": "info",
};

export async function fetchCompanies(): Promise<CompanyRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase.from("companies").select("*").order("name");
  throwIf(error);
  return (data ?? []) as CompanyRow[];
}

export async function createCompany(input: Partial<CompanyRow> & { name: string }) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase.from("companies").insert(input).select("*").single();
  throwIf(error);
  return data as CompanyRow;
}

export async function updateCompany(id: string, input: Partial<CompanyRow>) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("companies").update(input).eq("id", id);
  throwIf(error);
}

export async function deleteCompany(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("companies").delete().eq("id", id);
  throwIf(error);
}

export function toCompaniesListRow(row: CompanyRow, index: number) {
  const icons = [
    "company-icon-01.svg",
    "company-icon-02.svg",
    "company-icon-03.svg",
    "company-icon-04.svg",
    "company-icon-05.svg",
  ];
  return {
    key: row.id,
    kye: row.id,
    Image: icons[index % icons.length],
    Name: row.name,
    Email: row.email ?? "—",
    Tags: row.industry || "Collab",
    Owner: row.city || "Kalao",
    Owner_Img: "avatar-01.jpg",
    Status: "Active",
    Phone: row.phone ?? "—",
    Location: row.city || row.country || "Douala",
  };
}

export async function fetchContacts(): Promise<ContactRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("contacts")
    .select("*, companies(name, city, country)")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as ContactRow[];
}

export async function createContact(input: {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  job_title?: string | null;
  company_id?: string | null;
  notes?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase.from("contacts").insert(input).select("*").single();
  throwIf(error);
  return data as ContactRow;
}

export async function updateContact(id: string, input: Partial<ContactRow>) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("contacts").update(input).eq("id", id);
  throwIf(error);
}

export async function deleteContact(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  throwIf(error);
}

export function toContactsListRow(row: ContactRow, index: number) {
  const avatars = [
    "avatar-19.jpg",
    "avatar-20.jpg",
    "avatar-21.jpg",
    "avatar-23.jpg",
    "avatar-16.jpg",
  ];
  return {
    key: row.id,
    Name: `${row.first_name} ${row.last_name}`.trim(),
    Role: row.job_title ?? row.companies?.name ?? "Contact",
    role: row.job_title ?? row.companies?.name ?? "Contact",
    Phone: row.phone ?? "—",
    Tags: "Collab",
    Location: row.companies?.city || row.companies?.country || "Douala",
    Rating: "4.5",
    Image: avatars[index % avatars.length],
    Flags: "cm.svg",
    Status: "Active",
    Email: row.email ?? "—",
  };
}

export async function fetchLeads(): Promise<LeadRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("leads")
    .select(
      "*, companies(name, city, country), contacts(first_name, last_name, phone), lead_affiliations(department_id, departments(name, code))"
    )
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as LeadRow[];
}

export async function createLead(input: {
  title: string;
  company_id?: string | null;
  contact_id?: string | null;
  source?: string | null;
  status?: string;
  estimated_value?: number;
  notes?: string | null;
  department_ids?: string[];
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { department_ids, ...lead } = input;
  const { data, error } = await supabase
    .from("leads")
    .insert({
      title: lead.title,
      company_id: lead.company_id || null,
      contact_id: lead.contact_id || null,
      source: lead.source || null,
      status: lead.status || "new",
      estimated_value: lead.estimated_value ?? 0,
      notes: lead.notes || null,
    })
    .select("*")
    .single();
  throwIf(error);
  const created = data as LeadRow;
  const ids = [...new Set((department_ids ?? []).filter(Boolean))];
  if (ids.length) {
    const { error: affErr } = await supabase.from("lead_affiliations").insert(
      ids.map((department_id) => ({ lead_id: created.id, department_id }))
    );
    throwIf(affErr);
  }
  return created;
}

export async function updateLead(id: string, input: Partial<LeadRow> & { department_ids?: string[] }) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { department_ids, ...lead } = input;
  const { error } = await supabase.from("leads").update(lead).eq("id", id);
  throwIf(error);
  if (department_ids) {
    await supabase.from("lead_affiliations").delete().eq("lead_id", id);
    const ids = [...new Set(department_ids.filter(Boolean))];
    if (ids.length) {
      const { error: affErr } = await supabase
        .from("lead_affiliations")
        .insert(ids.map((department_id) => ({ lead_id: id, department_id })));
      throwIf(affErr);
    }
  }
}

export async function deleteLead(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("leads").delete().eq("id", id);
  throwIf(error);
}

export function leadAffiliationNames(row: LeadRow): string {
  const names = (row.lead_affiliations ?? [])
    .map((a) => a.departments?.name)
    .filter(Boolean) as string[];
  return names.join(" · ") || row.companies?.city || "—";
}

export function toLeadsListRow(row: LeadRow, index: number) {
  const avatars = ["avatar-19.jpg", "avatar-20.jpg", "avatar-21.jpg", "avatar-23.jpg"];
  return {
    key: row.id,
    LeadImage: avatars[index % avatars.length],
    LeadName: row.title,
    CompanyName: row.companies?.name ?? "—",
    Location: leadAffiliationNames(row),
    CompanyImage: "company-icon-01.svg",
    Phone: row.contacts?.phone ?? "—",
    LeadStatus: LEAD_STATUS_LABEL[row.status] ?? row.status,
    LeadOwner: "Kalao",
    OwnerImage: "avatar-13.jpg",
    CreatedDate: formatDate(row.created_at),
  };
}

export async function fetchDeals(): Promise<DealRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("deals")
    .select("*, companies(name)")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as DealRow[];
}

export async function createDeal(input: {
  title: string;
  company_id?: string | null;
  contact_id?: string | null;
  lead_id?: string | null;
  stage?: string;
  amount?: number;
  probability?: number;
  notes?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const stage =
    input.stage === "Won" ? "won" : input.stage === "Lost" ? "lost" : input.stage || "qualification";
  const { data, error } = await supabase
    .from("deals")
    .insert({
      title: input.title,
      company_id: input.company_id || null,
      contact_id: input.contact_id || null,
      lead_id: input.lead_id || null,
      stage,
      amount: input.amount ?? 0,
      probability: input.probability ?? 10,
      notes: input.notes || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as DealRow;
}

export async function updateDeal(id: string, input: Partial<DealRow>) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("deals").update(input).eq("id", id);
  throwIf(error);
}

export async function deleteDeal(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("deals").delete().eq("id", id);
  throwIf(error);
}

export function toDealsListRow(row: DealRow) {
  return {
    key: row.id,
    DealName: row.title,
    Stage: DEAL_STAGE_LABEL[row.stage] ?? row.stage,
    DealValue: formatMoney(row.amount),
    Tags: "Collab",
    ExpectedCloseDate: formatDate(row.expected_close_date),
    Probability: `${row.probability}%`,
    Status: row.stage === "won" ? "Won" : row.stage === "lost" ? "Lost" : "Won",
  };
}

export function toPipelineRows(deals: DealRow[]) {
  const groups: Record<string, DealRow[]> = {};
  for (const deal of deals) {
    const label = DEAL_STAGE_LABEL[deal.stage] ?? deal.stage;
    groups[label] = groups[label] || [];
    groups[label].push(deal);
  }
  return Object.entries(groups).map(([name, rows], index) => ({
    key: name,
    PipelineName: name,
    TotalDealValue: formatMoney(rows.reduce((s, d) => s + Number(d.amount || 0), 0)),
    NoofDeals: String(rows.length),
    Stages: name,
    CreatedDate: formatDate(rows[0]?.created_at),
    Status: "Active",
    _index: index,
  }));
}

function quoteTotals(quote: QuoteRow) {
  const lines = quote.quote_lines ?? [];
  const total = lines.reduce((s, l) => s + Number(l.quantity) * Number(l.unit_price), 0);
  const final = lines.reduce(
    (s, l) => s + Number(l.quantity) * Number(l.unit_price) * (1 + Number(l.tax_rate) / 100),
    0
  );
  return { total, final };
}

export async function fetchQuotes(): Promise<QuoteRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("quotes")
    .select("*, companies(name), quote_lines(id, catalog_item_id, kind, label, quantity, unit_price, tax_rate)")
    .order("created_at", { ascending: false });
  if (error) {
    const retry = await supabase
      .from("quotes")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });
    throwIf(retry.error);
    return (retry.data ?? []) as QuoteRow[];
  }
  return (data ?? []) as QuoteRow[];
}

export async function createQuote(input: {
  company_id?: string | null;
  notes?: string | null;
  valid_until?: string | null;
  lines: {
    catalog_item_id?: string | null;
    kind: "product" | "service";
    label: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }[];
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("quotes")
    .insert({
      number: docNumber("QUO"),
      company_id: input.company_id || null,
      notes: input.notes || null,
      valid_until: input.valid_until || null,
      status: "draft",
    })
    .select("*")
    .single();
  throwIf(error);
  const quote = data as QuoteRow;
  if (input.lines.length) {
    const { error: lineErr } = await supabase.from("quote_lines").insert(
      input.lines.map((line) => ({
        quote_id: quote.id,
        catalog_item_id: line.catalog_item_id || null,
        kind: line.kind,
        label: line.label,
        quantity: line.quantity,
        unit_price: line.unit_price,
        tax_rate: line.tax_rate,
      }))
    );
    throwIf(lineErr);
  }
  return quote;
}

export async function acceptQuote(quoteId: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("quotes")
    .select("*, quote_lines(*), companies(name)")
    .eq("id", quoteId)
    .single();
  throwIf(error);
  const quote = data as QuoteRow;
  const { final } = quoteTotals(quote);
  const { error: stErr } = await supabase
    .from("quotes")
    .update({ status: "accepted" })
    .eq("id", quoteId);
  throwIf(stErr);

  const { data: existing } = await supabase
    .from("invoices")
    .select("id")
    .eq("quote_id", quoteId)
    .maybeSingle();
  if (!existing) {
    const { error: invErr } = await supabase.from("invoices").insert({
      number: docNumber("INV"),
      company_id: quote.company_id,
      contact_id: quote.contact_id,
      quote_id: quote.id,
      project: quote.number ?? "Devis accepté",
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      amount: final,
      paid_amount: 0,
      status: "unpaid",
    });
    throwIf(invErr);
  }

  const locations = await fetchStockLocations();
  const boutique = locations?.find((l) => l.code === "LOC-BOUT") ?? locations?.[0];
  const catalog = (await fetchCatalogItems()) ?? [];
  for (const line of quote.quote_lines ?? []) {
    if (!line.catalog_item_id) continue;
    const item = catalog.find((c) => c.id === line.catalog_item_id);
    if (!item?.track_stock) continue;
    await moveStock({
      catalog_item_id: item.id,
      location_id: boutique?.id,
      qty: -Number(line.quantity),
      reason: `Devis ${quote.number} accepté`,
    });
  }
}

export async function deleteQuote(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("quotes").delete().eq("id", id);
  throwIf(error);
}

export function toQuotationsListRow(row: QuoteRow) {
  const { total, final } = quoteTotals(row);
  return {
    key: row.id,
    quoteId: row.number ? `#${row.number}` : `#${row.id.slice(0, 8)}`,
    client: row.companies?.name ?? "—",
    clientImage: "assets/img/icons/company-icon-01.svg",
    quoteDate: formatDate(row.created_at),
    validTill: formatDate(row.valid_until),
    totalAmount: formatMoney(total),
    discount: row.status === "accepted" ? "Accepté" : "0%",
    finalAmount: formatMoney(final),
  };
}

export async function fetchInvoices(): Promise<InvoiceRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("invoices")
    .select("*, companies(name)")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as InvoiceRow[];
}

export async function createInvoice(input: {
  company_id?: string | null;
  project?: string | null;
  amount: number;
  due_date?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      number: docNumber("INV"),
      company_id: input.company_id || null,
      project: input.project || null,
      amount: input.amount,
      paid_amount: 0,
      status: "unpaid",
      due_date: input.due_date || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as InvoiceRow;
}

export async function deleteInvoice(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  throwIf(error);
}

export async function recordPayment(input: {
  invoice_id: string;
  amount: number;
  method?: string;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("payments").insert({
    invoice_id: input.invoice_id,
    amount: input.amount,
    method: input.method || "cash",
    transaction_id: docNumber("TXN"),
  });
  throwIf(error);
}

export async function markInvoicePaid(invoice: InvoiceRow, partial = false) {
  const remaining = Math.max(0, Number(invoice.amount) - Number(invoice.paid_amount));
  const amount = partial ? Math.max(remaining / 2, 0.01) : remaining;
  if (amount <= 0) return;
  await recordPayment({ invoice_id: invoice.id, amount });
}

export function toInvoicesListRow(row: InvoiceRow) {
  const statusMap: Record<string, string> = {
    paid: "Paid",
    partially_paid: "Partially Paid",
    unpaid: "Unpaid",
    overdue: "Unpaid",
  };
  return {
    Key: row.id,
    key: row.id,
    Invoice_ID: row.number ? `#${row.number}` : `#${row.id.slice(0, 8)}`,
    Client: row.companies?.name ?? "—",
    Client_Image: "company-01.svg",
    Project: row.project ?? "—",
    project: row.project ?? "—",
    Project_Image: "project-01.svg",
    Due_Date: formatDate(row.due_date),
    Amount: formatMoney(row.amount),
    Paid_Amount: formatMoney(row.paid_amount),
    Status: statusMap[row.status] ?? row.status,
    amountValue: Number(row.amount),
    paidValue: Number(row.paid_amount),
  };
}

export async function fetchPayments(): Promise<PaymentRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("payments")
    .select("*, invoices(number, due_date, companies(name))")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as PaymentRow[];
}

export function toPaymentsListRow(row: PaymentRow) {
  return {
    key: row.id,
    InvoiceID: row.invoices?.number ? `#${row.invoices.number}` : "—",
    Image: "company-icon-01.svg",
    Client: row.invoices?.companies?.name ?? "—",
    Amount: formatMoney(row.amount),
    DueDate: formatDate(row.invoices?.due_date),
    Due_Date: formatDate(row.invoices?.due_date),
    PaymentMethod: row.method === "cash" ? "Cash" : "Credit",
    TransactionID: row.transaction_id ?? "—",
  };
}

export async function fetchActivities(): Promise<ActivityRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as ActivityRow[];
}

export async function createActivity(input: {
  type: string;
  subject: string;
  company_id?: string | null;
  contact_id?: string | null;
  deal_id?: string | null;
  notes?: string | null;
  due_at?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const typeMap: Record<string, string> = {
    call: "call",
    calls: "call",
    mail: "email",
    email: "email",
    task: "task",
    meeting: "meeting",
    note: "note",
  };
  const { data, error } = await supabase
    .from("activities")
    .insert({
      type: typeMap[input.type.toLowerCase()] ?? "task",
      subject: input.subject,
      company_id: input.company_id || null,
      contact_id: input.contact_id || null,
      deal_id: input.deal_id || null,
      notes: input.notes || null,
      due_at: input.due_at || new Date().toISOString(),
    })
    .select("*")
    .single();
  throwIf(error);
  return data as ActivityRow;
}

export async function deleteActivity(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("activities").delete().eq("id", id);
  throwIf(error);
}

export function toActivitiesListRow(row: ActivityRow) {
  return {
    key: row.id,
    Title: row.subject,
    ActivityType: ACTIVITY_TYPE_LABEL[row.type] ?? "Task",
    DueDate: formatDate(row.due_at ?? row.created_at),
    Owner: "Kalao",
    CreatedAt: formatDate(row.created_at),
    Image: "avatar-01.jpg",
  };
}

export async function fetchDepartments(): Promise<DepartmentRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase.from("departments").select("*").order("name");
  throwIf(error);
  return (data ?? []) as DepartmentRow[];
}

export function toDepartmentsListRow(row: DepartmentRow) {
  return {
    key: row.id,
    DepartmentId: `#${row.code}`,
    DepartmentName: row.name,
    HeadName: row.head_name || "Kalao",
    HeadImage: row.head_image || "assets/img/profiles/avatar-14.jpg",
    MembersCount: row.members_count || "0 Members",
    LocationFlag: "assets/img/flags/cm.svg",
    Location: row.location || "Douala",
    Status: row.status === "active" ? "Active" : row.status,
  };
}

export async function fetchEmployees(): Promise<EmployeeRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("employees")
    .select("*, employee_assignments(is_primary, departments(id, name, code))")
    .order("full_name");
  throwIf(error);
  return (data ?? []) as EmployeeRow[];
}

export async function createEmployee(input: {
  full_name: string;
  email?: string | null;
  phone?: string | null;
  job_title?: string | null;
  department_ids?: string[];
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { department_ids, ...emp } = input;
  const { data, error } = await supabase.from("employees").insert(emp).select("*").single();
  throwIf(error);
  const created = data as EmployeeRow;
  const ids = [...new Set((department_ids ?? []).filter(Boolean))];
  if (ids.length) {
    const { error: aErr } = await supabase.from("employee_assignments").insert(
      ids.map((department_id, i) => ({
        employee_id: created.id,
        department_id,
        is_primary: i === 0,
      }))
    );
    throwIf(aErr);
  }
  return created;
}

export async function deleteEmployee(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase.from("employees").delete().eq("id", id);
  throwIf(error);
}

export function toStaffListRow(row: EmployeeRow, index: number) {
  const avatars = [
    "assets/img/profiles/avatar-15.jpg",
    "assets/img/profiles/avatar-05.jpg",
    "assets/img/profiles/avatar-01.jpg",
  ];
  const deps = (row.employee_assignments ?? [])
    .map((a) => a.departments)
    .filter(Boolean) as { name: string; code: string }[];
  const primary = deps[0];
  return {
    key: row.id,
    EmployeeId: `#EM${row.id.slice(0, 4).toUpperCase()}`,
    EmployeeName: row.full_name,
    EmployeeImage: avatars[index % avatars.length],
    Role: row.job_title ?? "Collaborateur",
    Department: deps.map((d) => d.name).join(" · ") || "—",
    DepartmentTone: DEPT_TONE[primary?.code ?? ""] || "info",
    Email: row.email ?? "—",
    Phone: row.phone ?? "—",
    LocationFlag: "assets/img/flags/cm.svg",
    LocationName: "Douala",
    Status: row.status === "active" ? "Active" : "Inactive",
  };
}

export async function fetchStockLocations(): Promise<StockLocation[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase.from("stock_locations").select("*").order("name");
  throwIf(error);
  return (data ?? []) as StockLocation[];
}

export async function createCatalogItem(input: {
  name: string;
  sku?: string | null;
  category?: string | null;
  unit_price: number;
  tax_rate: number;
  kind?: "product" | "service";
  description?: string | null;
  opening_stock?: number;
  location_id?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const opening = input.opening_stock ?? 0;
  const { data, error } = await supabase
    .from("catalog_items")
    .insert({
      kind: input.kind || "product",
      name: input.name,
      sku: input.sku || null,
      category: input.category || null,
      unit_price: input.unit_price,
      tax_rate: input.tax_rate,
      description: input.description || null,
      status: "active",
      track_stock: opening > 0,
      stock_qty: opening,
    })
    .select("*")
    .single();
  throwIf(error);
  const item = data as CatalogItem;
  if (opening > 0) {
    await moveStock({
      catalog_item_id: item.id,
      location_id: input.location_id,
      qty: opening,
      reason: "stock initial",
    });
  }
  return item;
}

export async function moveStock(input: {
  catalog_item_id: string;
  location_id?: string | null;
  qty: number;
  reason?: string;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  let locationId = input.location_id;
  if (!locationId) {
    const locs = await fetchStockLocations();
    locationId = locs?.[0]?.id ?? null;
  }
  const { error } = await supabase.from("stock_movements").insert({
    catalog_item_id: input.catalog_item_id,
    location_id: locationId,
    qty: input.qty,
    reason: input.reason || "mouvement",
  });
  throwIf(error);
}

export async function fetchAttachments(entityType?: EntityType, entityId?: string) {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase.from("attachments").select("*").order("created_at", { ascending: false });
  if (entityType) q = q.eq("entity_type", entityType);
  if (entityId) q = q.eq("entity_id", entityId);
  const { data, error } = await q;
  throwIf(error);
  const rows = (data ?? []) as AttachmentRow[];
  return Promise.all(
    rows.map(async (row) => {
      const { data: signed } = await supabase.storage
        .from("attachments")
        .createSignedUrl(row.bucket_path, 3600);
      return { ...row, url: signed?.signedUrl };
    })
  );
}

export async function uploadAttachment(input: {
  file: File;
  entity_type: EntityType;
  entity_id?: string;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const entityId = input.entity_id || FILE_MANAGER_ENTITY;
  const path = `${input.entity_type}/${entityId}/${Date.now()}-${input.file.name}`;
  const { error: upErr } = await supabase.storage.from("attachments").upload(path, input.file, {
    upsert: false,
  });
  throwIf(upErr);
  const { data, error } = await supabase
    .from("attachments")
    .insert({
      entity_type: input.entity_type,
      entity_id: entityId,
      bucket_path: path,
      file_name: input.file.name,
      mime_type: input.file.type,
      size_bytes: input.file.size,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as AttachmentRow;
}

export async function resolveDepartmentIds(
  values: Array<string | undefined | null>,
  departments: DepartmentRow[]
): Promise<string[]> {
  const ids: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const match = departments.find(
      (d) =>
        d.id === value ||
        d.code === value ||
        d.name.toLowerCase() === value.toLowerCase() ||
        d.name.toLowerCase().includes(value.toLowerCase())
    );
    if (match) ids.push(match.id);
  }
  return [...new Set(ids)];
}

export function emptyUuid(value?: string | null) {
  if (!value || value === "Select" || value === "Choose") return null;
  return value;
}

export type DossierKind =
  | "chantier"
  | "plantation"
  | "evenement"
  | "voyage"
  | "visa"
  | "bien";

export interface DossierRow {
  id: string;
  kind: DossierKind;
  company_id: string | null;
  contact_id: string | null;
  title: string;
  status: string;
  start_at: string | null;
  end_at: string | null;
  notes: string | null;
  quote_id: string | null;
  companies?: { name: string | null } | null;
  dossier_members?: { employee_id: string; employees?: { full_name: string } | null }[];
}

export interface PayRunRow {
  id: string;
  employee_id: string;
  period: string;
  amount: number;
  bonus: number;
  status: string;
  paid_at: string | null;
  notes: string | null;
  employees?: { full_name: string | null; job_title: string | null } | null;
}

const PROJECT_KINDS: DossierKind[] = ["chantier", "plantation", "voyage", "visa"];

const KIND_PRIORITY: Record<string, string> = {
  chantier: "High",
  plantation: "Medium",
  voyage: "Low",
  visa: "High",
  evenement: "Medium",
  bien: "Low",
};

const KIND_STAGE: Record<string, string> = {
  plan: "Plan",
  design: "Design",
  develop: "Develop",
  done: "Completed",
};

const PROJECT_IMAGES = [
  "project-01.svg",
  "project-02.svg",
  "project-03.svg",
  "project-04.svg",
  "project-05.svg",
];

function parseKind(raw?: string | null): DossierKind {
  const v = (raw || "").toLowerCase().trim();
  if (["chantier", "plantation", "evenement", "voyage", "visa", "bien"].includes(v)) {
    return v as DossierKind;
  }
  if (v.includes("plant")) return "plantation";
  if (v.includes("voyag") || v.includes("circuit")) return "voyage";
  if (v.includes("visa") || v.includes("immig")) return "visa";
  if (
    v.includes("even") ||
    v.includes("mariage") ||
    v.includes("campaign") ||
    v.includes("photo") ||
    v.includes("location")
  ) {
    return "evenement";
  }
  if (v.includes("bien") || v.includes("bail") || v.includes("immo")) return "bien";
  return "chantier";
}

export async function fetchDossiers(kind?: DossierKind | DossierKind[]): Promise<DossierRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  let q = supabase
    .from("dossiers")
    .select("*, companies(name), dossier_members(employee_id, employees(full_name))")
    .order("created_at", { ascending: false });
  if (kind) {
    const kinds = Array.isArray(kind) ? kind : [kind];
    q = q.in("kind", kinds);
  }
  const { data, error } = await q;
  if (error) {
    const retry = await supabase.from("dossiers").select("*, companies(name)").order("created_at", { ascending: false });
    throwIf(retry.error);
    let rows = (retry.data ?? []) as DossierRow[];
    if (kind) {
      const kinds = Array.isArray(kind) ? kind : [kind];
      rows = rows.filter((r) => kinds.includes(r.kind));
    }
    return rows;
  }
  return (data ?? []) as DossierRow[];
}

export async function createDossier(input: {
  title: string;
  kind?: string | null;
  company_id?: string | null;
  notes?: string | null;
  employee_id?: string | null;
  catalog_item_id?: string | null;
  quote_id?: string | null;
  start_at?: string | null;
  end_at?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const kind = parseKind(input.kind);
  const companyId = emptyUuid(input.company_id);
  let quoteId = emptyUuid(input.quote_id);
  const catalogId = emptyUuid(input.catalog_item_id);
  if (!quoteId && catalogId) {
    const catalog = (await fetchCatalogItems()) ?? [];
    const item = catalog.find((c) => c.id === catalogId);
    if (item) {
      const quote = await createQuote({
        company_id: companyId,
        notes: `Dossier ${input.title}`,
        lines: [
          {
            catalog_item_id: item.id,
            kind: item.kind,
            label: item.name,
            quantity: 1,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate,
          },
        ],
      });
      quoteId = quote.id;
      if (item.track_stock) {
        await moveStock({
          catalog_item_id: item.id,
          qty: -1,
          reason: `Dossier ${input.title}`,
        });
      }
    }
  }
  const { data, error } = await supabase
    .from("dossiers")
    .insert({
      title: input.title,
      kind,
      company_id: companyId,
      notes: input.notes || null,
      quote_id: quoteId,
      status: "plan",
      start_at: input.start_at || null,
      end_at: input.end_at || null,
    })
    .select("*")
    .single();
  throwIf(error);
  const created = data as DossierRow;
  const employeeId = emptyUuid(input.employee_id);
  if (employeeId) {
    await supabase.from("dossier_members").insert({
      dossier_id: created.id,
      employee_id: employeeId,
    });
  }
  if (catalogId) {
    await supabase.from("dossier_assets").insert({
      dossier_id: created.id,
      catalog_item_id: catalogId,
      qty: 1,
    });
  }
  if (kind === "visa") {
    await createActivity({
      type: "task",
      subject: `Echeance ${input.title}`,
      company_id: companyId,
      notes: "Dossier visa V2",
      due_at: input.end_at || undefined,
    });
  }
  return created;
}

export function projectKindsFromQuery(raw?: string | null): DossierKind | DossierKind[] {
  if (raw && PROJECT_KINDS.includes(raw as DossierKind)) return raw as DossierKind;
  return PROJECT_KINDS;
}

export function toProjectsListRow(row: DossierRow, index: number) {
  return {
    key: row.id,
    Name: row.title,
    Image: PROJECT_IMAGES[index % PROJECT_IMAGES.length],
    Client: row.companies?.name ?? "Kalao",
    ClientImage: "company-01.svg",
    Priority: KIND_PRIORITY[row.kind] ?? "Medium",
    StartDate: formatDate(row.start_at),
    EndDate: formatDate(row.end_at),
    PipelineStage: KIND_STAGE[row.status] ?? row.status,
    Status: row.status === "done" ? "Inactive" : "Active",
    Kind: row.kind,
  };
}

export function toCampaignListRow(row: DossierRow) {
  const members = row.dossier_members?.length ?? 0;
  return {
    key: row.id,
    Name: row.title,
    Type: row.notes || "Événement",
    Progress1: "40.5% ",
    Progress2: "20.5%",
    Progress3: "30.5%",
    Progress4: "70.5%",
    Progress5: "35.0%",
    Members: members ? `${members}` : "1+",
    Status: row.status === "done" ? "Success" : "Running",
  };
}

export function toContractsListRow(row: DossierRow) {
  return {
    key: row.id,
    ContractID: `#${row.id.slice(0, 8).toUpperCase()}`,
    Subject: row.title,
    Customer: row.companies?.name ?? "Kalao",
    Image: "company-icon-01.svg",
    ContractType: row.notes || "Bail",
    StartDate: formatDate(row.start_at),
    EndDate: formatDate(row.end_at),
  };
}

export async function fetchPayRuns(): Promise<PayRunRow[] | null> {
  const supabase = db();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("pay_runs")
    .select("*, employees(full_name, job_title)")
    .order("created_at", { ascending: false });
  throwIf(error);
  return (data ?? []) as PayRunRow[];
}

export async function createPayRun(input: {
  employee_id: string;
  period?: string;
  amount: number;
  bonus?: number;
  notes?: string | null;
}) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { data, error } = await supabase
    .from("pay_runs")
    .insert({
      employee_id: input.employee_id,
      period: input.period || new Date().toISOString().slice(0, 7),
      amount: input.amount,
      bonus: input.bonus ?? 0,
      status: "due",
      notes: input.notes || null,
    })
    .select("*")
    .single();
  throwIf(error);
  return data as PayRunRow;
}

export async function markPayRunPaid(id: string) {
  const supabase = db();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  const { error } = await supabase
    .from("pay_runs")
    .update({ status: "paid", paid_at: new Date().toISOString().slice(0, 10) })
    .eq("id", id);
  throwIf(error);
}

export function toTimesheetRow(row: PayRunRow, index: number) {
  const avatars = ["avatar-14.jpg", "avatar-15.jpg", "avatar-05.jpg"];
  return {
    key: row.id,
    TimesheetID: `#PAY${row.id.slice(0, 4).toUpperCase()}`,
    EmployeeName: row.employees?.full_name ?? "Collaborateur",
    Role: row.employees?.job_title ?? "Kalao",
    EmployeeImage: avatars[index % avatars.length],
    ProjectName: row.period,
    ProjectImage: "time-icon-1.svg",
    Task: row.notes || (row.bonus ? `Prime ${formatMoney(row.bonus)}` : "Salaire"),
    CreatedDate: formatDate(row.paid_at || row.period),
    HoursWorked: formatMoney(Number(row.amount) + Number(row.bonus || 0)),
    Status: row.status === "paid" ? "Approved" : "Pending",
  };
}

export const PROJECT_KIND_FILTERS = PROJECT_KINDS;

export { parseAmount, FILE_MANAGER_ENTITY };
