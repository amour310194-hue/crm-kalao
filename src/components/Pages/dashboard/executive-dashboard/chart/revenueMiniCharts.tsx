import React from "react";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
interface RevenueMiniChartProps {
  id: string;
  label: string;
  data: number[];
  color: string;
}

const RevenueMiniChart: React.FC<RevenueMiniChartProps> = ({
  id,
  label,
  data,
  color,
}) => {
  const series = [
    {
      name: label,
      data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 44,
      width: 100,
      type: "area",

      zoom: {
        enabled: false,
      },

      sparkline: {
        enabled: true,
      },
    },

    tooltip: {
      enabled: true,

      x: {
        show: false,
      },

      y: {
        title: {
          formatter: () => "",
        },
      },

      marker: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
      width: 1.5,
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
            color,
            opacity: 1,
          },
          {
            offset: 100,
            color: "#D9D9D900",
            opacity: 1,
          },
        ],
      },
    },

    title: {
      text: undefined,
    },

    grid: {
      borderColor: "transparent",
    },

    xaxis: {
      crosshairs: {
        show: false,
      },
    },

    colors: [color],
  };

  return (
    <div id={id}>
      <Chart
        options={options}
        series={series}
        type="area"
        width={100}
        height={44}
      />
    </div>
  );
};

export const SalesRevenueChart: React.FC = () => {
  return (
    <RevenueMiniChart
      id="sales-revenue"
      label="Hours"
      data={[10, 40, 25, 27, 23, 28, 25, 80, 15]}
      color="#3AB37E"
    />
  );
};

export const CustomerRevenueChart: React.FC = () => {
  return (
    <RevenueMiniChart
      id="customer-revenue"
      label="Customer"
      data={[10, 40, 25, 27, 23, 28, 25, 80, 15]}
      color="#7F24E3"
    />
  );
};

export const TargetRevenueChart: React.FC = () => {
  return (
    <RevenueMiniChart
      id="target-revenue"
      label="Target"
      data={[5, 40, 35, 30, 23, 28, 25, 80, 15]}
      color="#F07019"
    />
  );
};

export const ProfitRevenueChart: React.FC = () => {
  return (
    <RevenueMiniChart
      id="profit-revenue"
      label="Hours"
      data={[10, 30, 25, 27, 20, 28, 25, 80, 15]}
      color="#175FFF"
    />
  );
};