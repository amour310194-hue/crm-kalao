import React from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const DealSizeChart: React.FC<{ categories?: string[]; data?: number[] }> = ({
  categories,
  data,
}) => {
  const series = [
    {
      name: "Sales",
      data: data?.length ? data : [10, 10, 20, 28, 15, 10, 20],
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
      curve: "stepline",
      width: 2,
    },

    fill: {
      type: "solid",
      opacity: 0,
    },

    colors: ["#3C2371"],

    xaxis: {
      categories: categories?.length
        ? categories
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },

    yaxis: {
      min: 5,
      max: 30,
      tickAmount: 5,

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
        left: 20,
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
    <div id="deal-size">
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

export default DealSizeChart;