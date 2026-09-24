import React from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const DealChart: React.FC<{ categories?: string[]; data?: number[] }> = ({
  categories,
  data,
}) => {
  const series = [
    {
      name: "Sales",
      data: data?.length ? data : [2, 4, 1.5, 3.8, 5, 3, 4, 2, 6, 5, 4, 3],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 330,

      sparkline: {
        enabled: false,
      },

      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 2,
    },

    colors: ["#E41F07"],

    xaxis: {
      categories: categories?.length
        ? categories
        : [
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
    },

    yaxis: {
      labels: {
        offsetX: -10,

        formatter: (value: number) => {
          return `${value}k`;
        },
      },
    },

    tooltip: {
      marker: {
        show: false,
      },

      x: {
        show: true,
      },

      y: {
        formatter: (value: number) => {
          return `${value}k`;
        },

        title: {
          formatter: () => {
            return "";
          },
        },
      },
    },

    grid: {
      padding: {
        left: 0,
        right: 0,
      },

      borderColor: "#e0e0e0",

      strokeDashArray: 5,

      position: "back",

      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div id="deal-chart">
      <Chart
        options={options}
        series={series}
        type="area"
        height={330}
        width="100%"
      />
    </div>
  );
};

export default DealChart;