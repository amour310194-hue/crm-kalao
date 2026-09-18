import React from 'react';
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const RevenuePerformanceChart: React.FC = () => {
  const series = [
    {
      name: 'Actual Revenue',
      data: [120, 210, 290, 260, 240, 420, 460, 380, 300, 320, 480, 600],
    },
    {
      name: 'Forecasted',
      data: [110, 200, 270, 230, 220, 300, 270, 220, 180, 210, 420, 520],
    },
    {
      name: 'Prior Year',
      data: [60, 120, 160, 140, 130, 220, 260, 210, 170, 160, 330, 510],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: 'smooth',
      width: 2,
    },

    colors: ['#3B44F6', '#22C55E', '#FF3B30'],

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },

    yaxis: {
      labels: {
        formatter: (val: number) => {
          return `$${val}K`;
        },
        style: {
          fontSize: '12px',
        },
      },
    },

    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
    },

    tooltip: {
      marker: {
        show: false,
      },
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => {
          return `$${val}K`;
        },
      },
    },

    legend: {
      show: false,
    },
  };

  return (
    <div id="revenue-performance-chart">
      <Chart
        options={options}
        series={series}
        type="area"
        height={350}
        width="100%"
      />
    </div>
  );
};

export default RevenuePerformanceChart;