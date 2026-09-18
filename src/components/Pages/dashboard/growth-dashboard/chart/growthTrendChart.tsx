
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const GrowthTrendChart = () => {
  const revenueData = [
    700,
    180,
    320,
    210,
    410,
    120,
    580,
    160,
    590,
    540,
    920,
    430,
  ];

  const series = [
    {
      name: 'Revenue',
      data: revenueData,
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
      colors: ['#EF4444'],
    },

    markers: {
      size: 4,
      colors: ['#fff'],
      strokeColors: '#EF4444',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],

        colorStops: [
          {
            offset: 0,
            color: '#EF4444',
            opacity: 0.4,
          },
          {
            offset: 100,
            color: '#EF4444',
            opacity: 0.05,
          },
        ],
      },
    },

    colors: ['#EF4444'],

    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          colors: '#707070',
          fontSize: '12px',
        },
      },
    },

    yaxis: {
      min: 0,
      max: 1000,
      tickAmount: 5,

      labels: {
        formatter: (value) => `${value}k`,

        style: {
          colors: '#707070',
          fontSize: '12px',
        },
      },
    },

    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,

      xaxis: {
        lines: {
          show: true,
        },
      },

      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      marker: {
        show: false,
      },

      x: {
        show: true,
      },

      y: {
        formatter: (value) => `${value}k`,

        title: {
          formatter: () => '',
        },
      },
    },

    legend: {
      show: false,
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={350}
      width="100%"
    />
  );
};

export default GrowthTrendChart;