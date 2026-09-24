import React from "react";


import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SalespersonChartProps {
  /** Top clients live (valeur en M FCFA) ; absent, la maquette reste affichée. */
  points?: { x: string; y: number }[];
}

const DUMMY_POINTS = [
  { x: "Arlene", y: 0.8 },
  { x: "Robert", y: 3.2 },
  { x: "Henry", y: 2.0 },
  { x: "Fox", y: 2.8 },
  { x: "Devon", y: 4.0 },
];

const SalespersonChart: React.FC<SalespersonChartProps> = ({ points }) => {
  const livePoints = points?.length ? points : DUMMY_POINTS;
  const maxY = Math.max(1, ...livePoints.map((point) => point.y));
  const series = [
    {
      name: "Revenue",
      data: livePoints.map((point) => ({
        x: point.x,
        y: point.y,
        goals: [
          {
            value: point.y,
            name: "Sales",
            strokeHeight: 3,
            strokeColor: "#F9934D",
            strokeLineCap: "round" as const,
          },
        ],
      })),
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
      categories: livePoints.map((point) => point.x),

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
      max: Math.ceil(maxY * 1.2 * 10) / 10 || 5,

      labels: {
        offsetX: -10,

        formatter: (value: number) => {
          return `${value}M FCFA`;
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
            <strong>${value}M FCFA</strong>
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
