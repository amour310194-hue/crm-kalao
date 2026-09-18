
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const usageChartOptions: ApexOptions = {
  chart: {
    height: 250,
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: false },
  },
  colors: ["#EEB68D"],
  dataLabels: { enabled: false },
  stroke: { show: true, curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  grid: {
    show: true,
    borderColor: "#E2E2E2",
    strokeDashArray: 3,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
    padding: { left: 0, right: 0, bottom: -10 },
  },
  xaxis: {
    categories: ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", ""],
    labels: { style: { colors: "#94A3B8", fontSize: "14px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 200,
    tickAmount: 4,
    labels: { style: { colors: "#94A3B8", fontSize: "14px" }, offsetX: -10 },
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    custom: ({ series, seriesIndex, dataPointIndex }) => {
      return ` <div class="custom-tooltip"> <span>${series[seriesIndex][dataPointIndex]} Users</span> </div> `;
    },
    x: { show: false },
    marker: { show: false },
  },
};
const usageChartSeries = [
  { name: "Users", data: [200, 195, 185, 160, 200, 175, 155, 210, 160] },
];
const UsageChartOption = () => {
  return (
    <Chart
      options={usageChartOptions}
      series={usageChartSeries}
      type="area"
      height={250}
    />
  );
};
export default UsageChartOption;
