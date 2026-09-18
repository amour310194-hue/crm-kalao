
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const usageChartOptions: ApexOptions = {
  chart: { height: 350, type: "donut" },
  colors: ["#3538cd", "#71d1fb", "#f9b801", "#dd2590"],
  stroke: { show: true, width: 5, colors: ["#fff"] },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            offsetY: 5,
            formatter: (val: string) => `${val}%`,
          },
          total: {
            show: true,
            label: "Leads",
            color: "#111827",
            fontSize: "14px",
            formatter: () => "50%",
          },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { enabled: true },
};
const usageChartSeries = [50, 15, 20, 15];
const UsageChart = () => {
  return (
    <Chart
      options={usageChartOptions}
      series={usageChartSeries}
      type="donut"
      height={350}
    />
  );
};
export default UsageChart;
