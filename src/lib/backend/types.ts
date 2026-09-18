export type CatalogKind = "product" | "service";

export type CompanyRecord = {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  tags: string;
  ownerName: string;
  ownerImage: string;
  image: string;
  status: "active" | "inactive";
};

export type ContactRecord = {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  location: string;
  tags: string;
  rating: string;
  image: string;
  flags: string;
  status: "active" | "inactive";
};

export type LeadRecord = {
  id: string;
  companyId: string;
  contactId: string;
  title: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "unqualified" | "converted";
  estimatedValue: number;
  ownerName: string;
  ownerImage: string;
  createdDate: string;
};

export type DealRecord = {
  id: string;
  title: string;
  companyId: string;
  contactId: string;
  leadId: string;
  stage: string;
  amount: number;
  tags: string;
  probability: number;
  expectedCloseDate: string;
  status: "Won" | "Lost" | "Open";
};

export type CatalogRecord = {
  id: string;
  kind: CatalogKind;
  name: string;
  sku: string;
  description: string;
  category: string;
  unitPrice: number;
  taxRate: number;
  status: "active" | "inactive";
  unit: string;
  billingType: "one_time" | "hourly" | "daily" | "monthly" | "yearly" | null;
};

export type QuoteRecord = {
  id: string;
  number: string;
  companyId: string;
  quoteDate: string;
  validTill: string;
  totalAmount: number;
  discount: string;
  finalAmount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
};

export type InvoiceRecord = {
  id: string;
  number: string;
  companyId: string;
  project: string;
  projectImage: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "Paid" | "Partially Paid" | "Unpaid" | "Overdue";
};

export type ActivityRecord = {
  id: string;
  type: "call" | "email" | "meeting" | "task" | "note";
  subject: string;
  companyId: string;
  contactId: string;
  dealId: string;
  dueAt: string;
  notes: string;
};

export type DepartmentRecord = {
  id: string;
  code: string;
  name: string;
  headName: string;
  headImage: string;
  membersCount: string;
  location: string;
  status: "active" | "inactive";
};

export type TravelRecord = {
  id: string;
  number: string;
  accountName: string;
  accountType: "individual" | "company";
  destination: string;
  departureDate: string;
  returnDate: string;
  status: string;
  amount: number;
};

export type ImmigrationRecord = {
  id: string;
  number: string;
  accountName: string;
  accountType: "individual" | "company";
  procedure: string;
  country: string;
  status: string;
  dueDate: string;
};

export type EventJobRecord = {
  id: string;
  number: string;
  title: string;
  accountName: string;
  accountType: "individual" | "company";
  eventDate: string;
  services: string;
  status: string;
  amount: number;
};

export type PlantationRecord = {
  id: string;
  name: string;
  crop: string;
  location: string;
  hectares: string;
  season: string;
  status: string;
};

export type SiteRecord = {
  id: string;
  name: string;
  accountName: string;
  accountType: "individual" | "company";
  location: string;
  progress: string;
  status: string;
  amount: number;
};

export type PropertyRecord = {
  id: string;
  name: string;
  kind: string;
  location: string;
  accountName: string;
  accountType: "individual" | "company";
  rent: number;
  status: string;
};

export type PayrollRecord = {
  id: string;
  employee: string;
  department: string;
  period: string;
  salary: number;
  bonus: number;
  status: string;
};

export type CrmStore = {
  companies: CompanyRecord[];
  contacts: ContactRecord[];
  leads: LeadRecord[];
  deals: DealRecord[];
  catalog: CatalogRecord[];
  quotes: QuoteRecord[];
  invoices: InvoiceRecord[];
  activities: ActivityRecord[];
  departments: DepartmentRecord[];
  travel: TravelRecord[];
  immigration: ImmigrationRecord[];
  events: EventJobRecord[];
  plantations: PlantationRecord[];
  sites: SiteRecord[];
  properties: PropertyRecord[];
  payroll: PayrollRecord[];
};

export type CrmResource = keyof CrmStore;
