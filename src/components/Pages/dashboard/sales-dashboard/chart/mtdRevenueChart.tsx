import React from "react";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const MtdRevenueChart: React.FC<{ data?: number[] }> = ({ data }) => {
  const series = [
    {
      name: "Revenue",
      data: data?.length ? data : [60, 100, 20, 80, 75],
    },
  ];

  const options: ApexOptions = {
    chart: {
      width: 66,
      height: 50,
      type: "bar",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    dataLabels: {
      enabled: false,
    },

    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#D2CAF0",
            opacity: 1,
          },
          {
            offset: 100,
            color: "#E7E3F7",
            opacity: 1,
          },
        ],
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 0,
        borderRadiusWhenStacked: "all",
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },

    grid: {
      show: false,
    },

    tooltip: {
      enabled: true,
      marker: {
        show: false,
      },
    },

    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
    },
  };

  return (
    <div id="mtd-revenue">
      <Chart
        options={options}
        series={series}
        type="bar"
        width={66}
        height={50}
      />
    </div>
  );
};

export default MtdRevenueChart;