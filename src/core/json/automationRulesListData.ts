import type { WorkflowFlowStepData } from "./workflowBlocksData";

/*
  Automation Rules list (html/automation-rules.html + html/assets/js/automation.js -> RULES).

  The rule detail modal (#rule_modal, [data-rd-flow]) renders `Flow` through the
  same .workflow-flow / .workflow-node markup as the Workflow Builder (see
  workflowBlocksData.ts for the full contract), but read-only: no
  .workflow-node-tools, no is-selected/is-invalid states, and no
  .workflow-node-desc. It is always exactly 3 nodes - Trigger -> Condition ->
  Action - built by flowNode() in automation.js from the rule's own
  trigger/conditions/action text, regardless of what the rule actually does.
*/

export type AutomationRuleStatus = "active" | "paused" | "error" | "draft";

// mirrors STATUS in automation.js
export const AutomationRuleStatusMeta: Record<AutomationRuleStatus, { Label: string; Tone: string }> = {
  active: { Label: "Active", Tone: "success" },
  draft: { Label: "Draft", Tone: "secondary" },
  paused: { Label: "Paused", Tone: "warning" },
  error: { Label: "Error", Tone: "danger" },
};

export interface AutomationRuleData {
  key: string;
  RuleId: string;
  Name: string;
  Applies: string;
  Trigger: string;
  Conditions: string;
  Action: string;
  Executions: number;
  SuccessRate: number; // 0-100; ignore when Executions is 0 ("Not run yet" in the source)
  LastExecuted: string;
  CreatedBy: string;
  CreatedDate: string;
  Status: AutomationRuleStatus;
  Link: string; // module list page this rule applies to, e.g. "leads.html"
  Flow: WorkflowFlowStepData[];
}

// builds the fixed Trigger -> Condition -> Action mini flow, matching flowNode() in automation.js
function ruleFlow(trigger: string, conditions: string, action: string): WorkflowFlowStepData[] {
  return [
    { key: "1", Kind: "trigger", Icon: "ti-bolt", Tint: "bg-soft-primary text-primary", Label: "Trigger", Title: trigger },
    { key: "2", Kind: "condition", Icon: "ti-filter", Tint: "bg-soft-warning text-warning", Label: "Condition", Title: conditions },
    { key: "3", Kind: "action", Icon: "ti-player-play", Tint: "bg-soft-success text-success", Label: "Action", Title: action },
  ];
}

export const AutomationRulesListData: AutomationRuleData[] = [
  {
    key: "1",
    RuleId: "R-201",
    Name: "Automatically assign new leads",
    Applies: "Leads",
    Trigger: "Lead Created",
    Conditions: "Region is North America",
    Action: "Assign user (round robin)",
    Executions: 1482,
    SuccessRate: 99,
    LastExecuted: "25 Aug 2026, 09:12",
    CreatedBy: "Adrian Herrera",
    CreatedDate: "04 Mar 2026",
    Status: "active",
    Link: "leads.html",
    Flow: ruleFlow("Lead Created", "Region is North America", "Assign user (round robin)"),
  },
  {
    key: "2",
    RuleId: "R-202",
    Name: "Notify sales manager for high-value deals",
    Applies: "Deals",
    Trigger: "Deal Created",
    Conditions: "Deal value > FCFA 100,000",
    Action: "Send notification",
    Executions: 214,
    SuccessRate: 100,
    LastExecuted: "25 Aug 2026, 08:40",
    CreatedBy: "Tomas Lindqvist",
    CreatedDate: "18 Mar 2026",
    Status: "active",
    Link: "deals.html",
    Flow: ruleFlow("Deal Created", "Deal value > FCFA 100,000", "Send notification"),
  },
  {
    key: "3",
    RuleId: "R-203",
    Name: "Create follow-up after proposal submission",
    Applies: "Proposals",
    Trigger: "Proposal Created",
    Conditions: "Status is Sent",
    Action: "Create task",
    Executions: 386,
    SuccessRate: 97,
    LastExecuted: "24 Aug 2026, 16:05",
    CreatedBy: "Priya Raghunathan",
    CreatedDate: "22 Apr 2026",
    Status: "active",
    Link: "proposals.html",
    Flow: ruleFlow("Proposal Created", "Status is Sent", "Create task"),
  },
  {
    key: "4",
    RuleId: "R-204",
    Name: "Alert account owner before contract expiry",
    Applies: "Contracts",
    Trigger: "Contract Expiring",
    Conditions: "Renewal within 30 days",
    Action: "Send email + create follow-up",
    Executions: 92,
    SuccessRate: 98,
    LastExecuted: "24 Aug 2026, 07:00",
    CreatedBy: "Ellis Vandermeer",
    CreatedDate: "02 May 2026",
    Status: "active",
    Link: "contracts.html",
    Flow: ruleFlow("Contract Expiring", "Renewal within 30 days", "Send email + create follow-up"),
  },
  {
    key: "5",
    RuleId: "R-205",
    Name: "Create task when lead becomes qualified",
    Applies: "Leads",
    Trigger: "Lead Qualified",
    Conditions: "Lead score >= 75",
    Action: "Create task",
    Executions: 640,
    SuccessRate: 96,
    LastExecuted: "25 Aug 2026, 10:22",
    CreatedBy: "Adrian Herrera",
    CreatedDate: "11 May 2026",
    Status: "active",
    Link: "leads.html",
    Flow: ruleFlow("Lead Qualified", "Lead score >= 75", "Create task"),
  },
  {
    key: "6",
    RuleId: "R-206",
    Name: "Notify finance when invoice becomes overdue",
    Applies: "Invoices",
    Trigger: "Invoice Overdue",
    Conditions: "Amount > FCFA 5,000",
    Action: "Send notification + add tag",
    Executions: 148,
    SuccessRate: 71,
    LastExecuted: "23 Aug 2026, 11:05",
    CreatedBy: "Ellis Vandermeer",
    CreatedDate: "30 May 2026",
    Status: "error",
    Link: "invoices.html",
    Flow: ruleFlow("Invoice Overdue", "Amount > FCFA 5,000", "Send notification + add tag"),
  },
  {
    key: "7",
    RuleId: "R-207",
    Name: "Assign deals based on territory",
    Applies: "Deals",
    Trigger: "Deal Created",
    Conditions: "Region is EMEA",
    Action: "Assign team",
    Executions: 318,
    SuccessRate: 94,
    LastExecuted: "19 Aug 2026, 14:31",
    CreatedBy: "Nadia Okonkwo",
    CreatedDate: "14 Jun 2026",
    Status: "paused",
    Link: "deals.html",
    Flow: ruleFlow("Deal Created", "Region is EMEA", "Assign team"),
  },
  {
    key: "8",
    RuleId: "R-208",
    Name: "Notify team when a deal is won",
    Applies: "Deals",
    Trigger: "Deal Won",
    Conditions: "No conditions",
    Action: "Send notification + webhook",
    Executions: 98,
    SuccessRate: 100,
    LastExecuted: "24 Aug 2026, 17:48",
    CreatedBy: "Tomas Lindqvist",
    CreatedDate: "01 Jul 2026",
    Status: "active",
    Link: "deals.html",
    Flow: ruleFlow("Deal Won", "No conditions", "Send notification + webhook"),
  },
  {
    key: "9",
    RuleId: "R-209",
    Name: "Tag contacts from webinar campaigns",
    Applies: "Contacts",
    Trigger: "Contact Created",
    Conditions: "Source is Webinar",
    Action: "Add tag",
    Executions: 0,
    SuccessRate: 0,
    LastExecuted: "Never",
    CreatedBy: "Priya Raghunathan",
    CreatedDate: "20 Aug 2026",
    Status: "draft",
    Link: "contacts.html",
    Flow: ruleFlow("Contact Created", "Source is Webinar", "Add tag"),
  },
];
