
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const RegionWiseGrowthChart = ({
  labels,
  values,
}: {
  labels?: string[];
  values?: number[];
}) => {
  const series = values?.length ? values : [30, 20, 20, 15, 10];

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height: 292,
      width: '100%',
      toolbar: {
        show: false,
      },
    },

    labels: labels?.length
      ? labels
      : [
          'North America',
          'Europe',
          'Asia Pacific',
          'Latin America',
          'Middle East',
        ],

    colors: [
      '#5B6EF5',
      '#60C28E',
      '#F5A544',
      '#1FBAD6',
      '#8C7AE6',
    ],

    stroke: {
      width: 0,
    },

    plotOptions: {
      pie: {
        expandOnClick: false,
        customScale: 1,
        offsetY: 0,

        dataLabels: {
          offset: 40,
          minAngleToShowLabel: 10,
        },

        donut: {
          size: '65%',

          labels: {
            show: true,

            total: {
              show: true,
              formatter: () => '100%',
            },
          },
        },
      },
    },

    dataLabels: {
      enabled: false,

      textAnchor: 'middle',

      formatter: (val, opts) => {
        return (
          opts.w.globals.labels[opts.seriesIndex] +
          '\n' +
          Math.round(Number(val)) +
          '%'
        );
      },

      style: {
        fontSize: '13px',
        fontWeight: 600,
        colors: ['#000'],
      },

      background: {
        enabled: true,
        foreColor: '#ffffff',
        borderRadius: 6,
        padding: 6,
        opacity: 1,
        borderWidth: 0,
      },

      dropShadow: {
        enabled: false,
      },
    },

    legend: {
      show: false,
    },

    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 260,
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={292}
      width="100%"
    />
  );
};

export default RegionWiseGrowthChart;