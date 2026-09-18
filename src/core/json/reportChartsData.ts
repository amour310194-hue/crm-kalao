import type { ApexOptions } from "apexcharts";

/*
  ApexCharts configs for the Reports module, ported from the reference's
  html/assets/plugins/apexchart/chart-data.js. Each config there lives inside an
  `if (document.querySelector('#<id>'))` guard; the guard id is noted above each
  export so the two stay traceable.

  Series are kept separate from options because react-apexcharts takes them as
  distinct props.
*/

// #login-split - user-login-report
export const LoginSplitSeries = [
  { name: "Successful Logins", data: [400, 430, 500, 400, 405, 470, 460, 560, 480, 550] },
  { name: "Failed Logins", data: [160, 200, 280, 220, 230, 180, 240, 320, 240, 310] },
];

export const LoginSplitOptions: ApexOptions = {
  chart: { type: "area", height: 320, toolbar: { show: false }, zoom: { enabled: false } },
  colors: ["#27AE60", "#EF1E1E"],
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  fill: { type: "solid", opacity: 0.05 },
  legend: { show: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    labels: { style: { fontSize: "14px" } },
  },
  yaxis: { tickAmount: 6, labels: { style: { fontSize: "14px" } } },
  grid: { borderColor: "#e5e7eb", strokeDashArray: 6 },
  markers: { size: 0 },
  tooltip: { marker: { show: false }, shared: true, intersect: false },
};

// #monthly_contract - contract-report
export const MonthlyContractSeries = [
  { name: "Revenue", type: "column", data: [42, 38, 45, 40, 48, 52, 47, 56, 51, 58, 60, 63] },
  { name: "Revenue Line", type: "line", data: [42, 38, 45, 40, 48, 52, 47, 56, 51, 58, 60, 63] },
];

export const MonthlyContractOptions: ApexOptions = {
  chart: { height: 292, type: "line", toolbar: { show: false } },
  colors: ["#F59E0B", "#F59E0B"],
  stroke: { width: [0, 3], curve: "smooth" },
  plotOptions: {
    bar: { columnWidth: "65%", borderRadius: 6, borderRadiusApplication: "end" },
  },
  fill: {
    type: ["gradient", "solid"],
    gradient: {
      shade: "light",
      type: "vertical",
      gradientToColors: ["#FDBA74"],
      opacityFrom: 1,
      opacityTo: 0.25,
      stops: [0, 100],
    },
  },
  markers: { size: 5, colors: ["#FF9500"], strokeColors: "#ffffff", strokeWidth: 3 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisBorder: { show: true, color: "#E5E7EB" },
    axisTicks: { show: false },
    labels: { style: { fontSize: "12px", colors: "#6B7280" } },
  },
  yaxis: {
    min: 0,
    max: 70,
    tickAmount: 4,
    labels: { style: { fontSize: "12px", colors: "#6B7280" } },
  },
  grid: {
    show: true,
    borderColor: "#E5E7EB",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  legend: { show: false },
  tooltip: { marker: { show: false }, theme: "light" },
};

// #renewal_expiry - contract-renewal-expiry-report
export const RenewalExpirySeries = [
  { name: "Renewed Contracts", data: [40, 35, 50, 45, 55, 60] },
  { name: "Expired Contracts", data: [12, 15, 8, 10, 7, 14] },
];

export const RenewalExpiryOptions: ApexOptions = {
  chart: { type: "bar", height: 292, toolbar: { show: false } },
  plotOptions: {
    bar: { columnWidth: "45%", borderRadius: 6, borderRadiusApplication: "end" },
  },
  dataLabels: { enabled: false },
  stroke: { show: false },
  colors: ["#7C3AED", "#EF4444"],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: "10px", colors: "#94A3B8" } },
  },
  yaxis: { show: true, labels: { style: { fontSize: "10px", colors: "#94A3B8" } } },
  grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
  legend: { show: false },
  tooltip: { marker: { show: false } },
  responsive: [
    { breakpoint: 768, options: { plotOptions: { bar: { columnWidth: "55%" } } } },
  ],
};

// #leads-funnel-chart - lead-funnel-report
const FUNNEL_PERCENTS = ["33.7%", "25.28%", "16.85%", "11.24%", "8.43%", "4.49%"];
const FUNNEL_LABELS = ["800 Leads", "600 Leads", "400 Leads", "300 Leads", "200 Leads", "100 Leads"];
const FUNNEL_STAGES = ["New", "Contacted", "Qualified", "Converted", "Won", "Lost"];

export const LeadsFunnelSeries = [{ name: "Leads", data: [800, 600, 400, 300, 200, 100] }];

export const LeadsFunnelOptions: ApexOptions = {
  chart: { type: "bar", height: 470, toolbar: { show: false } },
  plotOptions: {
    bar: {
      columnWidth: "80%",
      borderRadius: 12,
      distributed: true,
      dataLabels: { position: "top" },
    },
  },
  stroke: { show: true, width: 1, colors: ["#E0E0E0"] },
  colors: ["#FFE0B2", "#FFE0B2", "#FFA201", "#FFE0B2", "#FFE0B2", "#FFE0B2"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      inverseColors: false,
      opacityFrom: 1,
      // index 2 (Qualified) stays solid, the rest fade
      opacityTo: [0.3, 0.3, 1, 0.3, 0.3, 0.3],
      stops: [0, 100],
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -25,
    style: { fontSize: "13px", fontWeight: 600, colors: ["#333"] },
    formatter: (_val: any, opts: any) => FUNNEL_PERCENTS[opts.dataPointIndex],
  },
  xaxis: {
    categories: FUNNEL_STAGES,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: "14px", fontWeight: 600, colors: "#1f2020" } },
  },
  yaxis: { show: false },
  grid: { show: false },
  legend: { show: false },
  annotations: {
    points: FUNNEL_STAGES.map((stage, i) => ({
      x: stage,
      y: 40,
      marker: { size: 0 },
      label: {
        text: FUNNEL_LABELS[i],
        borderWidth: 0,
        style:
          i === 2
            ? { background: "transparent", color: "#fff", fontWeight: 700 }
            : { background: "transparent", color: "#666" },
      },
    })),
  },
};

// #proposal-conversion-rate-chart - proposal-conversion-rate-report
export const ProposalConversionSeries = [
  { name: "High", data: [28, 29, 33, 36, 32, 32, 33, 35, 38, 34, 31, 25] },
  { name: "Low", data: [12, 11, 14, 18, 17, 13, 13, 15, 18, 16, 14, 10] },
];

export const ProposalConversionOptions: ApexOptions = {
  chart: {
    height: 350,
    type: "line",
    toolbar: { show: false },
    zoom: { enabled: false },
    dropShadow: { enabled: false },
  },
  colors: ["#3B82F6", "#10B981"],
  stroke: { curve: "smooth", width: 3 },
  markers: {
    size: 5,
    colors: ["#3B82F6", "#10B981"],
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: { size: 7 },
  },
  grid: {
    show: true,
    borderColor: "#f1f1f1",
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    strokeDashArray: 4,
  },
  dataLabels: { enabled: false },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { min: 0, max: 40, tickAmount: 4, labels: { style: { colors: "#9CA3AF" } } },
  legend: { show: false, position: "top", horizontalAlign: "right", offsetY: -10 },
};

// #sales-rep-chart - sales-rep-comparison-report
export const SalesRepSeries = [
  { name: "Deals Closed", type: "column", data: [45, 38, 32, 28, 26, 22] },
  { name: "Revenue", type: "line", data: [290, 240, 200, 175, 160, 145] },
];

export const SalesRepOptions: ApexOptions = {
  chart: { height: 280, type: "line", toolbar: { show: false } },
  stroke: { width: [0, 3], curve: "straight" },
  colors: ["#667eea", "#42B96A"],
  plotOptions: {
    bar: { columnWidth: "55%", borderRadius: 8, borderRadiusApplication: "end" },
  },
  fill: {
    type: ["gradient", "solid"],
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.9,
      opacityTo: 0.6,
      stops: [0, 100],
      colorStops: [
        [
          { offset: 0, color: "#667eea", opacity: 0.9 },
          { offset: 100, color: "#667eea", opacity: 0.6 },
        ],
        [],
      ],
    },
  },
  markers: { size: 6, colors: ["#42B96A"], strokeWidth: 0 },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["John S.", "Sarah J.", "Mike D.", "Emma W.", "David B.", "Lisa A."],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#888", fontSize: "13px" } },
  },
  yaxis: [
    {
      min: 0,
      max: 60,
      tickAmount: 4,
      axisBorder: { show: true, color: "#eef0f2" },
      labels: { style: { colors: "#888" }, offsetX: -20 },
    },
    {
      opposite: true,
      min: 0,
      max: 300,
      tickAmount: 4,
      axisBorder: { show: true, color: "#eef0f2" },
      labels: {
        style: { colors: "#888" },
        formatter: (val: number) => "$" + val + "K",
      },
    },
  ],
  grid: {
    show: true,
    borderColor: "#eef0f2",
    strokeDashArray: 4,
    position: "back",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: -50, bottom: 0, left: -20 },
  },
  legend: { show: false },
};

// #deal-aging - deal-aging-report
export const DealAgingSeries = [
  {
    name: "Won",
    data: [[4, 30000], [5, 35000], [6, 42000], [8, 33000], [12, 38000], [16, 45000], [20, 52000], [25, 55000], [27, 62000], [30, 48000]],
  },
  {
    name: "Lost",
    data: [[4, 11000], [5, 21000], [7, 16000], [9, 19000], [11, 25000], [15, 31000], [18, 35000], [22, 38000], [26, 41000], [29, 54000]],
  },
];

export const DealAgingOptions: ApexOptions = {
  chart: { type: "scatter", height: 390, zoom: { enabled: false }, toolbar: { show: false } },
  colors: ["#27AE60", "#EF1E1E"],
  legend: { show: false },
  xaxis: { tickAmount: 10, labels: { style: { fontSize: "14px" } } },
  yaxis: {
    tickAmount: 5,
    labels: {
      style: { fontSize: "14px" },
      formatter: (val: number) => "$" + val / 1000 + "K",
    },
  },
  markers: { size: 7 },
  grid: { borderColor: "#e5e7eb", strokeDashArray: 5 },
  tooltip: {
    marker: { show: false },
    y: { formatter: (val: number) => "$" + val.toLocaleString() },
  },
};

// #risk-level - deal-aging-report
export const DealRiskLevelSeries = [16, 67, 24, 34];

export const DealRiskLevelOptions: ApexOptions = {
  chart: { type: "donut", height: 350 },
  colors: ["#DD2590", "#E2B93B", "#EF1E1E", "#27AE60"],
  labels: ["Critical", "Medium", "High", "Low"],
  plotOptions: { pie: { expandOnClick: false, donut: { size: "60%" } } },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { y: { formatter: (val: number) => String(val) } },
  stroke: { width: 8, colors: ["#ffffff"] },
  responsive: [{ breakpoint: 575, options: { chart: { height: 230 } } }],
};

// #estimation-trend-chart - deal-conversion-report
export const EstimationTrendSeries = [{ name: "Metrics", data: [46, 88, 64, 33, 52] }];

export const EstimationTrendOptions: ApexOptions = {
  colors: ["#F23838"],
  chart: { height: 375, type: "bar", toolbar: { show: false }, sparkline: { enabled: false } },
  plotOptions: {
    bar: { columnWidth: "60%", borderRadius: 8, borderRadiusApplication: "end" },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: ["#FFFFFF"],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  dataLabels: { enabled: false },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["Quality To Buy", "Contact Made", "Presentation", "Proposal Made", "Appointment"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#888888", fontSize: "13px", fontWeight: 500 }, offsetY: 0 },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: { show: true, style: { colors: "#888888", fontSize: "13px" }, offsetX: -15 },
  },
  grid: {
    show: true,
    borderColor: "#f1f1f1",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: -30, bottom: -10, left: -15 },
  },
  legend: { show: false },
};

// #deals-status-chart - deal-conversion-report
export const DealsStatusSeries = [50, 30, 20];

export const DealsStatusOptions: ApexOptions = {
  chart: { height: 350, type: "pie" },
  labels: ["Completed", "Pending", "In-Progress"],
  colors: ["#27A361", "#3237D3", "#E91F1F"],
  legend: { show: false },
  stroke: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => Math.round(val) + "%",
    style: {
      fontSize: "14px",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontWeight: "bold",
      colors: ["#fff"],
    },
    dropShadow: { enabled: false },
  },
  plotOptions: { pie: { expandOnClick: true, dataLabels: { offset: -10 } } },
  tooltip: { enabled: true, y: { formatter: (val: number) => val + "%" } },
};

// #risk-level-chart - lead-aging-report
export const LeadRiskLevelSeries = [240, 670, 340, 160];

export const LeadRiskLevelOptions: ApexOptions = {
  chart: { height: 300, type: "donut" },
  labels: ["High", "Medium", "Low", "Critical"],
  colors: ["#F13535", "#E2B93B", "#27AE60", "#DD2590"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "65%" } } },
};

// #aging-bucket-chart - lead-aging-report
export const AgingBucketSeries = [{ name: "Leads", data: [540, 740, 580, 360] }];

export const AgingBucketOptions: ApexOptions = {
  chart: { type: "bar", height: 380, toolbar: { show: false } },
  plotOptions: {
    bar: { horizontal: true, barHeight: "70%", borderRadius: 10, borderRadiusApplication: "end" },
  },
  colors: ["#FF9292"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.25,
      inverseColors: true,
      opacityFrom: 0.1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["0-2 Days", "3-7 Days", "8-14 Days", "15+ Days"],
    min: 0,
    max: 800,
    tickAmount: 8,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#888888", fontSize: "12px" } },
  },
  yaxis: { labels: { style: { colors: "#888888", fontSize: "12px" } } },
  tooltip: { marker: { show: false } },
  grid: {
    show: true,
    borderColor: "#f1f1f1",
    strokeDashArray: 3,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
    padding: { top: 0, right: 20, bottom: -10, left: -5 },
  },
  legend: { show: false },
};

// #monthly-estimation - estimation-report
export const MonthlyEstimationSeries = [
  { name: "Revenue", data: [420000, 580000, 720000, 650000, 820000, 930000] },
];

export const MonthlyEstimationOptions: ApexOptions = {
  chart: { type: "area", height: 280, toolbar: { show: false } },
  colors: ["#16A34A"],
  stroke: { curve: "smooth", width: 4 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 90, 100] },
  },
  dataLabels: { enabled: false },
  markers: { size: 0 },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    labels: { style: { fontSize: "12px" } },
  },
  yaxis: {
    min: 0,
    max: 1000000,
    tickAmount: 4,
    labels: {
      formatter: (value: number) => "$" + value / 1000 + "K",
      style: { fontSize: "12px" },
    },
  },
  grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
  legend: { show: false },
};

// #performance-metrics - estimation-report
export const PerformanceMetricsSeries = [85, 42, 8];

export const PerformanceMetricsOptions: ApexOptions = {
  chart: { type: "radialBar", height: 350 },
  colors: ["#16A34A", "#0EA5B7", "#FACC15"],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { margin: 0, size: "20%", background: "transparent" },
      track: { background: "#E5E7EB", strokeWidth: "100%", margin: 10 },
      dataLabels: { show: false },
    },
  },
  stroke: { lineCap: "round" },
  labels: ["Conversion Rate", "Client Satisfaction", "On-Time Delivery"],
  legend: { show: false },
};

// #pipeline-stage-report - pipeline-stage-report
export const PipelineStageSeries = [{ name: "Pipeline", data: [45, 75, 68, 80, 61] }];

export const PipelineStageOptions: ApexOptions = {
  chart: { type: "area", height: 340, toolbar: { show: false } },
  colors: ["#4F46E5"],
  stroke: { curve: "stepline", width: 2 },
  fill: { type: "gradient", opacity: 0.05 },
  dataLabels: { enabled: false },
  markers: { size: 0 },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["Quality To Buy", "Contact Made", "Presentation", "Proposal Made", "Appointment"],
    labels: { style: { fontSize: "12px" } },
  },
  yaxis: { min: 0, max: 100, tickAmount: 5, labels: { style: { fontSize: "12px" } } },
  grid: { borderColor: "#e5e7eb", strokeDashArray: 5 },
  legend: { show: false },
};

// #win-rate - pipeline-stage-report
export const WinRateSeries = [{ name: "Win Rate", data: [65, 40, 70, 55, 75] }];

export const WinRateOptions: ApexOptions = {
  chart: { type: "radar", height: 340, toolbar: { show: false } },
  colors: ["#16A34A"],
  stroke: { width: 2 },
  fill: { opacity: 0.2 },
  markers: { size: 5, colors: ["#16A34A"], strokeColors: "#ffffff", strokeWidth: 2 },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["Quality to Buy", "Contact Made", "Presentation", "Proposal Made", "Appointment"],
    labels: { style: { fontSize: "13px" } },
  },
  yaxis: { min: 0, max: 100, tickAmount: 0, labels: { show: false } },
  grid: { borderColor: "#e5e7eb" },
  legend: { show: false },
};

// #revenue-split-report - revenue-report
export const RevenueSplitSeries = [
  { name: "Revenue A", type: "column", data: [20, 15, 45, 65, 40, 30, 48, 50, 47, 46, 46, 47] },
  { name: "Revenue B", type: "column", data: [55, 50, 28, 80, 85, 75, 85, 120, 98, 80, 68, 98] },
  { name: "Total", type: "line", data: [105, 75, 130, 170, 150, 130, 150, 190, 160, 145, 130, 165] },
];

export const RevenueSplitOptions: ApexOptions = {
  chart: { height: 260, type: "line", stacked: true, toolbar: { show: false } },
  colors: ["#18A0B6", "#158F7E", "#D4A017"],
  stroke: { width: [0, 0, 2], curve: "smooth" },
  plotOptions: { bar: { columnWidth: "45%", borderRadius: 0 } },
  markers: { size: 5, strokeWidth: 2, strokeColors: "#ffffff" },
  dataLabels: { enabled: false },
  tooltip: { marker: { show: false } },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: { style: { fontSize: "13px" } },
  },
  yaxis: {
    min: 0,
    max: 250,
    tickAmount: 5,
    labels: { formatter: (val: number) => "$" + val + "K", style: { fontSize: "12px" } },
  },
  grid: { borderColor: "#e5e7eb", strokeDashArray: 5 },
  legend: { show: false },
};

// #growth - revenue-report
export const GrowthSeries = [75, 55];

export const GrowthOptions: ApexOptions = {
  chart: { type: "radialBar", height: 279, offsetY: -10, sparkline: { enabled: true } },
  colors: ["#2F6FD4", "#E4570F"],
  plotOptions: {
    radialBar: {
      startAngle: -140,
      endAngle: 220,
      hollow: { size: "60%" },
      track: { background: "#E5E7EB", strokeWidth: "100%", margin: 6 },
      dataLabels: { show: false },
    },
  },
  stroke: { lineCap: "round", width: 8 },
  grid: { padding: { top: -20, bottom: -20 } },
  legend: { show: false },
};

/*
  #attendance-summary-report-chart-1..4 - attendance-summary-report

  The four are identical sparkline bar charts differing only in colour ramp, so
  they are expressed as one factory over the ramps the reference defines.
*/
export const AttendanceSparkSeries = [
  { name: "Employees", data: [30, 45, 80, 70, 60, 85, 95, 80] },
];

export const AttendanceSparkRamps: Record<string, string[]> = {
  blue: ["#A5C2FB", "#94B4F9", "#82A6F7", "#7098F5", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"],
  green: ["#C1EAD1", "#A8E1BE", "#8FD8AB", "#76CF98", "#5DC685", "#44BD72", "#2BB45F", "#12AB4C"],
  purple: ["#D8B9E6", "#C99DDC", "#BA81D2", "#AB65C8", "#9C49BE", "#8D2DB4", "#7E11AA", "#6F00A0"],
  red: ["#F9C7C0", "#F7B0A7", "#F5998E", "#F38275", "#F16B5C", "#EF5443", "#ED3D2A", "#EB2611"],
};

export function attendanceSparkOptions(ramp: keyof typeof AttendanceSparkRamps): ApexOptions {
  return {
    chart: {
      width: 100,
      height: 40,
      type: "bar",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    plotOptions: { bar: { columnWidth: "65%", borderRadius: 3, distributed: true } },
    colors: AttendanceSparkRamps[ramp],
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: false },
    legend: { show: false },
  };
}

/*
  #leave-balance-report-chart-1..4 - leave-balance-summary-report

  Four half-gauge radialBars differing only in value and gradient colour pair.
*/
export const LeaveBalanceGauges = [
  { value: 80, from: "#1abe17", to: "#1abe178c", label: "Total Allocated" },
  { value: 60, from: "#dd2590", to: "#dd259054", label: "Used" },
  { value: 90, from: "#800080", to: "#8000806b", label: "Remaining" },
  { value: 70, from: "#ef1e1e", to: "#ef1e1e5e", label: "Pending" },
];

export function leaveBalanceGaugeOptions(from: string, to: string, label: string): ApexOptions {
  return {
    chart: { type: "radialBar", height: 100, width: 100, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: { background: "#e7e7e7", strokeWidth: "97%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: { offsetY: -2, fontSize: "22px", show: false },
        },
      },
    },
    grid: { padding: { top: -50 } },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
        colorStops: [
          { offset: 0, color: from, opacity: 1 },
          { offset: 100, color: to, opacity: 1 },
        ],
      },
    },
    labels: [label],
  };
}

/*
  #total-chart / #average-chart / #within-chart / #breach-chart
  - lead-conversion-time-report

  Four identical sparkline area charts differing only in data and colour.
*/
export const ConversionSparks = [
  { key: "total", data: [10, 85, 15, 45, 20, 50, 80, 15], color: "#5DB48A" },
  { key: "average", data: [20, 45, 85, 25, 40, 30, 80, 25], color: "#2F80ED" },
  { key: "within", data: [20, 35, 65, 25, 80, 80, 40, 25], color: "#E2B93B" },
  { key: "breach", data: [20, 85, 75, 25, 40, 30, 80, 25], color: "#EB7487" },
];

export function conversionSparkOptions(color: string): ApexOptions {
  return {
    chart: {
      height: 45,
      width: 80,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true },
    },
    colors: [color],
    stroke: { show: true, curve: "straight", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1, stops: [0, 90, 100] },
    },
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: true },
  };
}

// #lead-sources-chart - lead-conversion-time-report
export const LeadSourcesSeries = [
  { name: "Web Analytics", data: [2, 3, 3, 1] },
  { name: "Phone Calls", data: [1, 1, 1, 2] },
  { name: "Referrals", data: [3, 1, 2, 1] },
  { name: "Campaigns", data: [1, 1, 1, 3] },
  { name: "Google", data: [2, 3, 2, 1] },
];

export const LeadSourcesOptions: ApexOptions = {
  chart: { height: 280, type: "heatmap", toolbar: { show: false }, sparkline: { enabled: false } },
  plotOptions: {
    heatmap: {
      radius: 10,
      enableShades: false,
      colorScale: {
        ranges: [
          { from: 1, to: 1, color: "#F3E9D5" },
          { from: 2, to: 2, color: "#F5C77E" },
          { from: 3, to: 3, color: "#FF9800" },
        ],
      },
    },
  },
  dataLabels: { enabled: false },
  stroke: { width: 4, colors: ["#ffffff"] },
  xaxis: {
    categories: ["On Track", "Paused", "At Risk", "Breached"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { offsetY: 0, style: { fontSize: "12px", colors: "#666" } },
  },
  yaxis: { labels: { offsetX: 10, style: { fontSize: "12px", colors: "#666" } } },
  grid: { padding: { top: -10, right: 0, bottom: 0, left: 10 } },
  legend: { show: false },
};

/*
  #members-chart / #pending-chart / #total-deals-chart / #total-revenue-chart
  - team-performance-report

  Four identical sparkline area charts differing only in data and colour.
*/
export const TeamPerformanceSparks = [
  { key: "members", data: [45, 20, 50, 35, 75, 45, 65, 45, 60], color: "#27AE60" },
  { key: "pending", data: [35, 30, 40, 35, 45, 55, 35, 45, 60], color: "#EF1E1E" },
  { key: "totalDeals", data: [35, 55, 45, 60, 75, 35, 30, 65, 45], color: "#3538cd" },
  { key: "totalRevenue", data: [45, 20, 50, 35, 75, 55, 45, 45, 60], color: "#CC1EEF" },
];

export function teamPerformanceSparkOptions(color: string): ApexOptions {
  return {
    chart: {
      height: 80,
      width: "100%",
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true },
    },
    colors: [color],
    dataLabels: { enabled: false },
    stroke: { show: true, curve: "smooth", width: 1 },
    grid: { padding: { top: -20 } },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1, stops: [0, 90, 100] },
    },
  };
}
