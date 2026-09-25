import React from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

interface PerformanceStatsChartProps {
  categories?: string[];
  invoiced?: number[];
  collected?: number[];
}

const PerformanceStatsChart: React.FC<PerformanceStatsChartProps> = ({
  categories,
  invoiced,
  collected,
}) => {
  const series = [
    { name: "Facturé", type: "column" as const, data: invoiced?.length ? invoiced : [] },
    { name: "Encaissé", type: "area" as const, data: collected?.length ? collected : [] },
  ];

  const hasSeries = Boolean(categories?.length);

  const options: ApexOptions = {
    chart: {
      height: 355,
      type: "line",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    noData: { text: "Pas encore de données à afficher" },

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",
      },
    },

    grid: {
      padding: {
        right: -10,
        left: -15,
      },
      borderColor: "#f1f1f1",
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
      width: [0, 2],
      dashArray: [0, 0],
    },

    legend: {
      show: false,
      position: "bottom",
      markers: {
        size: 8,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },

    xaxis: {
      categories: categories?.length ? categories : [],
      axisBorder: {
        show: false,
        color: "rgba(119, 119, 142, 0.05)",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "rgba(119, 119, 142, 0.05)",
        offsetY: 0,
      },
      labels: {
        show: hasSeries,
      },
    },

    fill: {
      type: ["gradient", "solid"],
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        colorStops: [
          [
            {
              offset: 0,
              color: "#E41F07",
              opacity: 1,
            },
            {
              offset: 100,
              color: "#FF3A22",
              opacity: 1,
            },
          ],
          [
            {
              offset: 0,
              color: "#F0F0F0",
              opacity: 1,
            },
          ],
        ],
      },
      colors: ["#E41F07", "#F0F0F0"],
    },

    colors: ["#E41F07", "#F0F0F0"],

    yaxis: {
      min: 0,
      max: hasSeries ? undefined : 1,
      tickAmount: hasSeries ? undefined : 1,
      labels: {
        offsetX: -10,
        formatter: (value: number) => {
          return `${Math.round(value)}k FCFA`;
        },
      },
    },

    tooltip: {
      marker: {
        show: false,
      },
    },
  };

  return (
    <div id="performance-stats">
      <Chart
        options={options}
        series={series}
        type="line"
        height={355}
      />
    </div>
  );
};

export default PerformanceStatsChart;