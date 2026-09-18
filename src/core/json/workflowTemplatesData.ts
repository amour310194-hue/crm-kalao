/*
  Workflow template gallery (html/workflow-builder.html #workflow_templates_modal
  + html/assets/js/workflow-builder.js -> TEMPLATES / applyTemplate()).

  Clicking a template card (data-wf-template) replaces the builder canvas with
  its `Steps`. Each step only carries a `Type` (+ optional pre-filled `Config`
  values for that block's settings panel) - resolve the icon/kind/tint/title to
  render by looking the `Type` up in WorkflowBlocksData, exactly like the
  reference JS resolves `BLOCKS[step.type]` when it builds canvas nodes from a
  template.

  All 8 cards render as `.ai-quick` buttons with the SAME icon tint
  (bg-soft-primary text-primary) in the static markup - only the glyph and
  copy differ per card, so no per-card tint is stored here.

  Note: the reference product only ships 8 ready-made templates (TEMPLATES has
  8 keys, and the modal renders exactly 8 `.ai-quick` cards) - there is no 9th
  template in the source file.
*/

export interface WorkflowTemplateStepData {
  key: string;
  Type: string; // WorkflowBlockData.Type this step resolves to, e.g. "lead-created"
  Config?: Record<string, string | number | boolean>; // pre-filled node.cfg values for the step's settings panel
}

export interface WorkflowTemplateData {
  key: string;
  Id: string; // matches data-wf-template
  Icon: string; // bare tabler icon name for the template card
  Title: string;
  Description: string;
  Module: string; // "Applies to" badge text, e.g. "Leads"
  StepCount: number;
  Steps: WorkflowTemplateStepData[];
}

export const WorkflowTemplatesData: WorkflowTemplateData[] = [
  {
    key: "1",
    Id: "assign-leads",
    Icon: "ti-user-check",
    Title: "Assign New Leads Automatically",
    Description: "Route every new lead to an owner by territory as soon as it lands.",
    Module: "Leads",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "lead-created", Config: { object: "Leads", scope: "All records" } },
      { key: "2", Type: "field-check", Config: { field: "Region", operator: "equals", value: "North America", join: "AND - all must match" } },
      { key: "3", Type: "assign-user", Config: { assignee: "Adrian Herrera", method: "Round robin" } },
      { key: "4", Type: "notify-slack", Config: { notify: "Record owner", channel: "In-app notification", message: "A new lead has been assigned to you." } },
    ],
  },
  {
    key: "2",
    Id: "high-value-deal",
    Icon: "ti-coin",
    Title: "High-Value Deal Notification",
    Description: "Alert sales leadership the moment a deal above $100K is created.",
    Module: "Deals",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "deal-created", Config: { object: "Deals", scope: "All records" } },
      { key: "2", Type: "amount-check", Config: { field: "Deal value", operator: "is greater than", value: "100000", join: "AND - all must match" } },
      { key: "3", Type: "notify-slack", Config: { notify: "Whole team", channel: "Both", message: "High-value deal {{deal_name}} was just created." } },
      { key: "4", Type: "create-task", Config: { taskTitle: "Review high-value deal", assignee: "Tomas Lindqvist", dueIn: 1, dueUnit: "Days", priority: "High" } },
    ],
  },
  {
    key: "3",
    Id: "lead-followup",
    Icon: "ti-mail-fast",
    Title: "New Lead Follow-up",
    Description: "Send a welcome email, wait two days, then create a follow-up task.",
    Module: "Leads",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "lead-created", Config: { object: "Leads", scope: "All records" } },
      { key: "2", Type: "send-email", Config: { template: "Welcome sequence - step 1", recipient: "Primary contact", subject: "Welcome to CRMS, {{first_name}}" } },
      { key: "3", Type: "wait-delay", Config: { duration: 2, unit: "Days", businessDays: true } },
      { key: "4", Type: "create-task", Config: { taskTitle: "Call {{first_name}}", assignee: "Record owner", dueIn: 1, dueUnit: "Days", priority: "Medium" } },
    ],
  },
  {
    key: "4",
    Id: "proposal-followup",
    Icon: "ti-file-text",
    Title: "Proposal Follow-up",
    Description: "Chase a proposal that has not been answered after three days.",
    Module: "Proposals",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "proposal-created", Config: { object: "Proposals", scope: "All records" } },
      { key: "2", Type: "wait-delay", Config: { duration: 3, unit: "Days", businessDays: true } },
      { key: "3", Type: "status-check", Config: { field: "Lead status", operator: "does not equal", value: "Accepted", join: "AND - all must match" } },
      { key: "4", Type: "send-email", Config: { template: "Proposal follow-up", recipient: "Primary contact", subject: "Any questions on the proposal?" } },
    ],
  },
  {
    key: "5",
    Id: "contract-renewal",
    Icon: "ti-file-certificate",
    Title: "Contract Renewal Reminder",
    Description: "Warn the account owner 30 days before a contract expires.",
    Module: "Contracts",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "contract-expiring", Config: { object: "Contracts", scope: "All records" } },
      { key: "2", Type: "date-check", Config: { field: "Close date", operator: "is less than", value: "30 days", join: "AND - all must match" } },
      { key: "3", Type: "notify-slack", Config: { notify: "Record owner", channel: "Email", message: "Contract renews in 30 days." } },
      { key: "4", Type: "create-followup", Config: { taskTitle: "Start renewal conversation", assignee: "Record owner", dueIn: 2, dueUnit: "Days", priority: "High" } },
    ],
  },
  {
    key: "6",
    Id: "invoice-overdue",
    Icon: "ti-receipt-off",
    Title: "Invoice Overdue Notification",
    Description: "Notify finance and email the customer when an invoice goes past due.",
    Module: "Invoices",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "invoice-overdue", Config: { object: "Invoices", scope: "All records" } },
      { key: "2", Type: "notify-slack", Config: { notify: "Whole team", channel: "Email", message: "Invoice is overdue." } },
      { key: "3", Type: "send-email", Config: { template: "Custom message", recipient: "Primary contact", subject: "Invoice {{deal_name}} is overdue" } },
      { key: "4", Type: "add-tag", Config: { tag: "At Risk" } },
    ],
  },
  {
    key: "7",
    Id: "customer-onboarding",
    Icon: "ti-rocket",
    Title: "New Customer Onboarding",
    Description: "Kick off onboarding tasks as soon as a deal is won.",
    Module: "Deals",
    StepCount: 5,
    Steps: [
      { key: "1", Type: "deal-won", Config: { object: "Deals", scope: "All records" } },
      { key: "2", Type: "assign-team", Config: { team: "Customer Success", queue: "Round robin within team" } },
      { key: "3", Type: "create-task", Config: { taskTitle: "Schedule onboarding kick-off", assignee: "Record owner", dueIn: 2, dueUnit: "Days", priority: "High" } },
      { key: "4", Type: "send-email", Config: { template: "Welcome sequence - step 1", recipient: "Primary contact", subject: "Welcome aboard, {{first_name}}" } },
      { key: "5", Type: "add-tag", Config: { tag: "Enterprise" } },
    ],
  },
  {
    key: "8",
    Id: "deal-won",
    Icon: "ti-trophy",
    Title: "Deal Won Notification",
    Description: "Celebrate the win and hand the account to finance.",
    Module: "Deals",
    StepCount: 4,
    Steps: [
      { key: "1", Type: "deal-won", Config: { object: "Deals", scope: "All records" } },
      { key: "2", Type: "notify-slack", Config: { notify: "Whole team", channel: "In-app notification", message: "{{deal_name}} just closed for {{deal_value}}." } },
      { key: "3", Type: "send-webhook", Config: { webhook: "Deal won - billing sync", method: "POST" } },
      { key: "4", Type: "create-task", Config: { taskTitle: "Raise the first invoice", assignee: "Ellis Vandermeer", dueIn: 1, dueUnit: "Days", priority: "High" } },
    ],
  },
];
