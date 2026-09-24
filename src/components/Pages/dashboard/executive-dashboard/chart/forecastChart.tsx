import React from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ForecastChart: React.FC<{
  categories?: string[];
  collected?: number[];
  invoiced?: number[];
}> = ({ categories, collected, invoiced }) => {
  const live = Boolean(collected?.length && invoiced?.length);
  const series = live
    ? [
        { name: "Encaissé", data: collected as number[] },
        { name: "Facturé", data: invoiced as number[] },
      ]
    : [
        {
          name: "Forecast",
          data: [170, 40, 80, 50, 90, 60, 80, 70, 120, 110, 200, 90],
        },
        {
          name: "Target",
          data: [260, 170, 170, 250, 150, 120, 100, 100, 320, 330, 340, 120],
        },
      ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 244,

      sparkline: {
        enabled: false,
      },

      toolbar: {
        show: false,
      },
    },

    legend: {
      show: false,
    },

    stroke: {
      curve: "straight",
      width: 2,
    },

    colors: ["#7F24E3", "#27AE60"],

    markers: {
      size: 5,
      colors: ["#7F24E3", "#6FD195"],
      strokeColors: "#fff",
      strokeWidth: 2,

      hover: {
        size: 7,
      },
    },

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
      min: 0,
      max: 450,
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

    fill: {
      type: "gradient",

      gradient: {
        shadeIntensity: 0,
        type: "vertical",
        inverseColors: false,

        opacityFrom: 1,
        opacityTo: 0.05,

        stops: [0, 100],

        colorStops: [
          [
            {
              offset: 0,
              color: "#7F24E3",
              opacity: 1,
            },
            {
              offset: 100,
              color: "#E8E8E8",
              opacity: 0.05,
            },
          ],
          [
            {
              offset: 0,
              color: "#6FD195",
              opacity: 0.3,
            },
            {
              offset: 100,
              color: "#6FD195",
              opacity: 0.05,
            },
          ],
        ],
      },
    },

    grid: {
      padding: {
        left: 0,
        right: 0,
        top: -25,
      },

      borderColor: "#e0e0e0",
      strokeDashArray: 5,
      position: "back",

      xaxis: {
        lines: {
          show: true,
        },
      },

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
    <div id="forecast-chart">
      <Chart
        options={options}
        series={series}
        type="area"
        height={244}
        width="100%"
      />
    </div>
  );
};

export default ForecastChart;