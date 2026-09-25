import dynamic from 'next/dynamic';
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LeadPieChartProps {
  /** Répartition live des leads ; absente, la maquette reste affichée. */
  labels?: string[];
  values?: number[];
}

const LeadPieChart = ({ labels, values }: LeadPieChartProps) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie' as const,
      height: 440
    },
    colors: ['#2F80ED', '#27AE60', '#FFA201', '#E41F07'],
    noData: { text: "Pas encore de données à afficher" },
    labels: labels?.length ? labels : [],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 1199,
        options: {
          chart: {
            height: 350
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

  const series = values?.length ? values : [];

  return (
    
      <Chart options={options} series={series} type="pie" height={440} />

  );
};

export default LeadPieChart;
