import React from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const PipelineChart: React.FC = () => {
  const series = [
    {
      name: "Deals",
      data: [100, 80, 70, 60],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 62,
      width: "100%",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      parentHeightOffset: 0,
    },

    plotOptions: {
      bar: {
        distributed: true,
        horizontal: false,
        columnWidth: "90%",
        borderRadius: 0,
      },
    },

    colors: ["#E41F07", "#FFA201", "#800080", "#27AE60"],

    xaxis: {
      categories: ["Leads", "Proposal", "Sales", "Won"],
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
    <div id="pipelineChart">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={62}
        width="100%"
      />
    </div>
  );
};

export default PipelineChart;