/*
  Palette of draggable / clickable workflow blocks used by the Workflow Builder
  (html/workflow-builder.html + html/assets/js/workflow-builder.js -> BLOCKS / PALETTE / KIND_TINT).

  This file also defines the shared "flow step" node contract (WorkflowFlowStepData)
  that a <WorkflowFlow /> component should render identically in three places:
    - workflow-builder.html  -> editable canvas   (.workflow-flow > .workflow-node, with tools)
    - automation-rules.html  -> read-only rule flow inside the rule detail modal
    - automation-logs.html   -> read-only execution path/timeline inside the log detail modal

  ---------------------------------------------------------------------------
  Markup contract (see html/assets/scss/pages/_workflow-builder.scss):
  ---------------------------------------------------------------------------
  .workflow-builder                     3-column flex layout: palette / canvas / props
    .workflow-palette                   left column, fixed width
      .workflow-palette-scroll
        .workflow-palette-group (+margin-top when stacked)
          .workflow-palette-title       small caps section heading, e.g. "Conditions"
          .workflow-block[data-block="<Type>"]     <i class="ti {Icon} {Tint}"></i><span>{Title}</span>
            .is-dragging                 while being drag-started
    .workflow-canvas-wrap                center column, flexible width
      .workflow-canvas                   dot-grid background, drop target
        .is-dragover                     while a block is being dragged over it
        .workflow-flow                   column of nodes/connectors/branches, centered
          .workflow-node[data-node-id][data-kind="trigger|condition|action|delay"]
            .is-selected                 builder-only: currently selected node
            .is-invalid                  builder-only: failed validation (amber highlight)
            .workflow-node-tools         builder-only: up/down/duplicate/remove buttons (opacity 0 -> 1 on hover/selected)
            .workflow-node-head
              .workflow-node-icon {Tint} > <i class="ti {Icon}">
              .workflow-node-kind        small caps label text, e.g. "Trigger" (index 0) or block.kind otherwise
              .workflow-node-title       bold step title (node.title || block.title)
            .workflow-node-desc          secondary description text (node.desc || block.desc)
            .workflow-node-issue         builder-only: inline validation message
          .workflow-connector            vertical line + centered round "+" insert button (opacity 0 -> 1 on hover)
          .workflow-branch               yes/no split rendered under an "if-else" node
            .workflow-branch-col.workflow-branch-col--yes > .workflow-branch-label + .workflow-node[data-kind="action"]
            .workflow-branch-col.workflow-branch-col--no  > .workflow-branch-label + .workflow-node[data-kind="condition"]
          .workflow-end                  terminator pill after the last node ("End of workflow")
        .workflow-canvas-hint            shown only when the flow is empty
    .workflow-props                      right column, fixed width
      .workflow-props-empty              shown when no node is selected
      (otherwise: icon + kind/title header, field()/sel()/txt() form controls per block type)

  Read-only reuse (automation-rules.html rule modal, automation.js flowNode()):
    the SAME `.workflow-flow` / `.workflow-node` / `.workflow-node-head` /
    `.workflow-node-icon` / `.workflow-node-kind` / `.workflow-node-title` markup
    is reused with no tools, no is-selected/is-invalid, and no workflow-node-desc -
    just three static nodes: Trigger -> Condition -> Action, separated by plain
    `.workflow-connector` divs (no insert button rendered there).

  Left palette groups, in display order (mirrors PALETTE in workflow-builder.js):
    "Triggers - Leads", "Triggers - Contacts & Companies", "Triggers - Deals",
    "Triggers - Activities", "Triggers - Documents & Contracts", "Triggers - Finance",
    "Conditions", "Actions", "Timing"
  The "Add a step" modal (#add_step_modal, [data-block-pick]) reuses the exact same
  .workflow-block button markup but only lists the Conditions / Actions / Timing
  groups (triggers can only ever be the first step, so they're excluded there).

  NOTE on a bug found in the static HTML: the Add Step modal's "Assign owner"
  button uses data-block-pick="assign-owner", which does not match any key in
  BLOCKS (the working key, used everywhere else including the palette and the
  templates below, is "assign-user") - so that one button is dead in the
  reference template. This file uses the correct "assign-user" key throughout.
*/

export type WorkflowBlockKind = "trigger" | "condition" | "action" | "delay";

export interface WorkflowBlockData {
  key: string;
  Type: string; // matches data-block / data-block-pick, e.g. "lead-created"
  Kind: WorkflowBlockKind;
  Group: string; // palette grouping, e.g. "Leads", "Conditions", "Actions", "Timing"
  Icon: string; // bare tabler icon name, e.g. "ti-user-plus" -> render <i class={`ti ${Icon}`} />
  Tint: string; // bg-soft-x text-x (or bg-purple-subtle text-purple) utility classes
  Title: string;
  Description: string;
  Branches?: boolean; // true only for "if-else" - renders a yes/no split beneath the node
}

// Kind -> icon tint, mirrors KIND_TINT in assets/js/workflow-builder.js
export const WorkflowKindTint: Record<WorkflowBlockKind, string> = {
  trigger: "bg-soft-primary text-primary",
  condition: "bg-soft-warning text-warning",
  action: "bg-soft-success text-success",
  delay: "bg-purple-subtle text-purple",
};

// Left palette section order + labels, mirrors PALETTE in workflow-builder.js.
// Build each section as WorkflowBlocksData.filter(b => b.Group === section.Group).
// The last three sections are also exactly what the "Add a step" modal shows.
export const WorkflowPaletteSections: { Label: string; Group: string }[] = [
  { Label: "Triggers - Leads", Group: "Leads" },
  { Label: "Triggers - Contacts & Companies", Group: "Contacts & Companies" },
  { Label: "Triggers - Deals", Group: "Deals" },
  { Label: "Triggers - Activities", Group: "Activities" },
  { Label: "Triggers - Documents & Contracts", Group: "Documents & Contracts" },
  { Label: "Triggers - Finance", Group: "Finance" },
  { Label: "Conditions", Group: "Conditions" },
  { Label: "Actions", Group: "Actions" },
  { Label: "Timing", Group: "Timing" },
];

export const WorkflowBlocksData: WorkflowBlockData[] = [
  // --- triggers : leads --------------------------------------------------
  { key: "1", Type: "lead-created", Kind: "trigger", Group: "Leads", Icon: "ti-user-plus", Tint: WorkflowKindTint.trigger, Title: "Lead created", Description: "Runs when a new lead enters the CRM." },
  { key: "2", Type: "lead-updated", Kind: "trigger", Group: "Leads", Icon: "ti-user-edit", Tint: WorkflowKindTint.trigger, Title: "Lead updated", Description: "Runs when any field on a lead changes." },
  { key: "3", Type: "lead-status-changed", Kind: "trigger", Group: "Leads", Icon: "ti-status-change", Tint: WorkflowKindTint.trigger, Title: "Lead status changed", Description: "Runs when a lead moves between statuses." },
  { key: "4", Type: "lead-assigned", Kind: "trigger", Group: "Leads", Icon: "ti-user-check", Tint: WorkflowKindTint.trigger, Title: "Lead assigned", Description: "Runs when a lead is assigned to an owner." },
  { key: "5", Type: "lead-qualified", Kind: "trigger", Group: "Leads", Icon: "ti-user-star", Tint: WorkflowKindTint.trigger, Title: "Lead qualified", Description: "Runs when a lead is marked qualified." },
  { key: "6", Type: "lead-score-changed", Kind: "trigger", Group: "Leads", Icon: "ti-target-arrow", Tint: WorkflowKindTint.trigger, Title: "Lead score changed", Description: "Runs when the AI lead score is recalculated." },

  // --- triggers : contacts & companies ------------------------------------
  { key: "7", Type: "contact-created", Kind: "trigger", Group: "Contacts & Companies", Icon: "ti-users-plus", Tint: WorkflowKindTint.trigger, Title: "Contact created", Description: "Runs when a new contact is added." },
  { key: "8", Type: "contact-updated", Kind: "trigger", Group: "Contacts & Companies", Icon: "ti-user-edit", Tint: WorkflowKindTint.trigger, Title: "Contact updated", Description: "Runs when a contact record changes." },
  { key: "9", Type: "company-created", Kind: "trigger", Group: "Contacts & Companies", Icon: "ti-building-plus", Tint: WorkflowKindTint.trigger, Title: "Company created", Description: "Runs when a new company is added." },
  { key: "10", Type: "company-updated", Kind: "trigger", Group: "Contacts & Companies", Icon: "ti-building", Tint: WorkflowKindTint.trigger, Title: "Company updated", Description: "Runs when a company record changes." },
  { key: "11", Type: "owner-changed", Kind: "trigger", Group: "Contacts & Companies", Icon: "ti-user-share", Tint: WorkflowKindTint.trigger, Title: "Account owner changed", Description: "Runs when an account changes owner." },

  // --- triggers : deals ----------------------------------------------------
  { key: "12", Type: "deal-created", Kind: "trigger", Group: "Deals", Icon: "ti-briefcase", Tint: WorkflowKindTint.trigger, Title: "Deal created", Description: "Runs when a new deal is opened." },
  { key: "13", Type: "deal-stage-changed", Kind: "trigger", Group: "Deals", Icon: "ti-git-branch", Tint: WorkflowKindTint.trigger, Title: "Deal stage changed", Description: "Runs when a deal moves between pipeline stages." },
  { key: "14", Type: "deal-value-changed", Kind: "trigger", Group: "Deals", Icon: "ti-coin", Tint: WorkflowKindTint.trigger, Title: "Deal value changed", Description: "Runs when the deal amount is edited." },
  { key: "15", Type: "deal-won", Kind: "trigger", Group: "Deals", Icon: "ti-trophy", Tint: WorkflowKindTint.trigger, Title: "Deal won", Description: "Runs when a deal is marked closed-won." },
  { key: "16", Type: "deal-lost", Kind: "trigger", Group: "Deals", Icon: "ti-thumb-down", Tint: WorkflowKindTint.trigger, Title: "Deal lost", Description: "Runs when a deal is marked closed-lost." },

  // --- triggers : activities ------------------------------------------------
  { key: "17", Type: "activity-created", Kind: "trigger", Group: "Activities", Icon: "ti-bolt", Tint: WorkflowKindTint.trigger, Title: "Activity created", Description: "Runs when any activity is logged." },
  { key: "18", Type: "task-completed", Kind: "trigger", Group: "Activities", Icon: "ti-checkbox", Tint: WorkflowKindTint.trigger, Title: "Task completed", Description: "Runs when a task is marked complete." },
  { key: "19", Type: "task-overdue", Kind: "trigger", Group: "Activities", Icon: "ti-clock-exclamation", Tint: WorkflowKindTint.trigger, Title: "Task overdue", Description: "Runs when a task passes its due date." },
  { key: "20", Type: "followup-due", Kind: "trigger", Group: "Activities", Icon: "ti-bell-ringing", Tint: WorkflowKindTint.trigger, Title: "Follow-up due", Description: "Runs when a scheduled follow-up comes due." },
  { key: "21", Type: "meeting-scheduled", Kind: "trigger", Group: "Activities", Icon: "ti-calendar-event", Tint: WorkflowKindTint.trigger, Title: "Meeting scheduled", Description: "Runs when a meeting is booked." },

  // --- triggers : documents & contracts --------------------------------------
  { key: "22", Type: "proposal-created", Kind: "trigger", Group: "Documents & Contracts", Icon: "ti-file-text", Tint: WorkflowKindTint.trigger, Title: "Proposal created", Description: "Runs when a proposal is generated." },
  { key: "23", Type: "proposal-accepted", Kind: "trigger", Group: "Documents & Contracts", Icon: "ti-file-check", Tint: WorkflowKindTint.trigger, Title: "Proposal accepted", Description: "Runs when a customer accepts a proposal." },
  { key: "24", Type: "contract-created", Kind: "trigger", Group: "Documents & Contracts", Icon: "ti-file-certificate", Tint: WorkflowKindTint.trigger, Title: "Contract created", Description: "Runs when a contract is drafted." },
  { key: "25", Type: "contract-expiring", Kind: "trigger", Group: "Documents & Contracts", Icon: "ti-calendar-x", Tint: WorkflowKindTint.trigger, Title: "Contract expiring", Description: "Runs ahead of a contract renewal date." },

  // --- triggers : finance -----------------------------------------------------
  { key: "26", Type: "invoice-created", Kind: "trigger", Group: "Finance", Icon: "ti-receipt", Tint: WorkflowKindTint.trigger, Title: "Invoice created", Description: "Runs when an invoice is issued." },
  { key: "27", Type: "invoice-overdue", Kind: "trigger", Group: "Finance", Icon: "ti-receipt-off", Tint: WorkflowKindTint.trigger, Title: "Invoice overdue", Description: "Runs when an invoice passes its due date." },
  { key: "28", Type: "payment-received", Kind: "trigger", Group: "Finance", Icon: "ti-credit-card", Tint: WorkflowKindTint.trigger, Title: "Payment received", Description: "Runs when a payment clears." },

  // --- conditions ---------------------------------------------------------------
  { key: "29", Type: "field-check", Kind: "condition", Group: "Conditions", Icon: "ti-filter", Tint: WorkflowKindTint.condition, Title: "Field condition", Description: "Continue only when the field matches." },
  { key: "30", Type: "if-else", Kind: "condition", Group: "Conditions", Icon: "ti-arrows-split-2", Tint: WorkflowKindTint.condition, Title: "If / else branch", Description: "Split the flow into a yes and a no path.", Branches: true },
  { key: "31", Type: "score-check", Kind: "condition", Group: "Conditions", Icon: "ti-target-arrow", Tint: WorkflowKindTint.condition, Title: "Score threshold", Description: "Continue when the score crosses a value." },
  { key: "32", Type: "amount-check", Kind: "condition", Group: "Conditions", Icon: "ti-coin", Tint: WorkflowKindTint.condition, Title: "Amount threshold", Description: "Continue when the amount crosses a value." },
  { key: "33", Type: "date-check", Kind: "condition", Group: "Conditions", Icon: "ti-calendar-stats", Tint: WorkflowKindTint.condition, Title: "Date condition", Description: "Continue based on a date field." },
  { key: "34", Type: "status-check", Kind: "condition", Group: "Conditions", Icon: "ti-status-change", Tint: WorkflowKindTint.condition, Title: "Status condition", Description: "Continue when the record has a status." },
  { key: "35", Type: "multi-check", Kind: "condition", Group: "Conditions", Icon: "ti-layers-intersect", Tint: WorkflowKindTint.condition, Title: "Multiple conditions", Description: "Combine several rules with AND / OR." },

  // --- actions ----------------------------------------------------------------
  { key: "36", Type: "send-email", Kind: "action", Group: "Actions", Icon: "ti-mail", Tint: WorkflowKindTint.action, Title: "Send email", Description: "Send a templated email to the record owner or contact." },
  { key: "37", Type: "create-task", Kind: "action", Group: "Actions", Icon: "ti-checklist", Tint: WorkflowKindTint.action, Title: "Create task", Description: "Create a follow-up task and assign an owner." },
  { key: "38", Type: "assign-user", Kind: "action", Group: "Actions", Icon: "ti-user-check", Tint: WorkflowKindTint.action, Title: "Assign user", Description: "Route the record to a specific user." },
  { key: "39", Type: "assign-team", Kind: "action", Group: "Actions", Icon: "ti-users-group", Tint: WorkflowKindTint.action, Title: "Assign team", Description: "Route the record to a team queue." },
  { key: "40", Type: "update-field", Kind: "action", Group: "Actions", Icon: "ti-edit", Tint: WorkflowKindTint.action, Title: "Update record", Description: "Write a value to a field on the record." },
  { key: "41", Type: "add-tag", Kind: "action", Group: "Actions", Icon: "ti-tag", Tint: WorkflowKindTint.action, Title: "Add tag", Description: "Apply a tag to the record." },
  { key: "42", Type: "remove-tag", Kind: "action", Group: "Actions", Icon: "ti-tag-off", Tint: WorkflowKindTint.action, Title: "Remove tag", Description: "Strip a tag from the record." },
  { key: "43", Type: "create-activity", Kind: "action", Group: "Actions", Icon: "ti-bolt", Tint: WorkflowKindTint.action, Title: "Create activity", Description: "Log an activity against the record." },
  { key: "44", Type: "create-followup", Kind: "action", Group: "Actions", Icon: "ti-bell-plus", Tint: WorkflowKindTint.action, Title: "Create follow-up", Description: "Schedule a follow-up on the record." },
  { key: "45", Type: "notify-slack", Kind: "action", Group: "Actions", Icon: "ti-bell", Tint: WorkflowKindTint.action, Title: "Send notification", Description: "Notify a user or channel in-app." },
  { key: "46", Type: "add-sequence", Kind: "action", Group: "Actions", Icon: "ti-mail-fast", Tint: WorkflowKindTint.action, Title: "Add to sales sequence", Description: "Enrol the contact in an existing sequence." },
  { key: "47", Type: "create-deal", Kind: "action", Group: "Actions", Icon: "ti-briefcase", Tint: WorkflowKindTint.action, Title: "Create deal", Description: "Open a new deal from this record." },
  { key: "48", Type: "send-webhook", Kind: "action", Group: "Actions", Icon: "ti-webhook", Tint: WorkflowKindTint.action, Title: "Create webhook", Description: "POST the record payload to an external URL." },

  // --- timing -------------------------------------------------------------------
  { key: "49", Type: "wait-delay", Kind: "delay", Group: "Timing", Icon: "ti-clock-hour-4", Tint: WorkflowKindTint.delay, Title: "Wait", Description: "Pause the flow for a fixed duration." },
];

/* -----------------------------------------------------------------------
   Shared flow-step / node contract - reused by workflowTemplatesData.ts
   (Steps), automationRulesListData.ts (Flow) and automationLogsListData.ts
   (Path). One <WorkflowFlow /> component can render any of these arrays
   against the .workflow-flow / .workflow-node markup documented above.
   ----------------------------------------------------------------------- */
export type WorkflowStepStatus = "success" | "failed" | "running" | "skipped";

export interface WorkflowFlowStepData {
  key: string;
  Kind: WorkflowBlockKind | "end"; // "end" = terminator step (Completed / Skipped / Error)
  Icon: string; // bare tabler icon name
  Tint: string; // icon chip background/text utility classes
  Label: string; // workflow-node-kind text, e.g. "Trigger", "Condition", "Action"
  Title: string; // workflow-node-title text
  Description?: string; // workflow-node-desc text, when there is more detail than the title alone
  Status?: WorkflowStepStatus; // read-only run outcome - rule/log flows only, never set in the builder
}
