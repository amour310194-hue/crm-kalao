
import dynamic from 'next/dynamic';
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ContactsAnalysisChart = ({
  labels,
  values,
}: {
  labels?: string[];
  values?: number[];
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut' as const,
      height: 450
    },
    colors: ['#4A00E5', '#FFA201', '#0092E4', '#E41F07'],
    labels: labels?.length ? labels : ['Campaigns', 'Google', 'Referrals', 'Paid Social'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      formatter: function (val, opts) {
        return `${val} - ${opts.w.globals.series[opts.seriesIndex]}`;
      }
    },
    responsive: [
      {
        breakpoint: 1199,
        options: {
          chart: {
            height: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 575,
        options: {
          chart: {
            height: 280
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  const series = values?.length ? values : [44, 55, 41, 17];

  return (
    <>
      <Chart options={options} series={series} type="donut" height={450} />
    </>
  );
};

export default ContactsAnalysisChart;
