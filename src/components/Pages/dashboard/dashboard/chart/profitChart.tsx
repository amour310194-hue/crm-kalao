import React from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ProfitChart: React.FC = () => {
  const series = [
    {
      name: "Profit",
      data: [30, 35, 38, 90, 40, 38, 30, 20, 30, 80, 85, 85],
    },
  ];

  const options: ApexOptions = {
    chart: {
      width: "100%",
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

    colors: ["#E41F07"],

    plotOptions: {
      bar: {
        columnWidth: "30%",
        borderRadius: 4,
        borderRadiusWhenStacked: "all",
        borderRadiusApplication: "around",
        colors: {
          backgroundBarColors: ["#E8E8E8"],
          backgroundBarOpacity: 0.5,
          backgroundBarRadius: 4,
        },
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
  };

  return (
    <div id="profit-chart">
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height={50}
      />
    </div>
  );
};

export default ProfitChart;