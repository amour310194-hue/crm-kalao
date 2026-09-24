
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const RetainedChart = ({ data }: { data?: number[] }) => {
  const series = [
    {
      name: 'Retained',
      data: data?.length ? data : [20, 35, 28, 45, 38, 55],
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

    colors: ['#22C55E'],

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
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: 5,
          fillColor: '#ffffff',
          strokeColor: '#22C55E',
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

export default RetainedChart;