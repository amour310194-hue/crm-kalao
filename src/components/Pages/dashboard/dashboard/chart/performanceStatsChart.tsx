import React from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const PerformanceStatsChart: React.FC = () => {
  const series = [
    {
      name: "Revenue",
      type: "column" as const,
      data: [35, 20, 50, 50, 58, 40, 40, 10, 50, 30, 28, 20],
    },
    {
      name: "Sales",
      type: "area" as const,
      data: [15, 20, 15, 20, 25, 40, 35, 30, 40, 32, 28, 30],
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 355,
      type: "line",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },

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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
        show: false,
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
      max: 60,
      tickAmount: 6,
      labels: {
        offsetX: -10,
        formatter: (value: number) => {
          return `${value}k FCFA`;
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