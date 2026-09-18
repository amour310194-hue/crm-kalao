import dynamic from 'next/dynamic';
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LastChart2 = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 150,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#FC0027'],
    xaxis: {
      categories: ['Conversation', 'Follow Up', 'Inpipeline'],
    },
  };

  const chartSeries = [
    {
      data: [400, 220, 448],
    },
  ];

  return (
    <div>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={150} />
    </div>
  );
};

export default LastChart2;
