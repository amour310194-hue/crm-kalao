import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DealsChartProps {
  categories?: string[];
  data?: number[];
}

const DealsChart = ({ categories, data }: DealsChartProps) => {
  const cats = categories?.length ? categories : [];
  const values = data?.length ? data : [];
  const options: ApexOptions = {
    chart: { type: "bar", height: 385, toolbar: { show: false } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#E8E8E8", strokeDashArray: 4, padding: { right: -20 } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    colors: ["#0E9384"],
    noData: { text: "Pas encore de données à afficher" },
    xaxis: {
      type: "category",
      categories: cats,
      labels: { style: { fontSize: "14px", fontWeight: 600 } },
    },
    yaxis: { labels: { offsetX: -13 } },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Affaires", data: values }]}
      type="bar"
      height={385}
    />
  );
};

export default DealsChart;
