import React from 'react';
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const RevenueBreakdownChart: React.FC<{
  data?: number[];
  categories?: string[];
}> = ({ data, categories }) => {
  const series = [
    {
      data: data?.length ? data : [2.3, 1.9, 1.4, 0.9],
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
        barHeight: '55%',
        borderRadius: 8,
        distributed: true,
      },
    },

    xaxis: {
      categories: categories?.length
        ? categories
        : [
            'Enterprise Suite',
            'Professional Plan',
            'Starter Package',
            'Add-ons & Services',
          ],
      min: 0,
      max: 2.6,
      tickAmount: 4,
      labels: {
        style: {
          fontSize: '12px',
        },
        formatter: (val: string) => {
          return `${Number(val).toFixed(1)}M FCFA`;
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },

    colors: [
      '#C594FA',
      '#ff6a6a',
      '#ffc107',
      '#5bc0ff',
    ],

    tooltip: {
      marker: {
        show: false,
      },
    },

    fill: {
      type: 'gradient',
      gradient: {
        type: 'horizontal',
        shadeIntensity: 0,
        opacityFrom: 1,
        opacityTo: 1,
        gradientToColors: [
          '#7F24E3',
          '#dc3545',
          '#ff9800',
          '#0dcaf0',
        ],
        stops: [0, 100],
      },
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      show: false,
    },

    stroke: {
      show: false,
    },

    legend: {
      show: false,
    },
  };

  return (
    <div id="revenue-breakdown-chart">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </div>
  );
};

export default RevenueBreakdownChart;