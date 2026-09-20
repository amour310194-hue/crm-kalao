import { all_routes } from "@/router/all_routes";

/*
  Data for the Sales Velocity report (sales-velocity.html -> salesVelocity.tsx).
  Ported from html/assets/js/report.js, section 6 "Sales Velocity".
  Pure data only - no chart rendering or DOM logic here.

  Sales velocity = (opportunities x avg deal value x win rate) / sales cycle
*/

// ---- formula inputs / KPI cards --------------------------------------------

export type VelocityPeriodKey = "current" | "previous" | "target";

export interface VelocityPeriod {
  label: string;
  opps: number;
  value: number;
  /** win rate, expressed as a fraction (0.61 = 61%) */
  win: number;
  /** average sales cycle, in days */
  cycle: number;
}

// Feeds the "How sales velocity is calculated" formula strip
// (data-vel-formula, built from `current`) and the Period Comparison table.
export const VelocityPeriods: Record<VelocityPeriodKey, VelocityPeriod> = {
  current: { opps: 53, value: 42400, win: 0.61, cycle: 46, label: "This Quarter" },
  previous: { opps: 48, value: 39800, win: 0.57, cycle: 52, label: "Last Quarter" },
  target: { opps: 60, value: 45000, win: 0.65, cycle: 42, label: "Target" },
};

// The 5 KPI cards under the formula strip. These are static display copy in
// the template (not derived live from VelocityPeriods), so they are ported
// as-is rather than recomputed.
export const SalesVelocityKpis = {
  velocity: { label: "Sales Velocity", value: "FCFA 29,800", deltaLabel: "16.1% vs last quarter", deltaDirection: "up" as const },
  openOpportunities: { label: "Open Opportunities", value: "53", deltaLabel: "10.4%", deltaDirection: "up" as const },
  avgDealValue: { label: "Avg. Deal Value", value: "FCFA 42,400", deltaLabel: "6.5%", deltaDirection: "up" as const },
  winRate: { label: "Win Rate", value: "61%", meter: 61, tone: "success" as const },
  avgSalesCycle: { label: "Avg. Sales Cycle", value: "46 days", deltaLabel: "6 days faster", deltaDirection: "down" as const },
};

// ---- charts -----------------------------------------------------------

// #vel_trend_chart - Sales Velocity Trend (area) vs Target (dashed line)
export const VelocityTrendChart = {
  categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  series: [
    { name: "Sales velocity", data: [21400, 23100, 24800, 26200, 28400, 29800] },
    { name: "Target", data: [26000, 26500, 27000, 27500, 28000, 28500] },
  ],
};

// #vel_team_chart - Velocity by Team
export const VelocityByTeamChart = {
  categories: ["Enterprise", "Mid-Market", "SMB"],
  series: [{ name: "Velocity", data: [38200, 27400, 18900] }],
};

// #vel_rep_chart - Velocity by Sales Representative
export const VelocityByRepChart = {
  categories: ["Ellis Vandermeer", "Adrian Herrera", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"],
  series: [{ name: "Velocity", data: [34800, 31200, 27600, 24100, 19400] }],
};

// #vel_inputs_chart - Velocity Inputs Over Time (opportunities, win rate, cycle)
export const VelocityInputsChart = {
  categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  series: [
    { name: "Opportunities", data: [41, 44, 46, 49, 51, 53] },
    { name: "Win rate %", data: [52, 54, 56, 58, 60, 61] },
    { name: "Cycle (days)", data: [58, 55, 53, 50, 48, 46] },
  ],
};

// #vel_value_chart - Deal Value Trend
export const VelocityDealValueChart = {
  categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  series: [{ name: "Avg. deal value", data: [36200, 37400, 38900, 40100, 41300, 42400] }],
};

// ---- Period Comparison table (data-vel-compare) ----------------------------
// Precomputed from VelocityPeriods using the same math as renderComparison()
// in report.js: velocity = opps*value*win/cycle, sales cycle direction is
// inverted (shorter is better) before the delta is computed.

export interface VelocityComparisonRow {
  key: string;
  Metric: string;
  ThisQuarter: string;
  LastQuarter: string;
  ChangeVsLastQuarter: number;
  Target: string;
  ChangeVsTarget: number;
}

export const VelocityComparisonData: VelocityComparisonRow[] = [
  { key: "1", Metric: "Sales velocity", ThisQuarter: "FCFA 29,800", LastQuarter: "FCFA 20,941", ChangeVsLastQuarter: 42, Target: "FCFA 41,786", ChangeVsTarget: -29 },
  { key: "2", Metric: "Opportunities", ThisQuarter: "53", LastQuarter: "48", ChangeVsLastQuarter: 10, Target: "60", ChangeVsTarget: -12 },
  { key: "3", Metric: "Avg. deal value", ThisQuarter: "FCFA 42,400", LastQuarter: "FCFA 39,800", ChangeVsLastQuarter: 7, Target: "FCFA 45,000", ChangeVsTarget: -6 },
  { key: "4", Metric: "Win rate", ThisQuarter: "61%", LastQuarter: "57%", ChangeVsLastQuarter: 7, Target: "65%", ChangeVsTarget: -6 },
  { key: "5", Metric: "Sales cycle", ThisQuarter: "46 days", LastQuarter: "52 days", ChangeVsLastQuarter: 12, Target: "42 days", ChangeVsTarget: -10 },
];

// ---- Velocity by Dimension table (data-vel-dim / data-vel-body) -----------
// Same column set for all three dimensions (Dimension, Opportunities,
// Avg. deal value, Win rate, Sales cycle, Velocity / day) - only the row
// label and figures change. All rows link to the deals grid.

export interface VelocityDimensionRow {
  key: string;
  Dimension: string;
  Opportunities: number;
  AvgDealValue: string;
  WinRate: string;
  SalesCycle: string;
  VelocityPerDay: string;
  Link: string;
}

export type VelocityDimensionKey = "stage" | "source" | "product";

export const VelocityByStageData: VelocityDimensionRow[] = [
  { key: "1", Dimension: "Qualification", Opportunities: 18, AvgDealValue: "FCFA 28,400", WinRate: "32%", SalesCycle: "12 days", VelocityPerDay: "FCFA 13,100", Link: all_routes.dealsGrid },
  { key: "2", Dimension: "Needs Analysis", Opportunities: 14, AvgDealValue: "FCFA 34,900", WinRate: "44%", SalesCycle: "15 days", VelocityPerDay: "FCFA 14,300", Link: all_routes.dealsGrid },
  { key: "3", Dimension: "Proposal Sent", Opportunities: 11, AvgDealValue: "FCFA 41,600", WinRate: "56%", SalesCycle: "19 days", VelocityPerDay: "FCFA 13,500", Link: all_routes.dealsGrid },
  { key: "4", Dimension: "Negotiation", Opportunities: 7, AvgDealValue: "FCFA 58,200", WinRate: "74%", SalesCycle: "14 days", VelocityPerDay: "FCFA 21,500", Link: all_routes.dealsGrid },
  { key: "5", Dimension: "Contract Review", Opportunities: 3, AvgDealValue: "FCFA 72,800", WinRate: "91%", SalesCycle: "9 days", VelocityPerDay: "FCFA 22,100", Link: all_routes.dealsGrid },
];

export const VelocityBySourceData: VelocityDimensionRow[] = [
  { key: "1", Dimension: "Referral", Opportunities: 9, AvgDealValue: "FCFA 54,700", WinRate: "79%", SalesCycle: "38 days", VelocityPerDay: "FCFA 10,200", Link: all_routes.dealsGrid },
  { key: "2", Dimension: "Webinar", Opportunities: 12, AvgDealValue: "FCFA 38,900", WinRate: "62%", SalesCycle: "44 days", VelocityPerDay: "FCFA 6,600", Link: all_routes.dealsGrid },
  { key: "3", Dimension: "Outbound", Opportunities: 16, AvgDealValue: "FCFA 49,200", WinRate: "57%", SalesCycle: "49 days", VelocityPerDay: "FCFA 9,200", Link: all_routes.dealsGrid },
  { key: "4", Dimension: "Trade Show", Opportunities: 9, AvgDealValue: "FCFA 42,600", WinRate: "52%", SalesCycle: "47 days", VelocityPerDay: "FCFA 4,200", Link: all_routes.dealsGrid },
  { key: "5", Dimension: "Paid Search", Opportunities: 7, AvgDealValue: "FCFA 27,400", WinRate: "30%", SalesCycle: "55 days", VelocityPerDay: "FCFA 1,000", Link: all_routes.dealsGrid },
];

export const VelocityByProductData: VelocityDimensionRow[] = [
  { key: "1", Dimension: "CRM Platform", Opportunities: 21, AvgDealValue: "FCFA 52,400", WinRate: "66%", SalesCycle: "45 days", VelocityPerDay: "FCFA 16,100", Link: all_routes.dealsGrid },
  { key: "2", Dimension: "Analytics Add-on", Opportunities: 13, AvgDealValue: "FCFA 28,900", WinRate: "63%", SalesCycle: "41 days", VelocityPerDay: "FCFA 5,800", Link: all_routes.dealsGrid },
  { key: "3", Dimension: "Support Plus", Opportunities: 11, AvgDealValue: "FCFA 18,600", WinRate: "58%", SalesCycle: "36 days", VelocityPerDay: "FCFA 3,300", Link: all_routes.dealsGrid },
  { key: "4", Dimension: "Migration Service", Opportunities: 8, AvgDealValue: "FCFA 34,100", WinRate: "48%", SalesCycle: "52 days", VelocityPerDay: "FCFA 2,500", Link: all_routes.dealsGrid },
];

// Convenience lookup keyed by the data-vel-dim button value, e.g.
// VelocityDimensionTables[activeDim].
export const VelocityDimensionTables: Record<VelocityDimensionKey, VelocityDimensionRow[]> = {
  stage: VelocityByStageData,
  source: VelocityBySourceData,
  product: VelocityByProductData,
};

export const VelocityDimensionLabels: Record<VelocityDimensionKey, string> = {
  stage: "Stage",
  source: "Source",
  product: "Product",
};
