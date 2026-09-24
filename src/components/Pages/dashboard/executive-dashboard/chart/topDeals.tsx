import React from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const TopDealsChart: React.FC<{ categories?: string[]; data?: number[] }> = ({
  categories,
  data,
}) => {
  const series = [
    {
      name: "Deals",
      data: data?.length ? data : [70, 60, 40, 50, 35, 15],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,

      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: true,
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
            color: "#175FFF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "#A8C4FF",
            opacity: 1,
          },
        ],
      },
    },

    grid: {
      borderColor: "#E8E8E8",
      strokeDashArray: 4,
    },

    tooltip: {
      marker: {
        show: false,
      },
    },

    xaxis: {
      categories: categories?.length
        ? categories
        : ["Brooklyn", "Kathryn", "Richards", "Robert", "Bessie", "Floyd"],
    },
  };

  return (
    <div id="top-deals">
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

export default TopDealsChart;