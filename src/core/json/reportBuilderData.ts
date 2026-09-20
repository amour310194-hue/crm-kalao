import { all_routes } from "@/router/all_routes";

/*
  Data for the Report Builder wizard (report-builder.html -> reportBuilder.tsx).
  Ported from html/assets/js/report.js, section 2 "Report Builder".
  Pure data only - no chart rendering or DOM logic here.
*/

// ---- field / object types -------------------------------------------------

export type ReportFieldType = "text" | "num" | "date" | "pick";

export interface ReportField {
  name: string;
  type: ReportFieldType;
}

export type ReportObjectKey =
  | "leads"
  | "contacts"
  | "companies"
  | "deals"
  | "activities"
  | "opportunities"
  | "quotations"
  | "orders"
  | "proposals"
  | "contracts"
  | "estimations"
  | "invoices"
  | "payments"
  | "projects"
  | "tasks"
  | "users";

export interface ReportObject {
  key: ReportObjectKey;
  label: string;
  icon: string;
  fields: ReportField[];
  link: string;
  linkLabel: string;
}

// Glyph shown next to a field name in the field picker, keyed by ReportFieldType.
export const ReportFieldTypeIcons: Record<ReportFieldType, string> = {
  text: "Aa",
  num: "#",
  date: "📅",
  pick: "▾",
};

// Step 1 (Select Object) + step 2 (Select Fields) source: every reportable
// CRM object and its field list.
export const ReportObjectsData: ReportObject[] = [
  {
    key: "leads",
    label: "Leads",
    icon: "ti-target-arrow",
    fields: [
      { name: "Lead Name", type: "text" },
      { name: "Company", type: "text" },
      { name: "Email", type: "text" },
      { name: "Phone", type: "text" },
      { name: "Lead Source", type: "pick" },
      { name: "Lead Status", type: "pick" },
      { name: "Lead Score", type: "num" },
      { name: "Owner", type: "pick" },
      { name: "Industry", type: "pick" },
      { name: "Region", type: "pick" },
      { name: "Est. Value", type: "num" },
      { name: "Created Date", type: "date" },
    ],
    link: all_routes.leads,
    linkLabel: "View Lead",
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: "ti-users",
    fields: [
      { name: "Contact Name", type: "text" },
      { name: "Job Title", type: "text" },
      { name: "Company", type: "text" },
      { name: "Email", type: "text" },
      { name: "Phone", type: "text" },
      { name: "Owner", type: "pick" },
      { name: "Last Interaction", type: "date" },
      { name: "Created Date", type: "date" },
    ],
    link: all_routes.contactGrid,
    linkLabel: "View Contact",
  },
  {
    key: "companies",
    label: "Companies",
    icon: "ti-building",
    fields: [
      { name: "Company Name", type: "text" },
      { name: "Industry", type: "pick" },
      { name: "Company Size", type: "num" },
      { name: "Region", type: "pick" },
      { name: "Account Owner", type: "pick" },
      { name: "Total Revenue", type: "num" },
      { name: "Health Score", type: "num" },
      { name: "Customer Since", type: "date" },
    ],
    link: all_routes.companiesGrid,
    linkLabel: "View Customer",
  },
  {
    key: "deals",
    label: "Deals",
    icon: "ti-briefcase",
    fields: [
      { name: "Deal Name", type: "text" },
      { name: "Company", type: "text" },
      { name: "Stage", type: "pick" },
      { name: "Amount", type: "num" },
      { name: "Probability", type: "num" },
      { name: "Owner", type: "pick" },
      { name: "Source", type: "pick" },
      { name: "Team", type: "pick" },
      { name: "Region", type: "pick" },
      { name: "Expected Close", type: "date" },
      { name: "Created Date", type: "date" },
    ],
    link: all_routes.dealsDetails,
    linkLabel: "View Deal",
  },
  {
    key: "activities",
    label: "Activities",
    icon: "ti-bolt",
    fields: [
      { name: "Subject", type: "text" },
      { name: "Activity Type", type: "pick" },
      { name: "Related To", type: "text" },
      { name: "Owner", type: "pick" },
      { name: "Status", type: "pick" },
      { name: "Due Date", type: "date" },
    ],
    link: all_routes.activities,
    linkLabel: "View Activity",
  },
  {
    key: "opportunities",
    label: "Opportunities",
    icon: "ti-chart-arrows-vertical",
    fields: [
      { name: "Opportunity", type: "text" },
      { name: "Account", type: "text" },
      { name: "Stage", type: "pick" },
      { name: "Amount", type: "num" },
      { name: "Probability", type: "num" },
      { name: "Owner", type: "pick" },
      { name: "Close Date", type: "date" },
    ],
    link: all_routes.opportunitiesList,
    linkLabel: "View Opportunity",
  },
  {
    key: "quotations",
    label: "Quotations",
    icon: "ti-file-invoice",
    fields: [
      { name: "Quotation No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Amount", type: "num" },
      { name: "Status", type: "pick" },
      { name: "Valid Until", type: "date" },
      { name: "Owner", type: "pick" },
    ],
    link: all_routes.quotationsList,
    linkLabel: "View Quotation",
  },
  {
    key: "orders",
    label: "Sales Orders",
    icon: "ti-shopping-cart",
    fields: [
      { name: "Order No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Amount", type: "num" },
      { name: "Status", type: "pick" },
      { name: "Order Date", type: "date" },
      { name: "Owner", type: "pick" },
    ],
    link: all_routes.salesOrderList,
    linkLabel: "View Order",
  },
  {
    key: "proposals",
    label: "Proposals",
    icon: "ti-file-text",
    fields: [
      { name: "Proposal No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Amount", type: "num" },
      { name: "Status", type: "pick" },
      { name: "Sent Date", type: "date" },
      { name: "Owner", type: "pick" },
    ],
    link: all_routes.ProposalsGrid,
    linkLabel: "View Proposal",
  },
  {
    key: "contracts",
    label: "Contracts",
    icon: "ti-file-certificate",
    fields: [
      { name: "Contract No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Value", type: "num" },
      { name: "Status", type: "pick" },
      { name: "Start Date", type: "date" },
      { name: "Renewal Date", type: "date" },
    ],
    link: all_routes.ContractsGrid,
    linkLabel: "View Contract",
  },
  {
    key: "estimations",
    label: "Estimations",
    icon: "ti-calculator",
    fields: [
      { name: "Estimation No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Amount", type: "num" },
      { name: "Status", type: "pick" },
      { name: "Created Date", type: "date" },
    ],
    link: all_routes.estimationKanban,
    linkLabel: "View Estimation",
  },
  {
    key: "invoices",
    label: "Invoices",
    icon: "ti-receipt",
    fields: [
      { name: "Invoice No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Amount", type: "num" },
      { name: "Status", type: "pick" },
      { name: "Issued Date", type: "date" },
      { name: "Due Date", type: "date" },
    ],
    link: all_routes.invoice_details,
    linkLabel: "View Invoice",
  },
  {
    key: "payments",
    label: "Payments",
    icon: "ti-credit-card",
    fields: [
      { name: "Payment No", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Amount", type: "num" },
      { name: "Method", type: "pick" },
      { name: "Status", type: "pick" },
      { name: "Paid Date", type: "date" },
    ],
    link: all_routes.payments,
    linkLabel: "View Payment",
  },
  {
    key: "projects",
    label: "Projects",
    icon: "ti-briefcase-2",
    fields: [
      { name: "Project Name", type: "text" },
      { name: "Customer", type: "text" },
      { name: "Status", type: "pick" },
      { name: "Progress", type: "num" },
      { name: "Lead", type: "pick" },
      { name: "Due Date", type: "date" },
    ],
    link: all_routes.projectDetails,
    linkLabel: "View Project",
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: "ti-checklist",
    fields: [
      { name: "Task Name", type: "text" },
      { name: "Related To", type: "text" },
      { name: "Priority", type: "pick" },
      { name: "Status", type: "pick" },
      { name: "Assignee", type: "pick" },
      { name: "Due Date", type: "date" },
    ],
    link: all_routes.tasks,
    linkLabel: "View Task",
  },
  {
    key: "users",
    label: "Users / Teams",
    icon: "ti-user-cog",
    fields: [
      { name: "User Name", type: "text" },
      { name: "Team", type: "pick" },
      { name: "Role", type: "pick" },
      { name: "Deals Won", type: "num" },
      { name: "Revenue", type: "num" },
      { name: "Quota Attainment", type: "num" },
    ],
    link: all_routes.manageusers,
    linkLabel: "View User",
  },
];

// Default wizard state, mirrors `state` in report.js (deals report,
// pre-filtered to exclude Closed Lost).
export const ReportBuilderDefaultState = {
  object: "deals" as ReportObjectKey,
  fields: ["Deal Name", "Company", "Stage", "Amount", "Probability", "Owner"],
  groupBy: "",
  sortBy: "Amount",
  sortDir: "desc" as "asc" | "desc",
  aggregation: "sum",
  range: "quarter",
  viz: "table",
  groups: [
    {
      join: "and" as "and" | "or",
      rows: [{ field: "Stage", op: "is not", value: "Closed Lost" }],
    },
  ],
};

// ---- step 3: filters --------------------------------------------------

// Operator list shown in every filter row's condition select.
export const ReportFilterOperators: string[] = [
  "is",
  "is not",
  "contains",
  "greater than",
  "less than",
  "between",
  "is empty",
];

// Picklist values for fields that render as a <select> instead of a free
// text input in the filter builder, keyed by field name.
export const ReportFilterValues: Record<string, string[]> = {
  Stage: [
    "Qualification",
    "Needs Analysis",
    "Proposal Sent",
    "Negotiation",
    "Contract Review",
    "Closed Won",
    "Closed Lost",
  ],
  Owner: ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"],
  "Account Owner": ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"],
  Assignee: ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"],
  "Lead Source": ["Referral", "Webinar", "Outbound", "Trade Show", "Paid Search", "Content Download"],
  Source: ["Referral", "Webinar", "Outbound", "Trade Show", "Paid Search"],
  "Lead Status": ["New", "Working", "Qualified", "Unqualified"],
  Status: ["Draft", "Pending", "Active", "Approved", "Completed", "Overdue"],
  Industry: ["Financial Services", "Healthcare", "Logistics", "Manufacturing", "Media", "Technology"],
  Region: ["North America", "EMEA", "APAC", "LATAM"],
  Team: ["Enterprise", "Mid-Market", "SMB"],
  Priority: ["High", "Medium", "Low"],
  Method: ["Bank Transfer", "Credit Card", "Cheque"],
};

// ---- step 4: group / sort / aggregate ----------------------------------
// Group-by and sort-by options themselves come from the selected object's
// field list (see ReportObjectsData); these three are the fixed option
// lists for aggregation, sort direction and date range.

export const ReportAggregationOptions = [
  { value: "sum", label: "Sum" },
  { value: "count", label: "Count" },
  { value: "avg", label: "Average" },
  { value: "min", label: "Minimum" },
  { value: "max", label: "Maximum" },
];

export const ReportSortDirectionOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

export const ReportDateRangeOptions = [
  { value: "quarter", label: "This Quarter" },
  { value: "month", label: "This Month" },
  { value: "lastmonth", label: "Last Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom range" },
];

// ---- step 5: visualization ---------------------------------------------

export const ReportVisualizationOptions = [
  { value: "table", label: "Table", icon: "ti-table" },
  { value: "kpi", label: "KPI", icon: "ti-number-123" },
  { value: "bar", label: "Bar Chart", icon: "ti-chart-bar" },
  { value: "line", label: "Line Chart", icon: "ti-chart-line" },
  { value: "area", label: "Area Chart", icon: "ti-chart-area-line" },
  { value: "donut", label: "Pie / Donut", icon: "ti-chart-donut" },
  { value: "funnel", label: "Funnel", icon: "ti-filter" },
  { value: "stacked", label: "Stacked Chart", icon: "ti-chart-histogram" },
];

// ---- step 6: preview -----------------------------------------------------

export interface ReportSampleDealRow {
  key: string;
  DealName: string;
  Company: string;
  Stage: string;
  Amount: number;
  Probability: number;
  Owner: string;
  Source: string;
  Team: string;
  Region: string;
  ExpectedClose: string;
}

// Preview rows used when the selected object is "deals" (SAMPLE.deals).
export const ReportSampleDeals: ReportSampleDealRow[] = [
  { key: "1", DealName: "Halcyon Partners - Pilot", Company: "Halcyon Partners", Stage: "Negotiation", Amount: 128000, Probability: 74, Owner: "Tomas Lindqvist", Source: "Outbound", Team: "Enterprise", Region: "North America", ExpectedClose: "19 Sep 2026" },
  { key: "2", DealName: "Northwind Logistics - Renewal", Company: "Northwind Logistics", Stage: "Contract Review", Amount: 96000, Probability: 92, Owner: "Adrian Herrera", Source: "Referral", Team: "Enterprise", Region: "North America", ExpectedClose: "28 Aug 2026" },
  { key: "3", DealName: "Meridian Health - Expansion", Company: "Meridian Health", Stage: "Negotiation", Amount: 74500, Probability: 61, Owner: "Ellis Vandermeer", Source: "Referral", Team: "Mid-Market", Region: "North America", ExpectedClose: "04 Sep 2026" },
  { key: "4", DealName: "Arclight Media - Upsell", Company: "Arclight Media", Stage: "Proposal Sent", Amount: 62000, Probability: 58, Owner: "Nadia Okonkwo", Source: "Webinar", Team: "Mid-Market", Region: "EMEA", ExpectedClose: "26 Sep 2026" },
  { key: "5", DealName: "Cobalt Studio - New Business", Company: "Cobalt Studio", Stage: "Proposal Sent", Amount: 48000, Probability: 34, Owner: "Priya Raghunathan", Source: "Trade Show", Team: "SMB", Region: "EMEA", ExpectedClose: "12 Sep 2026" },
  { key: "6", DealName: "Ridgeway Manufacturing", Company: "Ridgeway Manufacturing", Stage: "Needs Analysis", Amount: 38500, Probability: 30, Owner: "Nadia Okonkwo", Source: "Paid Search", Team: "SMB", Region: "EMEA", ExpectedClose: "25 Sep 2026" },
];

export interface ReportSampleLeadRow {
  key: string;
  LeadName: string;
  Company: string;
  Email: string;
  Phone: string;
  LeadSource: string;
  LeadStatus: string;
  LeadScore: number;
  Owner: string;
  Industry: string;
  Region: string;
  EstValue: number;
  CreatedDate: string;
}

// Preview rows used when the selected object is "leads" (SAMPLE.leads).
export const ReportSampleLeads: ReportSampleLeadRow[] = [
  { key: "1", LeadName: "Marcus Whitfield", Company: "Northwind Logistics", Email: "m.whitfield@northwind.io", Phone: "+1 415 555 0134", LeadSource: "Webinar", LeadStatus: "Qualified", LeadScore: 92, Owner: "Adrian Herrera", Industry: "Logistics", Region: "North America", EstValue: 96000, CreatedDate: "04 Aug 2026" },
  { key: "2", LeadName: "Ellis Vandermeer", Company: "Halcyon Partners", Email: "e.vandermeer@halcyon.partners", Phone: "+1 312 555 0119", LeadSource: "Outbound", LeadStatus: "Qualified", LeadScore: 88, Owner: "Tomas Lindqvist", Industry: "Financial Services", Region: "North America", EstValue: 128000, CreatedDate: "01 Aug 2026" },
  { key: "3", LeadName: "Priya Raghunathan", Company: "Meridian Health", Email: "p.raghunathan@meridianhealth.com", Phone: "+1 617 555 0188", LeadSource: "Referral", LeadStatus: "Working", LeadScore: 84, Owner: "Ellis Vandermeer", Industry: "Healthcare", Region: "North America", EstValue: 74500, CreatedDate: "07 Aug 2026" },
  { key: "4", LeadName: "Tomas Lindqvist", Company: "Cobalt Studio", Email: "t.lindqvist@cobaltstudio.se", Phone: "+46 8 555 0142", LeadSource: "Trade Show", LeadStatus: "Working", LeadScore: 71, Owner: "Adrian Herrera", Industry: "Media", Region: "EMEA", EstValue: 48000, CreatedDate: "11 Aug 2026" },
  { key: "5", LeadName: "Nadia Okonkwo", Company: "Ridgeway Manufacturing", Email: "n.okonkwo@ridgeway.co.uk", Phone: "+44 20 5550 173", LeadSource: "Paid Search", LeadStatus: "New", LeadScore: 58, Owner: "Priya Raghunathan", Industry: "Manufacturing", Region: "EMEA", EstValue: 38500, CreatedDate: "13 Aug 2026" },
];

// Base values `sampleFor()` cycles through to fabricate a plausible-looking
// 5-row preview for any object that has no explicit ReportSampleDeals /
// ReportSampleLeads-style array above.
export const ReportGenericSampleBase = {
  companies: ["Halcyon Partners", "Northwind Logistics", "Meridian Health", "Arclight Media", "Cobalt Studio"],
  statuses: ["Active", "Pending", "Approved", "Draft", "Completed"],
  amounts: [128000, 96000, 74500, 62000, 48000],
  owners: ["Tomas Lindqvist", "Adrian Herrera", "Ellis Vandermeer", "Nadia Okonkwo", "Priya Raghunathan"],
  dates: ["19 Sep 2026", "28 Aug 2026", "04 Sep 2026", "26 Sep 2026", "12 Sep 2026"],
};

// KPI tiles shown when the "KPI" visualization is selected in the preview
// step (kpiHtml()).
export const ReportPreviewKpiTiles = [
  { label: "Total Records", value: "53" },
  { label: "Total Amount", value: "FCFA 1.84M" },
  { label: "Average Amount", value: "FCFA 34,717" },
  { label: "Weighted Amount", value: "FCFA 845K" },
];

// Shared categories/values used to draw the demo bar / line / area / donut /
// funnel chart in the preview step (chartOptions()).
export const ReportPreviewChartCategories = [
  "Qualification",
  "Needs Analysis",
  "Proposal Sent",
  "Negotiation",
  "Contract Review",
];
export const ReportPreviewChartValues = [620, 392, 486, 264, 235];

// Extra series used only when viz === "stacked" (Won / Open / Lost per stage).
export const ReportPreviewStackedSeries = [
  { name: "Won", data: [180, 150, 210, 160, 190] },
  { name: "Open", data: [280, 160, 190, 74, 45] },
  { name: "Lost", data: [160, 82, 86, 30, 0] },
];

// ---- report actions (toolbar / header buttons) ---------------------------

// Confirmation toast text per data-rb-action value.
export const ReportActionMessages: Record<string, string> = {
  save: "Report saved to My Reports.",
  saveas: 'Saved as a copy - "Pipeline by Stage (copy)".',
  export: "Export queued - the file will download when ready.",
  print: "Sending the report to your printer...",
  schedule: "Schedule created - opening Scheduled Reports.",
  share: "Share link copied to your clipboard.",
  edit: "Report configuration unlocked for editing.",
  delete: "Report moved to the recycle bin.",
  dashboard: "Report pinned to the Sales Dashboard.",
};
