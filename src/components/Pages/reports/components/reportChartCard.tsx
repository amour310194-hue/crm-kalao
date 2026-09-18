"use client";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import type { ApexOptions } from "apexcharts";

/*
  A single chart card as used across the Reports module.

  The ApexCharts configs are ported verbatim from the reference's
  html/assets/plugins/apexchart/chart-data.js, where each lives inside an
  `if (document.querySelector('#<id>'))` guard. Here they are plain option
  objects handed to react-apexcharts.
*/

interface ReportChartCardProps {
  title: string;
  /** Optional right-hand control in the card header (e.g. a year dropdown). */
  action?: React.ReactNode;
  options: ApexOptions;
  series: ApexOptions["series"];
  type:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "radar"
    | "polarArea"
    | "scatter"
    | "heatmap";
  height?: number;
  /** Bootstrap column classes for the wrapper. */
  className?: string;
}

const ReportChartCard = ({
  title,
  action,
  options,
  series,
  type,
  height = 320,
  className = "col-md-6",
}: ReportChartCardProps) => (
  <div className={className}>
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h5 className="mb-0">{title}</h5>
        {action}
      </div>
      <div className="card-body">
        <Chart options={options} series={series} type={type} height={height} />
      </div>
    </div>
  </div>
);

export default ReportChartCard;
