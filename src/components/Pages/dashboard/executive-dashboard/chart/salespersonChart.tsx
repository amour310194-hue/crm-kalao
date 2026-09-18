import React from "react";


import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const SalespersonChart: React.FC = () => {
  const series = [
    {
      name: "Revenue",
      data: [
        {
          x: "Arlene",
          y: 0.8,
          goals: [
            {
              value: 0.8,
              name: "Sales",
              strokeHeight: 3,
              strokeColor: "#F9934D",
              strokeLineCap: "round" as const,
            },
          ],
        },
        {
          x: "Robert",
          y: 3.2,
          goals: [
            {
              value: 3.2,
              name: "Sales",
              strokeHeight: 3,
              strokeColor: "#F9934D",
              strokeLineCap: "round" as const,
            },
          ],
        },
        {
          x: "Henry",
          y: 2.0,
          goals: [
            {
              value: 2.0,
              name: "Sales",
              strokeHeight: 3,
              strokeColor: "#F9934D",
              strokeLineCap: "round" as const,
            },
          ],
        },
        {
          x: "Fox",
          y: 2.8,
          goals: [
            {
              value: 2.8,
              name: "Sales",
              strokeHeight: 3,
              strokeColor: "#F9934D",
              strokeLineCap: "round" as const,
            },
          ],
        },
        {
          x: "Devon",
          y: 4.0,
          goals: [
            {
              value: 4.0,
              name: "Sales",
              strokeHeight: 3,
              strokeColor: "#F9934D",
              strokeLineCap: "round" as const,
            },
          ],
        },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 300,
      type: "bar",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",

        colors: {
          backgroundBarColors: ["var(--light)"],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 5,
        },
      },
    },

    grid: {
      padding: {
        right: -10,
        left: -15,
        top: -15,
      },

      borderColor: "var(--border-color)",

      strokeDashArray: 5,

      xaxis: {
        lines: {
          show: false,
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

    legend: {
      show: false,
      position: "bottom",

      onItemClick: {
        toggleDataSeries: false,
      },
    },

    xaxis: {
      categories: [
        "Arlene",
        "Robert",
        "Henry",
        "Fox",
        "Devon",
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
    },

    fill: {
      type: "gradient",

      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,

        colorStops: [
          {
            offset: 0,
            color: "#F07019",
            opacity: 1,
          },
          {
            offset: 100,
            color: "#F9934D",
            opacity: 1,
          },
        ],
      },

      colors: ["#E41F07"],
    },

    yaxis: {
      min: 0,
      max: 5,

      labels: {
        offsetX: -10,

        formatter: (value: number) => {
          return `$${value}M`;
        },
      },
    },

    tooltip: {
      marker: {
        show: false,
      },

      custom: ({
        series,
        seriesIndex,
        dataPointIndex,
        w,
      }) => {
        const value = series[seriesIndex][dataPointIndex];
        const name = w.globals.labels[dataPointIndex];

        return `
          <div class="apex-tooltip p-2">
            <span>${name}</span>
            <br />
            <strong>$${value}M</strong>
          </div>
        `;
      },
    },
  };

  return (
    <div id="salesperson-chart">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
        width="100%"
      />
    </div>
  );
};

export default SalespersonChart;