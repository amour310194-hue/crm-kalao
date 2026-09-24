import React from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const TrafficSourcesChart: React.FC<{ labels?: string[]; values?: number[] }> = ({
  labels,
  values,
}) => {
  const series = values?.length ? values : [6598, 2458, 1456, 845];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 250,
    },

    labels: labels?.length
      ? labels
      : [
          "Organic Search",
          "Direct Traffic",
          "Referral Traffic",
          "Social Media",
        ],

    colors: ["#2EAD5F", "#3B82F6", "#F59E0B", "#8B0A8B"],

    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: false,
            },
          },
        },
      },
    },

    stroke: {
      width: 6,
      colors: ["#fff"],
    },

    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${Math.round(val)}%`;
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
      dropShadow: {
        enabled: false,
      },
    },

    legend: {
      show: false,
    },

    tooltip: {
      y: {
        formatter: (val: number) => {
          return val.toLocaleString("en-GB");
        },
      },
    },
  };

  return (
    <div id="traffic-sources-chart">
      <Chart
        options={options}
        series={series}
        type="donut"
        height={250}
      />
    </div>
  );
};

export default TrafficSourcesChart;