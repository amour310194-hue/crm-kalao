import React from 'react';
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const DealValueChart: React.FC = () => {
  const series = [
    {
      data: [90, 55],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 97,
      width: 75,
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 4,
        distributed: true,
      },
    },

    colors: ['#8446FF', '#F6495C'],

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: false,
    },

    tooltip: {
      enabled: false,
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },

    grid: {
      show: false,
    },
  };

  return (
    <div id="deal-value-chart">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={97}
        width={75}
      />
    </div>
  );
};

export default DealValueChart;