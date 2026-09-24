import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ChurnedChart = ({ data }: { data?: number[] }) => {
  const series = [
    {
      name: 'Churned',
      data: data?.length ? data : [30, 25, 5, 25, 20, 45],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      width: 84,
      height: 48,
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },

    colors: ['#E41F07'],

    stroke: {
      curve: 'smooth',
      width: 3,
    },

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },

    markers: {
      size: 0,
      strokeWidth: 2,
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: 5,
          fillColor: '#ffffff',
          strokeColor: '#E41F07',
          size: 4,
        },
      ],
    },

    tooltip: {
      enabled: false,
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      width={84}
      height={48}
    />
  );
};

export default ChurnedChart;