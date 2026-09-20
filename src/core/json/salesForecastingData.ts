import { all_routes } from "@/router/all_routes";

/*
  Data for the Sales Forecasting report (sales-forecasting.html -> salesForecasting.tsx).
  Ported from html/assets/js/report.js, section 4 "Sales Forecasting", plus the
  static KPI / table markup in html/sales-forecasting.html (those tables are
  hand-authored HTML in the template, not JS-rendered).
  Pure data only - no chart rendering or DOM logic here.
*/

// ---- KPI cards -------------------------------------------------------------

export const SalesForecastingKpis = {
  forecastRevenue: { label: "Forecast Revenue", value: "FCFA 845K", deltaLabel: "8.4% vs last quarter", deltaDirection: "up" as const },
  closedRevenue: { label: "Closed Revenue", value: "FCFA 612K", note: "42 deals won" },
  openPipeline: { label: "Open Pipeline", value: "FCFA 1.84M", note: "53 open deals" },
  salesQuota: { label: "Sales Quota", value: "FCFA 920K", note: "Q3 2026 team target" },
  attainment: { label: "Attainment", value: "91.8%", meter: 91.8, tone: "warning" as const },
  forecastAccuracy: { label: "Forecast Accuracy", value: "94.2%", note: "Last 4 quarters" },
};

// Forecast category strip beneath the KPI cards.
export interface ForecastCategoryTile {
  key: string;
  label: string;
  value: string;
  note: string;
  noteTone: "muted" | "success" | "danger";
  strength: "strong" | "good" | "weak" | "risk";
}

export const SalesForecastingCategoryTiles: ForecastCategoryTile[] = [
  { key: "commit", label: "Commit", value: "FCFA 410K", note: "18 deals · 92% avg", noteTone: "muted", strength: "strong" },
  { key: "best-case", label: "Best Case", value: "FCFA 190K", note: "11 deals · 61% avg", noteTone: "muted", strength: "good" },
  { key: "pipeline", label: "Pipeline", value: "FCFA 245K", note: "24 deals · 28% avg", noteTone: "muted", strength: "weak" },
  { key: "closed-won", label: "Closed Won", value: "FCFA 612K", note: "42 deals", noteTone: "success", strength: "strong" },
  { key: "closed-lost", label: "Closed Lost", value: "FCFA 148K", note: "19 deals", noteTone: "danger", strength: "risk" },
];

// ---- chart 1, 3, 4, 5: view-dependent series ------------------------------
// Feeds #fc_revenue_chart (commit/best/pipe columns + quota line),
// #fc_pipeline_chart (open pipeline area = commit+best+pipe, precomputed
// below as `openPipeline`), #fc_quota_chart (quota vs actual) and
// #fc_accuracy_chart (forecast vs actual). Toggled by the Monthly / Quarterly
// / Yearly buttons (data-fc-view).

export type SalesForecastViewKey = "monthly" | "quarterly" | "yearly";

export interface SalesForecastView {
  categories: string[];
  commit: number[];
  best: number[];
  pipe: number[];
  quota: number[];
  actual: number[];
  forecast: number[];
  /** commit + best + pipe per period, i.e. total open pipeline - used by the Pipeline Trend chart. */
  openPipeline: number[];
}

export const SalesForecastViews: Record<SalesForecastViewKey, SalesForecastView> = {
  monthly: {
    categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    commit: [286, 305, 322, 340, 365, 410],
    best: [104, 118, 126, 140, 158, 190],
    pipe: [150, 162, 178, 195, 216, 245],
    quota: [520, 545, 580, 610, 660, 700],
    actual: [498, 560, 561, 645, 612, 0],
    forecast: [520, 545, 590, 610, 640, 690],
    openPipeline: [540, 585, 626, 675, 739, 845],
  },
  quarterly: {
    categories: ["Q4 25", "Q1 26", "Q2 26", "Q3 26"],
    commit: [742, 810, 913, 1075],
    best: [286, 312, 348, 466],
    pipe: [402, 448, 490, 656],
    quota: [1400, 1520, 1680, 1920],
    actual: [1382, 1498, 1718, 0],
    forecast: [1420, 1510, 1690, 1880],
    openPipeline: [1430, 1570, 1751, 2197],
  },
  yearly: {
    categories: ["2023", "2024", "2025", "2026"],
    commit: [2180, 2640, 3120, 3540],
    best: [820, 960, 1140, 1412],
    pipe: [1180, 1360, 1590, 1996],
    quota: [4200, 4900, 5600, 6520],
    actual: [4080, 4820, 5710, 4598],
    forecast: [4180, 4890, 5640, 6350],
    openPipeline: [4180, 4960, 5850, 6948],
  },
};

// ---- chart 2: forecast category breakdown (#fc_category_chart, donut) ----

export const SalesForecastCategoryBreakdown = {
  labels: ["Commit", "Best Case", "Pipeline", "Closed Won", "Closed Lost"],
  series: [410, 190, 245, 612, 148],
};

// ---- chart 6: stage-based forecast (#fc_stage_chart, horizontal bar) -----

export const SalesForecastStageBreakdown = {
  categories: ["Qualification", "Needs Analysis", "Proposal Sent", "Negotiation", "Contract Review"],
  series: [{ name: "Weighted", data: [62, 98, 186, 264, 235] }],
};

// ---- Rep-level Forecast table ---------------------------------------------

export interface RepForecastRow {
  key: string;
  SalesRep: string;
  Team: string;
  Quota: string;
  Closed: string;
  Forecast: string;
  Attainment: number;
  AttainmentTone: "success" | "warning" | "danger";
  Link: string;
}

export const RepForecastData: RepForecastRow[] = [
  { key: "1", SalesRep: "Ellis Vandermeer", Team: "Mid-Market", Quota: "FCFA 150K", Closed: "FCFA 139K", Forecast: "FCFA 39K", Attainment: 118, AttainmentTone: "success", Link: all_routes.manageusers },
  { key: "2", SalesRep: "Adrian Herrera", Team: "Enterprise", Quota: "FCFA 220K", Closed: "FCFA 168K", Forecast: "FCFA 54K", Attainment: 101, AttainmentTone: "success", Link: all_routes.manageusers },
  { key: "3", SalesRep: "Priya Raghunathan", Team: "Mid-Market", Quota: "FCFA 180K", Closed: "FCFA 121K", Forecast: "FCFA 47K", Attainment: 93, AttainmentTone: "warning", Link: all_routes.manageusers },
  { key: "4", SalesRep: "Tomas Lindqvist", Team: "Enterprise", Quota: "FCFA 220K", Closed: "FCFA 96K", Forecast: "FCFA 71K", Attainment: 76, AttainmentTone: "danger", Link: all_routes.manageusers },
  { key: "5", SalesRep: "Nadia Okonkwo", Team: "SMB", Quota: "FCFA 150K", Closed: "FCFA 58K", Forecast: "FCFA 34K", Attainment: 61, AttainmentTone: "danger", Link: all_routes.manageusers },
  { key: "6", SalesRep: "John Doe", Team: "Enterprise", Quota: "FCFA 420K", Closed: "FCFA 310K", Forecast: "FCFA 286K", Attainment: 92, AttainmentTone: "success", Link: all_routes.manageusers },
  { key: "7", SalesRep: "Marcus Lindqvist", Team: "Mid-Market", Quota: "FCFA 210K", Closed: "FCFA 132K", Forecast: "FCFA 95K", Attainment: 72, AttainmentTone: "warning", Link: all_routes.manageusers },
  { key: "8", SalesRep: "Fatima Al-Sayed", Team: "SMB", Quota: "FCFA 95K", Closed: "FCFA 41K", Forecast: "FCFA 18K", Attainment: 47, AttainmentTone: "danger", Link: all_routes.manageusers },
  { key: "9", SalesRep: "Diego Fernandez", Team: "Enterprise", Quota: "FCFA 275K", Closed: "FCFA 198K", Forecast: "FCFA 164K", Attainment: 84, AttainmentTone: "success", Link: all_routes.manageusers },
];

// ---- Team Forecast table ---------------------------------------------------

export interface TeamForecastRow {
  key: string;
  Team: string;
  Quota: string;
  Forecast: string;
  Gap: string;
  GapTone: "success" | "danger";
  Link: string;
}

export const TeamForecastData: TeamForecastRow[] = [
  { key: "1", Team: "Enterprise", Quota: "FCFA 440K", Forecast: "FCFA 389K", Gap: "-FCFA 51K", GapTone: "danger", Link: all_routes.teamsList },
  { key: "2", Team: "Mid-Market", Quota: "FCFA 330K", Forecast: "FCFA 346K", Gap: "+FCFA 16K", GapTone: "success", Link: all_routes.teamsList },
  { key: "3", Team: "SMB", Quota: "FCFA 150K", Forecast: "FCFA 110K", Gap: "-FCFA 40K", GapTone: "danger", Link: all_routes.teamsList },
];

// ---- Historical Performance table ------------------------------------------

export interface HistoricalPerformanceRow {
  key: string;
  Period: string;
  Quota: string;
  Forecast: string;
  Actual: string;
  Attainment: string;
  AttainmentTone: "success" | "warning" | "danger";
  ForecastAccuracy: string;
  ForecastAccuracyTone: "success" | "warning" | "danger";
  DealsWon: number;
}

export const HistoricalPerformanceData: HistoricalPerformanceRow[] = [
  { key: "1", Period: "Q2 2026", Quota: "FCFA 1.68M", Forecast: "FCFA 1.69M", Actual: "FCFA 1.72M", Attainment: "102%", AttainmentTone: "success", ForecastAccuracy: "98.3%", ForecastAccuracyTone: "success", DealsWon: 128 },
  { key: "2", Period: "Q1 2026", Quota: "FCFA 1.52M", Forecast: "FCFA 1.51M", Actual: "FCFA 1.50M", Attainment: "99%", AttainmentTone: "success", ForecastAccuracy: "99.3%", ForecastAccuracyTone: "success", DealsWon: 114 },
  { key: "3", Period: "Q4 2025", Quota: "FCFA 1.40M", Forecast: "FCFA 1.42M", Actual: "FCFA 1.38M", Attainment: "99%", AttainmentTone: "warning", ForecastAccuracy: "97.2%", ForecastAccuracyTone: "warning", DealsWon: 106 },
  { key: "4", Period: "Q3 2025", Quota: "FCFA 1.26M", Forecast: "FCFA 1.31M", Actual: "FCFA 1.19M", Attainment: "94%", AttainmentTone: "danger", ForecastAccuracy: "90.8%", ForecastAccuracyTone: "danger", DealsWon: 97 },
];

// ---- Filters (Sales Rep / Team / Region / Pipeline / Date range selects) --

export const SalesForecastingFilterOptions = {
  reps: ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"],
  teams: ["Enterprise", "Mid-Market", "SMB"],
  regions: ["North America", "EMEA", "APAC", "LATAM"],
  pipelines: ["New Business", "Renewals", "Expansion"],
  ranges: ["This Quarter", "Next Quarter", "This Year", "Custom range"],
};
