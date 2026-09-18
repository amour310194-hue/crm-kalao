import { all_routes } from "@/router/all_routes";

/*
  Data for the Win/Loss Analysis page (win-loss-analysis.html -> a future
  Pages/reports/win-loss-analysis/winLossAnalysis.tsx).
  Ported from html/assets/js/report.js, section 5 "Win/Loss Analysis", plus
  the static KPI markup in html/win-loss-analysis.html (KPI cards are
  hand-authored HTML in the template, not JS-rendered).
  Pure data only - no chart rendering or DOM logic here.
*/

// ---- KPI cards -------------------------------------------------------------

export const WinLossKpis = {
  totalDeals: { label: "Total Deals", value: "163", note: "Closed in the period" },
  wonDeals: { label: "Won Deals", value: "98", note: "$4.52M won" },
  lostDeals: { label: "Lost Deals", value: "65", note: "$2.14M lost" },
  winRate: { label: "Win Rate", value: "60.1%", wonPct: 60.1, lostPct: 39.9 },
  avgDealValue: { label: "Avg. Deal Value", value: "$46,122", deltaLabel: "6.4% vs prior", deltaDirection: "up" as const },
  avgSalesCycle: { label: "Avg. Sales Cycle", value: "46 days", deltaLabel: "6 days faster", deltaDirection: "down" as const },
};

// ---- charts -----------------------------------------------------------

// #wl_trend_chart - Win/Loss Trend (stacked bar, won vs lost per month)
export const WinLossTrendChart = {
  categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  series: [
    { name: "Won", data: [14, 17, 15, 21, 19, 24] },
    { name: "Lost", data: [11, 9, 13, 10, 12, 9] },
  ],
};

// #wl_reason_chart - Lost Deal Reasons.
// Note: in report.js this renders as a horizontal bar chart, not a donut,
// despite the "lost-reasons donut" shorthand commonly used for this card -
// data is the count of lost deals per reason.
export const WinLossLostReasonsChart = {
  categories: ["Price too high", "Lost to competitor", "No budget", "No decision", "Missing feature", "Bad timing"],
  series: [{ name: "Lost deals", data: [18, 14, 11, 8, 6, 4] }],
};

// #wl_competitor_chart - Competitor Analysis (won against / lost to, per competitor)
export const WinLossCompetitorChart = {
  categories: ["Northstar CRM", "Vantage Suite", "Apex Cloud", "In-house build"],
  series: [
    { name: "Won against", data: [12, 8, 9, 5] },
    { name: "Lost to", data: [6, 11, 4, 7] },
  ],
};

// #wl_cycle_chart - Sales Cycle Comparison (days to close, won vs lost, by deal size)
export const WinLossCycleChart = {
  categories: ["< $25K", "$25-50K", "$50-100K", "> $100K"],
  series: [
    { name: "Won", data: [34, 41, 38, 46] },
    { name: "Lost", data: [58, 64, 71, 62] },
  ],
};

// ---- Win/Loss by Dimension table (data-wl-tab / data-wl-body) -------------
// Column set differs by dimension: every breakdown ends with a metric
// column that is "Avg. Value" for rep/industry/source/product but
// "Avg. Cycle" for deal size (BREAKDOWN in report.js).

export type WinLossDimensionKey = "rep" | "industry" | "source" | "size" | "product";

export interface WinLossDimensionRow {
  key: string;
  Dimension: string;
  Deals: number;
  Won: number;
  Lost: number;
  WinRate: number;
  /** formatted value for this row's metric column, see WinLossDimensionColumns for its label */
  Metric: string;
  Link: string;
}

// Header labels per dimension: [dimension column label, metric column label].
export const WinLossDimensionColumns: Record<WinLossDimensionKey, { dimensionLabel: string; metricLabel: string }> = {
  rep: { dimensionLabel: "Sales Rep", metricLabel: "Avg. Value" },
  industry: { dimensionLabel: "Industry", metricLabel: "Avg. Value" },
  source: { dimensionLabel: "Source", metricLabel: "Avg. Value" },
  size: { dimensionLabel: "Deal Size", metricLabel: "Avg. Cycle" },
  product: { dimensionLabel: "Product", metricLabel: "Avg. Value" },
};

export const WinLossByRepData: WinLossDimensionRow[] = [
  { key: "1", Dimension: "Ellis Vandermeer", Deals: 34, Won: 24, Lost: 10, WinRate: 71, Metric: "$46,200", Link: all_routes.manageusers },
  { key: "2", Dimension: "Adrian Herrera", Deals: 41, Won: 27, Lost: 14, WinRate: 66, Metric: "$52,800", Link: all_routes.manageusers },
  { key: "3", Dimension: "Priya Raghunathan", Deals: 29, Won: 17, Lost: 12, WinRate: 59, Metric: "$38,400", Link: all_routes.manageusers },
  { key: "4", Dimension: "Tomas Lindqvist", Deals: 33, Won: 18, Lost: 15, WinRate: 55, Metric: "$61,500", Link: all_routes.manageusers },
  { key: "5", Dimension: "Nadia Okonkwo", Deals: 26, Won: 12, Lost: 14, WinRate: 46, Metric: "$29,700", Link: all_routes.manageusers },
];

export const WinLossByIndustryData: WinLossDimensionRow[] = [
  { key: "1", Dimension: "Financial Services", Deals: 38, Won: 26, Lost: 12, WinRate: 68, Metric: "$58,900", Link: all_routes.companiesGrid },
  { key: "2", Dimension: "Healthcare", Deals: 31, Won: 20, Lost: 11, WinRate: 65, Metric: "$47,300", Link: all_routes.companiesGrid },
  { key: "3", Dimension: "Technology", Deals: 34, Won: 20, Lost: 14, WinRate: 59, Metric: "$41,600", Link: all_routes.companiesGrid },
  { key: "4", Dimension: "Logistics", Deals: 28, Won: 15, Lost: 13, WinRate: 54, Metric: "$36,200", Link: all_routes.companiesGrid },
  { key: "5", Dimension: "Manufacturing", Deals: 22, Won: 9, Lost: 13, WinRate: 41, Metric: "$33,800", Link: all_routes.companiesGrid },
  { key: "6", Dimension: "Media", Deals: 10, Won: 8, Lost: 2, WinRate: 80, Metric: "$24,100", Link: all_routes.companiesGrid },
];

export const WinLossBySourceData: WinLossDimensionRow[] = [
  { key: "1", Dimension: "Referral", Deals: 24, Won: 19, Lost: 5, WinRate: 79, Metric: "$54,700", Link: all_routes.leads },
  { key: "2", Dimension: "Webinar", Deals: 29, Won: 18, Lost: 11, WinRate: 62, Metric: "$38,900", Link: all_routes.leads },
  { key: "3", Dimension: "Outbound", Deals: 42, Won: 24, Lost: 18, WinRate: 57, Metric: "$49,200", Link: all_routes.leads },
  { key: "4", Dimension: "Trade Show", Deals: 31, Won: 16, Lost: 15, WinRate: 52, Metric: "$42,600", Link: all_routes.leads },
  { key: "5", Dimension: "Paid Search", Deals: 37, Won: 11, Lost: 26, WinRate: 30, Metric: "$27,400", Link: all_routes.leads },
];

export const WinLossByDealSizeData: WinLossDimensionRow[] = [
  { key: "1", Dimension: "Under $25K", Deals: 52, Won: 36, Lost: 16, WinRate: 69, Metric: "34 days", Link: all_routes.dealsGrid },
  { key: "2", Dimension: "$25K - $50K", Deals: 48, Won: 29, Lost: 19, WinRate: 60, Metric: "41 days", Link: all_routes.dealsGrid },
  { key: "3", Dimension: "$50K - $100K", Deals: 41, Won: 21, Lost: 20, WinRate: 51, Metric: "52 days", Link: all_routes.dealsGrid },
  { key: "4", Dimension: "Over $100K", Deals: 22, Won: 12, Lost: 10, WinRate: 55, Metric: "61 days", Link: all_routes.dealsGrid },
];

export const WinLossByProductData: WinLossDimensionRow[] = [
  { key: "1", Dimension: "CRM Platform", Deals: 61, Won: 40, Lost: 21, WinRate: 66, Metric: "$52,400", Link: all_routes.products },
  { key: "2", Dimension: "Analytics Add-on", Deals: 38, Won: 24, Lost: 14, WinRate: 63, Metric: "$28,900", Link: all_routes.products },
  { key: "3", Dimension: "Support Plus", Deals: 33, Won: 19, Lost: 14, WinRate: 58, Metric: "$18,600", Link: all_routes.products },
  { key: "4", Dimension: "Migration Service", Deals: 31, Won: 15, Lost: 16, WinRate: 48, Metric: "$34,100", Link: all_routes.products },
];

// Convenience lookup keyed by the data-wl-tab button value, e.g.
// WinLossDimensionTables[activeTab].
export const WinLossDimensionTables: Record<WinLossDimensionKey, WinLossDimensionRow[]> = {
  rep: WinLossByRepData,
  industry: WinLossByIndustryData,
  source: WinLossBySourceData,
  size: WinLossByDealSizeData,
  product: WinLossByProductData,
};

// ---- Filters (Date range / Sales rep / Team / Industry / Source / Lost reason) --

export const WinLossFilterOptions = {
  ranges: ["Last 6 months", "This Quarter", "This Year", "Custom range"],
  reps: ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"],
  teams: ["Enterprise", "Mid-Market", "SMB"],
  industries: ["Financial Services", "Healthcare", "Technology", "Logistics", "Manufacturing", "Media"],
  sources: ["Referral", "Webinar", "Outbound", "Trade Show", "Paid Search"],
  lostReasons: ["Price too high", "Lost to competitor", "No budget", "No decision", "Missing feature"],
};
