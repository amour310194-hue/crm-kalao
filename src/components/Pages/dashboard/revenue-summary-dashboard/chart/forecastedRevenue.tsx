import React from 'react';

import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ForecastedRevenue: React.FC = () => {
  const series = [
    {
      name: 'Revenue',
      data: [25, 35, 45, 30, 22, 40, 38, 28, 48, 26, 33],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 70,
      width: '100%',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
        distributed: false,
      },
    },

    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0,
        gradientToColors: ['#27AE60'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    colors: ['#0E9384'],

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: false,
    },

    tooltip: {
      enabled: true,
      marker: {
        show: false,
      },
    },

    xaxis: {
      crosshairs: {
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
    <div id="forecasted-revenue">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={70}
        width="100%"
      />
    </div>
  );
};

export default ForecastedRevenue;