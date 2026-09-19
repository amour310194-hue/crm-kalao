import type { ProductsListInterface } from "@/core/json/productsListData";
import { formatCatalogPrice } from "@/lib/catalog";
import type {
  ActivityRecord,
  CatalogRecord,
  CompanyRecord,
  ContactRecord,
  CrmResource,
  DealRecord,
  InvoiceRecord,
  LeadRecord,
  QuoteLineRecord,
  QuoteRecord,
} from "./types";
import { getStore } from "./store";
import { formatDisplayDate, formatDisplayDateTime, nightsBetween, parseCrmDate, toIsoDateString } from "./period";
import { quoteTotalsFromLines } from "./quote-totals";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function companyName(id: string) {
  return getStore().companies.find((row) => row.id === id)?.name ?? "";
}

function contactName(id: string) {
  const contact = getStore().contacts.find((row) => row.id === id);
  return contact ? `${contact.firstName} ${contact.lastName}` : "";
}

function partyName(companyId?: string, contactId?: string) {
  return companyName(companyId ?? "") || contactName(contactId ?? "") || "—";
}

function companyImage(id: string) {
  return getStore().companies.find((row) => row.id === id)?.image ?? "company-icon-01.svg";
}

function leadStatusLabel(status: LeadRecord["status"]) {
  switch (status) {
    case "converted":
      return "Closed";
    case "contacted":
    case "qualified":
      return "Contacted";
    case "unqualified":
      return "Closed";
    default:
      return "Not Contacted";
  }
}

export function toCompanyRows(rows: CompanyRecord[]) {
  return rows.map((row) => ({
    ...row,
    kye: row.id,
    key: row.id,
    Image: row.image,
    Name: row.name,
    Email: row.email,
    Tags: row.tags,
    Owner: row.ownerName,
    Owner_Img: row.ownerImage,
    Status: row.status === "active" ? "Active" : "Inactive",
    Contact: row.phone,
    ClientType: "Société",
  }));
}

export function toContactRows(rows: ContactRecord[]) {
  return rows.map((row) => ({
    ...row,
    key: row.id,
    Name: `${row.firstName} ${row.lastName}`.trim(),
    Role: row.jobTitle,
    role: row.jobTitle,
    Phone: row.phone,
    Tags: row.tags,
    Location: row.location,
    Rating: row.rating,
    Image: row.image,
    Flags: row.flags,
    Status: row.status === "active" ? "Active" : "Inactive",
    ClientType: row.companyId ? "Société" : "Particulier",
  }));
}

export function toLeadRows(rows: LeadRecord[]) {
  return rows.map((row) => ({
    key: row.id,
    LeadImage: getStore().contacts.find((contact) => contact.id === row.contactId)?.image ?? "avatar-19.jpg",
    LeadName: row.title,
    CompanyName: partyName(row.companyId, row.contactId),
    Location: getStore().companies.find((company) => company.id === row.companyId)?.city
      ?? getStore().contacts.find((contact) => contact.id === row.contactId)?.location
      ?? "—",
    CompanyImage: companyImage(row.companyId),
    Phone: getStore().contacts.find((contact) => contact.id === row.contactId)?.phone ?? "",
    LeadStatus: leadStatusLabel(row.status),
    LeadOwner: row.ownerName,
    OwnerImage: row.ownerImage,
    CreatedDate: row.createdDate,
  }));
}

export function toDealRows(rows: DealRecord[]) {
  return rows.map((row) => ({
    ...row,
    key: row.id,
    DealName: row.title,
    Stage: row.stage,
    DealValue: euro.format(Number(row.amount) || 0),
    Tags: row.tags,
    ExpectedCloseDate: formatDisplayDate(row.expectedCloseDate) || row.expectedCloseDate,
    Probability: `${row.probability ?? 0}%`,
    Status: row.status,
  }));
}

export function toCatalogRows(rows: CatalogRecord[]): Array<ProductsListInterface & {
  id: string;
  name: string;
  unitPrice: number;
  taxRate: number;
  status: CatalogRecord["status"];
}> {
  return rows.map((row) => ({
    key: row.id,
    id: row.id,
    name: row.name,
    ProductID: `#${row.sku}`,
    ProductName: row.name,
    Category: row.category,
    Kind: row.kind === "service" ? "Service" : "Produit",
    SKU: row.sku,
    UnitPrice: formatCatalogPrice(row.unitPrice),
    unitPrice: row.unitPrice,
    Tax: String(row.taxRate),
    taxRate: row.taxRate,
    Status: row.status === "active" ? "Active" : "Inactive",
    status: row.status,
  }));
}

function quoteLineRows(lines: QuoteLineRecord[]) {
  return lines.map((line) => {
    const amounts = quoteTotalsFromLines([line]);
    return {
      ...line,
      key: line.id,
      ht: amounts.ht,
      tva: amounts.tva,
      ttc: amounts.ttc,
    };
  });
}

export function toQuoteRows(rows: QuoteRecord[]) {
  const store = getStore();
  return rows.map((row) => {
    const lines = store.quoteLines.filter((line) => line.quoteId === row.id);
    const totals = lines.length
      ? quoteTotalsFromLines(lines)
      : { ht: row.totalAmount, tva: row.taxAmount ?? 0, ttc: row.finalAmount };
    const invoice =
      (row.invoiceId ? store.invoices.find((item) => item.id === row.invoiceId) : undefined) ??
      store.invoices.find((item) => item.quoteId === row.id);
    return {
      ...row,
      key: row.id,
      id: row.id,
      quoteId: row.number,
      client: partyName(row.companyId),
      clientImage: `assets/img/icons/${companyImage(row.companyId)}`,
      quoteDate: formatDisplayDate(row.quoteDate) || row.quoteDate,
      validTill: formatDisplayDate(row.validTill) || row.validTill,
      quoteDateIso: toIsoDateString(row.quoteDate) ?? "",
      validTillIso: toIsoDateString(row.validTill) ?? "",
      totalAmount: euro.format(totals.ht),
      taxAmount: euro.format(totals.tva),
      finalAmount: euro.format(totals.ttc),
      discount: row.discount,
      lineCount: lines.length,
      lines: quoteLineRows(lines),
      invoiceId: invoice?.id ?? row.invoiceId ?? "",
      invoiceNumber: invoice?.number ?? "",
    };
  });
}

export function toInvoiceRows(rows: InvoiceRecord[]) {
  return rows.map((row) => ({
    Key: row.id,
    key: row.id,
    id: row.id,
    Invoice_ID: row.number,
    Client: partyName(row.companyId),
    Client_Image: companyImage(row.companyId).replace("company-icon-", "company-"),
    Project: row.project,
    project: row.project,
    Project_Image: row.projectImage,
    Due_Date: row.dueDate,
    Amount: euro.format(row.amount),
    Paid_Amount: euro.format(row.paidAmount),
    Status: row.status,
    quoteId: row.quoteId ?? "",
  }));
}

const activityTypeLabel: Record<ActivityRecord["type"], string> = {
  call: "Appel",
  email: "E-mail",
  meeting: "Réunion",
  task: "Tâche",
  note: "Note",
};

export function toActivityRows(rows: ActivityRecord[]) {
  return rows.map((row) => ({
    ...row,
    key: row.id,
    id: row.id,
    Type: activityTypeLabel[row.type] || row.type,
    Subject: row.subject,
    Company: partyName(row.companyId, row.contactId),
    company: partyName(row.companyId, row.contactId),
    DueAt: formatDisplayDateTime(parseCrmDate(row.dueAt) ?? row.dueAt),
  }));
}

export function listUi(resource: CrmResource) {
  const store = getStore();
  switch (resource) {
    case "companies":
      return toCompanyRows(store.companies);
    case "contacts":
      return toContactRows(store.contacts);
    case "leads":
      return toLeadRows(store.leads);
    case "deals":
      return toDealRows(store.deals);
    case "catalog":
      return toCatalogRows(store.catalog);
    case "quotes":
      return toQuoteRows(store.quotes);
    case "quoteLines":
      return quoteLineRows(store.quoteLines);
    case "invoices":
      return toInvoiceRows(store.invoices);
    case "activities":
      return toActivityRows(store.activities);
    case "departments":
      return store.departments.map((row) => ({
        key: row.id,
        id: row.id,
        DepartmentId: row.code,
        DepartmentName: row.name,
        HeadName: row.headName,
        HeadImage: row.headImage,
        MembersCount: row.membersCount,
        LocationFlag: "assets/img/flags/fr.svg",
        Location: row.location,
        Status: row.status === "active" ? "Active" : "Inactive",
      }));
    case "travel":
      return store.travel.map((row) => ({
        ...row,
        key: row.id,
        Client: row.accountName,
        Type: row.accountType === "individual" ? "Particulier" : "Société",
        Pax: row.pax ?? 1,
        Itinerary: row.itinerary ?? "",
        Nights: nightsBetween(row.departureDate, row.returnDate) ?? "—",
        departureDateLabel: formatDisplayDate(row.departureDate),
        returnDateLabel: formatDisplayDate(row.returnDate),
        Amount: euro.format(row.amount),
      }));
    case "immigration":
      return store.immigration.map((row) => ({
        ...row,
        key: row.id,
        Client: row.accountName,
        Type: row.accountType === "individual" ? "Particulier" : "Société",
      }));
    case "events":
      return store.events.map((row) => ({
        ...row,
        key: row.id,
        Client: row.accountName,
        Type: row.accountType === "individual" ? "Particulier" : "Société",
        Amount: euro.format(row.amount),
      }));
    case "plantations":
      return store.plantations.map((row) => ({ ...row, key: row.id }));
    case "sites":
      return store.sites.map((row) => ({
        ...row,
        key: row.id,
        Client: row.accountName,
        Type: row.accountType === "individual" ? "Particulier" : "Société",
        Amount: euro.format(row.amount),
      }));
    case "siteEquipment":
      return store.siteEquipment.map((row) => ({ ...row, key: row.id }));
    case "siteAssignments":
      return store.siteAssignments.map((row) => ({ ...row, key: row.id }));
    case "siteMilestones":
      return store.siteMilestones.map((row) => ({ ...row, key: row.id }));
    case "properties":
      return store.properties.map((row) => ({
        ...row,
        key: row.id,
        Client: row.accountName,
        Type: row.accountType === "individual" ? "Particulier" : "Société",
        Rent: euro.format(row.rent),
      }));
    case "payroll":
      return store.payroll.map((row) => ({
        ...row,
        key: row.id,
        Salary: euro.format(row.salary),
        Bonus: euro.format(row.bonus),
        Total: euro.format(row.salary + row.bonus),
      }));
    case "eventLines":
      return store.eventLines.map((row) => ({
        ...row,
        key: row.id,
        Amount: euro.format(row.quantity * row.unitPrice),
      }));
    case "leases":
      return store.leases.map((row) => ({
        ...row,
        key: row.id,
        Rent: euro.format(row.rent),
      }));
    case "payments":
      return store.payments.map((row) => ({
        ...row,
        key: row.id,
        Amount: euro.format(row.amount),
      }));
    case "attachments":
      return store.attachments.map((row) => {
        const { contentBase64: _omit, ...rest } = row;
        return { ...rest, key: row.id, url: `/api/v1/files/${row.id}` };
      });
    default:
      return [];
  }
}

export type AccountRow = {
  id: string;
  key: string;
  Name: string;
  Type: "Particulier" | "Société";
  Email: string;
  Phone: string;
  City: string;
  Tags: string;
  Status: string;
};

export type AccountDossierRow = {
  id: string;
  kind: string;
  number: string;
  title: string;
  status: string;
  href: string;
  amount: string;
};

export type AccountFiche = AccountRow & {
  deals: ReturnType<typeof toDealRows>;
  invoices: ReturnType<typeof toInvoiceRows>;
  dossiers: AccountDossierRow[];
  totals: {
    dealsCount: number;
    dealsAmount: number;
    invoicesCount: number;
    invoicesOutstanding: number;
    invoicesAmount: number;
    dossiersCount: number;
  };
};

function sameName(left: string, right: string) {
  return left.trim().toLowerCase().replace(/\s+/g, " ") === right.trim().toLowerCase().replace(/\s+/g, " ");
}

function moneyOrDash(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return euro.format(value);
}

export function getAccountRow(id: string): AccountRow | null {
  const store = getStore();
  const company = store.companies.find((row) => row.id === id);
  if (company) {
    return {
      id: company.id,
      key: company.id,
      Name: company.name,
      Type: "Société",
      Email: company.email,
      Phone: company.phone,
      City: company.city,
      Tags: company.tags,
      Status: company.status === "active" ? "Active" : "Inactive",
    };
  }
  const contact = store.contacts.find((row) => row.id === id);
  if (!contact) return null;
  return {
    id: contact.id,
    key: contact.id,
    Name: `${contact.firstName} ${contact.lastName}`.trim(),
    Type: contact.companyId ? "Société" : "Particulier",
    Email: contact.email,
    Phone: contact.phone,
    City: contact.location,
    Tags: contact.tags,
    Status: contact.status === "active" ? "Active" : "Inactive",
  };
}

export function getAccountFiche(id: string): AccountFiche | null {
  const account = getAccountRow(id);
  if (!account) return null;
  const store = getStore();
  const name = account.Name;
  const deals = store.deals.filter((row) => row.companyId === id || row.contactId === id);
  const invoices = store.invoices.filter((row) => row.companyId === id);
  const dossiers: AccountDossierRow[] = [
    ...store.travel
      .filter((row) => sameName(row.accountName, name))
      .map((row) => ({
        id: row.id,
        kind: "Voyages",
        number: row.number,
        title: row.destination,
        status: row.status,
        href: `/metiers/voyages/${row.id}`,
        amount: moneyOrDash(row.amount),
      })),
    ...store.immigration
      .filter((row) => sameName(row.accountName, name))
      .map((row) => ({
        id: row.id,
        kind: "Immigration",
        number: row.number,
        title: `${row.procedure}${row.country ? ` · ${row.country}` : ""}`,
        status: row.status,
        href: `/metiers/immigration/${row.id}`,
        amount: "—",
      })),
    ...store.events
      .filter((row) => sameName(row.accountName, name))
      .map((row) => ({
        id: row.id,
        kind: "Événements",
        number: row.number,
        title: row.title,
        status: row.status,
        href: "/metiers/evenements",
        amount: moneyOrDash(row.amount),
      })),
    ...store.sites
      .filter((row) => sameName(row.accountName, name))
      .map((row) => ({
        id: row.id,
        kind: "BTP",
        number: row.number,
        title: row.name,
        status: row.status,
        href: "/metiers/chantiers",
        amount: moneyOrDash(row.amount),
      })),
    ...store.properties
      .filter((row) => sameName(row.accountName, name))
      .map((row) => ({
        id: row.id,
        kind: "Immobilier",
        number: row.name,
        title: row.kind,
        status: row.status,
        href: "/metiers/immobilier",
        amount: moneyOrDash(row.rent),
      })),
    ...store.leases
      .filter((row) => sameName(row.tenant, name))
      .map((row) => ({
        id: row.id,
        kind: "Immobilier",
        number: row.propertyName,
        title: row.tenant,
        status: row.status,
        href: "/metiers/immobilier/baux",
        amount: moneyOrDash(row.rent),
      })),
  ];
  const invoicesOutstanding = invoices.reduce(
    (total, row) => total + Math.max(0, (Number(row.amount) || 0) - (Number(row.paidAmount) || 0)),
    0,
  );
  return {
    ...account,
    deals: toDealRows(deals),
    invoices: toInvoiceRows(invoices),
    dossiers,
    totals: {
      dealsCount: deals.length,
      dealsAmount: deals.reduce((total, row) => total + (Number(row.amount) || 0), 0),
      invoicesCount: invoices.length,
      invoicesAmount: invoices.reduce((total, row) => total + (Number(row.amount) || 0), 0),
      invoicesOutstanding,
      dossiersCount: dossiers.length,
    },
  };
}

export function toAccountRows() {
  const store = getStore();
  const companies = store.companies.map((row) => getAccountRow(row.id)!);
  const people = store.contacts.filter((row) => !row.companyId).map((row) => getAccountRow(row.id)!);
  return [...people, ...companies];
}
