import React from 'react';
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const RevenueExpenseChart: React.FC = () => {
  const series = [
    {
      name: 'Amount',
      data: [80, 45], // Revenue, Expense
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 250,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        barHeight: '55%',
        distributed: true,
      },
    },

    colors: ['#6D5EF3', '#FF5B5B'],

    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#8B7CF6', '#FF7B7B'],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ['Revenue', 'Expense'],
      min: 0,
      max: 3,
      tickAmount: 6,
      labels: {
        show: true,
        formatter: (val: string) => {
          return `${Number(val).toFixed(1)}M`;
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
        },
      },
    },

    grid: {
      show: false,
    },

    legend: {
      show: false,
    },

    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${val}%`;
        },
      },
    },
  };

  return (
    <div id="revenue_expense">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={250}
        width="100%"
      />
    </div>
  );
};

export default RevenueExpenseChart;