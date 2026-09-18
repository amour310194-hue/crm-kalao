/*
  Data for the Scheduled Reports page (scheduled-reports.html -> a future
  Pages/reports/scheduled-reports/scheduledReports.tsx).
  Ported from html/assets/js/report.js, section 3 "Scheduled Reports"
  (SCHEDULES and HISTORY).
  Pure data only - no rendering or DOM logic here.
*/

export type ScheduleStatus = "active" | "paused" | "failed";

export interface ScheduledReportRow {
  key: string;
  Id: string;
  Name: string;
  Type: string;
  Frequency: string;
  Detail: string;
  /** [primary recipient group label, overflow count label e.g. "+4"] */
  Recipients: [string, string];
  Format: "PDF" | "Excel" | "CSV";
  LastRun: string;
  NextRun: string;
  Owner: string;
  Status: ScheduleStatus;
}

// Datatable-style row list (SCHEDULES in report.js).
export const ScheduledReportsListData: ScheduledReportRow[] = [
  {
    key: "1",
    Id: "S-101",
    Name: "Weekly Pipeline Review",
    Type: "Deals",
    Frequency: "Weekly",
    Detail: "Every Monday, 08:00",
    Recipients: ["Sales Leadership", "+4"],
    Format: "PDF",
    LastRun: "25 Aug 2026, 08:00",
    NextRun: "01 Sep 2026, 08:00",
    Owner: "Tomas Lindqvist",
    Status: "active",
  },
  {
    key: "2",
    Id: "S-102",
    Name: "Monthly Revenue Summary",
    Type: "Invoices",
    Frequency: "Monthly",
    Detail: "1st of the month, 06:00",
    Recipients: ["Finance", "+2"],
    Format: "Excel",
    LastRun: "01 Aug 2026, 06:00",
    NextRun: "01 Sep 2026, 06:00",
    Owner: "Ellis Vandermeer",
    Status: "active",
  },
  {
    key: "3",
    Id: "S-103",
    Name: "Daily Lead Intake",
    Type: "Leads",
    Frequency: "Daily",
    Detail: "Every day, 07:30",
    Recipients: ["SDR Team", "+8"],
    Format: "CSV",
    LastRun: "25 Aug 2026, 07:30",
    NextRun: "26 Aug 2026, 07:30",
    Owner: "Adrian Herrera",
    Status: "active",
  },
  {
    key: "4",
    Id: "S-104",
    Name: "Quarterly Forecast Pack",
    Type: "Forecast",
    Frequency: "Quarterly",
    Detail: "First day of the quarter, 09:00",
    Recipients: ["Board", "+6"],
    Format: "PDF",
    LastRun: "01 Jul 2026, 09:00",
    NextRun: "01 Oct 2026, 09:00",
    Owner: "Tomas Lindqvist",
    Status: "active",
  },
  {
    key: "5",
    Id: "S-105",
    Name: "Win/Loss Debrief",
    Type: "Deals",
    Frequency: "Monthly",
    Detail: "Last Friday, 16:00",
    Recipients: ["Sales Leadership", "+3"],
    Format: "PDF",
    LastRun: "25 Jul 2026, 16:00",
    NextRun: "—",
    Owner: "Priya Raghunathan",
    Status: "paused",
  },
  {
    key: "6",
    Id: "S-106",
    Name: "Support SLA Breaches",
    Type: "Tickets",
    Frequency: "Weekly",
    Detail: "Every Friday, 17:00",
    Recipients: ["Support Leads", "+2"],
    Format: "Excel",
    LastRun: "22 Aug 2026, 17:00",
    NextRun: "29 Aug 2026, 17:00",
    Owner: "Nadia Okonkwo",
    Status: "active",
  },
  {
    key: "7",
    Id: "S-107",
    Name: "Stale Deal Alert",
    Type: "Deals",
    Frequency: "Weekly",
    Detail: "Every Wednesday, 10:00",
    Recipients: ["Account Executives", "+11"],
    Format: "CSV",
    LastRun: "20 Aug 2026, 10:00",
    NextRun: "27 Aug 2026, 10:00",
    Owner: "Adrian Herrera",
    Status: "failed",
  },
];

// Status badge label/tone, keyed by ScheduleStatus (STATUS in report.js).
export const ScheduleStatusMeta: Record<ScheduleStatus, { label: string; tone: "success" | "warning" | "danger" }> = {
  active: { label: "Active", tone: "success" },
  paused: { label: "Paused", tone: "warning" },
  failed: { label: "Last run failed", tone: "danger" },
};

// Format icon class, keyed by ScheduledReportRow["Format"] (FORMAT_ICON in report.js).
export const ScheduleFormatIcon: Record<ScheduledReportRow["Format"], string> = {
  PDF: "ti-file-type-pdf",
  Excel: "ti-file-type-xls",
  CSV: "ti-file-spreadsheet",
};

// ---- history modal ----------------------------------------------------

export interface ScheduledReportHistoryRow {
  key: string;
  When: string;
  Status: "Delivered" | "Failed";
  Tone: "success" | "danger";
  Note: string;
}

// Shared run-history rows shown in the "View history" modal for any
// schedule (HISTORY in report.js - not per-schedule in the source).
export const ScheduledReportHistoryData: ScheduledReportHistoryRow[] = [
  { key: "1", When: "25 Aug 2026, 08:00", Status: "Delivered", Tone: "success", Note: "6 recipients · 248 KB PDF" },
  { key: "2", When: "18 Aug 2026, 08:00", Status: "Delivered", Tone: "success", Note: "6 recipients · 244 KB PDF" },
  { key: "3", When: "11 Aug 2026, 08:00", Status: "Delivered", Tone: "success", Note: "5 recipients · 240 KB PDF" },
  { key: "4", When: "04 Aug 2026, 08:00", Status: "Failed", Tone: "danger", Note: "SMTP timeout - retried and delivered" },
  { key: "5", When: "28 Jul 2026, 08:00", Status: "Delivered", Tone: "success", Note: "5 recipients · 236 KB PDF" },
];
