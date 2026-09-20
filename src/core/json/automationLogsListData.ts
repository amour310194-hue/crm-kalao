import type { WorkflowFlowStepData, WorkflowStepStatus } from "./workflowBlocksData";

/*
  Automation Logs list (html/automation-logs.html + html/assets/js/automation.js -> LOGS).

  The execution detail modal (#log_modal) renders each log's step sequence
  twice from the same underlying [label, detail, status] triples:
    - [data-ld-path]     a horizontal ".log-path" strip of ".log-path-step"
                          pills joined by ".log-path-arrow" chevrons, styled by
                          status (.is-success / .is-failed / .is-running / .is-skipped)
                          - see html/assets/scss/pages/_automation.scss
    - [data-ld-timeline]  a vertical ".ai-timeline" with one <li class="is-{tone}">
                          per step (tone: skipped -> "primary", others 1:1)

  `Path` below is upgraded from the source's plain text pills to the SAME
  WorkflowFlowStepData node contract used by workflowBlocksData.ts /
  workflowTemplatesData.ts / automationRulesListData.ts, so a single
  <WorkflowFlow /> component can render it (compact/horizontal, read-only,
  with a Status ribbon) alongside the builder canvas and the rule-detail flow.
  `Kind`/`Icon`/`Tint` are derived from each step's label (Trigger / Condition
  / Action / Delay -> their normal block kind; Completed / Skipped / Error are
  terminal markers with no equivalent in BLOCKS, mapped to a new "end" kind).
  `Status` carries the run outcome as a separate overlay, exactly like
  is-invalid is a state layered on top of a node's own data-kind color.

  `Timeline` restates the same steps as {Time, Title, Text}: `Title` is the
  step label (what the source used as the timeline's "time" slot - a category,
  not a clock reading) and `Text` is its detail sentence. `Time` is a
  synthesized relative offset (not present in the source, which only ever
  showed the label there) so the timeline reads as a real execution trace.
*/

export type AutomationLogStatus = "success" | "failed" | "running" | "skipped";
export type AutomationLogKind = "Workflow" | "Rule";

// mirrors STATUS in automation.js
export const AutomationLogStatusMeta: Record<AutomationLogStatus, { Label: string; Tone: string; Icon: string }> = {
  success: { Label: "Success", Tone: "success", Icon: "ti-circle-check" },
  failed: { Label: "Failed", Tone: "danger", Icon: "ti-alert-circle" },
  running: { Label: "Running", Tone: "warning", Icon: "ti-loader" },
  skipped: { Label: "Skipped", Tone: "secondary", Icon: "ti-player-skip-forward" },
};

export interface AutomationLogTimelineItemData {
  key: string;
  Time: string;
  Title: string;
  Text: string;
}

export interface AutomationLogData {
  key: string;
  LogId: string;
  Source: string;
  Kind: AutomationLogKind;
  Trigger: string;
  Record: string;
  RecordLink: string;
  Action: string;
  Status: AutomationLogStatus;
  ExecutedAt: string;
  Duration: string;
  User: string;
  Error: string;
  Path: WorkflowFlowStepData[];
  Timeline: AutomationLogTimelineItemData[];
}

// label -> node identity (Kind/Icon/Tint), derived from BLOCKS/KIND_TINT in
// workflow-builder.js plus the terminal step kinds unique to a run's log
const STEP_KIND_META: Record<string, { Kind: WorkflowFlowStepData["Kind"]; Icon: string; Tint: string }> = {
  Trigger: { Kind: "trigger", Icon: "ti-bolt", Tint: "bg-soft-primary text-primary" },
  Condition: { Kind: "condition", Icon: "ti-filter", Tint: "bg-soft-warning text-warning" },
  Action: { Kind: "action", Icon: "ti-player-play", Tint: "bg-soft-success text-success" },
  "Failed action": { Kind: "action", Icon: "ti-player-play", Tint: "bg-soft-success text-success" },
  Delay: { Kind: "delay", Icon: "ti-clock-hour-4", Tint: "bg-purple-subtle text-purple" },
  Completed: { Kind: "end", Icon: "ti-flag-check", Tint: "bg-light text-dark" },
  Skipped: { Kind: "end", Icon: "ti-player-skip-forward", Tint: "bg-light text-dark" },
  Error: { Kind: "end", Icon: "ti-alert-circle", Tint: "bg-soft-danger text-danger" },
};

function pathStep(key: string, label: string, title: string, status: WorkflowStepStatus): WorkflowFlowStepData {
  const meta = STEP_KIND_META[label];
  return { key, Kind: meta.Kind, Icon: meta.Icon, Tint: meta.Tint, Label: label, Title: title, Status: status };
}

function timelineItem(key: string, time: string, label: string, text: string): AutomationLogTimelineItemData {
  return { key, Time: time, Title: label, Text: text };
}

export const AutomationLogsListData: AutomationLogData[] = [
  {
    key: "1",
    LogId: "L-9001",
    Source: "High-value deal follow-up",
    Kind: "Workflow",
    Trigger: "Deal Stage Changed",
    Record: "Halcyon Partners - Pilot",
    RecordLink: "deals-details.html",
    Action: "Send notification",
    Status: "success",
    ExecutedAt: "25 Aug 2026, 09:14:02",
    Duration: "1.2s",
    User: "System",
    Error: "",
    Path: [
      pathStep("1", "Trigger", "Deal stage changed to Negotiation", "success"),
      pathStep("2", "Condition", "Deal value > FCFA 100,000 - matched", "success"),
      pathStep("3", "Action", "Send notification to Sales Leadership", "success"),
      pathStep("4", "Action", "Create task \"Review high-value deal\"", "success"),
      pathStep("5", "Completed", "Workflow finished in 1.2s", "success"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Deal stage changed to Negotiation"),
      timelineItem("2", "0.1s", "Condition", "Deal value > FCFA 100,000 - matched"),
      timelineItem("3", "0.4s", "Action", "Send notification to Sales Leadership"),
      timelineItem("4", "0.8s", "Action", "Create task \"Review high-value deal\""),
      timelineItem("5", "1.2s", "Completed", "Workflow finished in 1.2s"),
    ],
  },
  {
    key: "2",
    LogId: "L-9002",
    Source: "Automatically assign new leads",
    Kind: "Rule",
    Trigger: "Lead Created",
    Record: "Marcus Whitfield",
    RecordLink: "leads-details.html",
    Action: "Assign user",
    Status: "success",
    ExecutedAt: "25 Aug 2026, 09:02:41",
    Duration: "0.6s",
    User: "System",
    Error: "",
    Path: [
      pathStep("1", "Trigger", "Lead created from Webinar", "success"),
      pathStep("2", "Condition", "Region is North America - matched", "success"),
      pathStep("3", "Action", "Assigned to Adrian Herrera (round robin)", "success"),
      pathStep("4", "Completed", "Rule finished in 0.6s", "success"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Lead created from Webinar"),
      timelineItem("2", "0.1s", "Condition", "Region is North America - matched"),
      timelineItem("3", "0.3s", "Action", "Assigned to Adrian Herrera (round robin)"),
      timelineItem("4", "0.6s", "Completed", "Rule finished in 0.6s"),
    ],
  },
  {
    key: "3",
    LogId: "L-9003",
    Source: "Notify finance when invoice overdue",
    Kind: "Rule",
    Trigger: "Invoice Overdue",
    Record: "INV-2048",
    RecordLink: "invoice-details.html",
    Action: "Send notification",
    Status: "failed",
    ExecutedAt: "25 Aug 2026, 08:30:11",
    Duration: "5.0s",
    User: "System",
    Error: "Webhook endpoint https://ledger.internal/v1/invoices returned 502 Bad Gateway after 3 retries.",
    Path: [
      pathStep("1", "Trigger", "Invoice INV-2048 passed its due date", "success"),
      pathStep("2", "Condition", "Amount > FCFA 5,000 - matched", "success"),
      pathStep("3", "Action", "Notification sent to Finance", "success"),
      pathStep("4", "Failed action", "Webhook \"Invoice created - accounting\" returned 502", "failed"),
      pathStep("5", "Error", "Execution halted after 3 retries", "failed"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Invoice INV-2048 passed its due date"),
      timelineItem("2", "0.1s", "Condition", "Amount > FCFA 5,000 - matched"),
      timelineItem("3", "0.3s", "Action", "Notification sent to Finance"),
      timelineItem("4", "0.8s", "Failed action", "Webhook \"Invoice created - accounting\" returned 502"),
      timelineItem("5", "5.0s", "Error", "Execution halted after 3 retries"),
    ],
  },
  {
    key: "4",
    LogId: "L-9004",
    Source: "New Customer Onboarding",
    Kind: "Workflow",
    Trigger: "Deal Won",
    Record: "Arclight Media - Upsell",
    RecordLink: "deals-details.html",
    Action: "Create task",
    Status: "running",
    ExecutedAt: "25 Aug 2026, 08:12:55",
    Duration: "—",
    User: "System",
    Error: "",
    Path: [
      pathStep("1", "Trigger", "Deal marked closed-won", "success"),
      pathStep("2", "Action", "Assigned to Customer Success", "success"),
      pathStep("3", "Delay", "Waiting 2 days before the next step", "running"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Deal marked closed-won"),
      timelineItem("2", "0.2s", "Action", "Assigned to Customer Success"),
      timelineItem("3", "running…", "Delay", "Waiting 2 days before the next step"),
    ],
  },
  {
    key: "5",
    LogId: "L-9005",
    Source: "Create task when lead qualified",
    Kind: "Rule",
    Trigger: "Lead Qualified",
    Record: "Priya Raghunathan",
    RecordLink: "leads-details.html",
    Action: "Create task",
    Status: "skipped",
    ExecutedAt: "24 Aug 2026, 17:44:09",
    Duration: "0.2s",
    User: "System",
    Error: "",
    Path: [
      pathStep("1", "Trigger", "Lead marked qualified", "success"),
      pathStep("2", "Condition", "Lead score >= 75 - not matched (score 71)", "skipped"),
      pathStep("3", "Skipped", "No actions were executed", "skipped"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Lead marked qualified"),
      timelineItem("2", "0.1s", "Condition", "Lead score >= 75 - not matched (score 71)"),
      timelineItem("3", "0.2s", "Skipped", "No actions were executed"),
    ],
  },
  {
    key: "6",
    LogId: "L-9006",
    Source: "Contract renewal reminder",
    Kind: "Workflow",
    Trigger: "Contract Expiring",
    Record: "CNT-0091",
    RecordLink: "contracts.html",
    Action: "Send email",
    Status: "success",
    ExecutedAt: "24 Aug 2026, 07:00:00",
    Duration: "0.9s",
    User: "System",
    Error: "",
    Path: [
      pathStep("1", "Trigger", "Contract expiring in 30 days", "success"),
      pathStep("2", "Condition", "Renewal within 30 days - matched", "success"),
      pathStep("3", "Action", "Email sent to Ellis Vandermeer", "success"),
      pathStep("4", "Action", "Follow-up created", "success"),
      pathStep("5", "Completed", "Workflow finished in 0.9s", "success"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Contract expiring in 30 days"),
      timelineItem("2", "0.1s", "Condition", "Renewal within 30 days - matched"),
      timelineItem("3", "0.3s", "Action", "Email sent to Ellis Vandermeer"),
      timelineItem("4", "0.6s", "Action", "Follow-up created"),
      timelineItem("5", "0.9s", "Completed", "Workflow finished in 0.9s"),
    ],
  },
  {
    key: "7",
    LogId: "L-9007",
    Source: "Notify team when a deal is won",
    Kind: "Rule",
    Trigger: "Deal Won",
    Record: "Northwind Logistics - Renewal",
    RecordLink: "deals-details.html",
    Action: "Send webhook",
    Status: "success",
    ExecutedAt: "24 Aug 2026, 16:58:31",
    Duration: "1.4s",
    User: "Adrian Herrera",
    Error: "",
    Path: [
      pathStep("1", "Trigger", "Deal marked closed-won", "success"),
      pathStep("2", "Action", "Team notification sent", "success"),
      pathStep("3", "Action", "Webhook \"Deal won - billing sync\" returned 200", "success"),
      pathStep("4", "Completed", "Rule finished in 1.4s", "success"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Deal marked closed-won"),
      timelineItem("2", "0.2s", "Action", "Team notification sent"),
      timelineItem("3", "0.7s", "Action", "Webhook \"Deal won - billing sync\" returned 200"),
      timelineItem("4", "1.4s", "Completed", "Rule finished in 1.4s"),
    ],
  },
  {
    key: "8",
    LogId: "L-9008",
    Source: "Proposal Follow-up",
    Kind: "Workflow",
    Trigger: "Proposal Created",
    Record: "PRP-0342",
    RecordLink: "proposals.html",
    Action: "Send email",
    Status: "failed",
    ExecutedAt: "23 Aug 2026, 11:05:47",
    Duration: "2.1s",
    User: "System",
    Error: "Email template \"Proposal follow-up\" references {{renewal_date}}, which is empty on this record.",
    Path: [
      pathStep("1", "Trigger", "Proposal PRP-0342 created", "success"),
      pathStep("2", "Delay", "Waited 3 business days", "success"),
      pathStep("3", "Condition", "Status is not Accepted - matched", "success"),
      pathStep("4", "Failed action", "Send email - unresolved merge variable", "failed"),
      pathStep("5", "Error", "Execution halted", "failed"),
    ],
    Timeline: [
      timelineItem("1", "0.0s", "Trigger", "Proposal PRP-0342 created"),
      timelineItem("2", "0.3s", "Delay", "Waited 3 business days"),
      timelineItem("3", "0.9s", "Condition", "Status is not Accepted - matched"),
      timelineItem("4", "1.6s", "Failed action", "Send email - unresolved merge variable"),
      timelineItem("5", "2.1s", "Error", "Execution halted"),
    ],
  },
];
