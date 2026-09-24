import React from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ContactChart: React.FC<{ data?: number[] }> = ({ data }) => {
  const series = [
    {
      name: "Contacts",
      data: data?.length ? data : [100, 80, 70, 80, 85, 80, 85],
    },
  ];

  const options: ApexOptions = {
    chart: {
      width: 73,
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

    colors: ["#FAD2CD"],

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
    <div id="contact-chart">
      <Chart
        options={options}
        series={series}
        type="bar"
        width={73}
        height={50}
      />
    </div>
  );
};

export default ContactChart;