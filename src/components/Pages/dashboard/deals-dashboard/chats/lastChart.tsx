import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LastChart = ({
  categories,
  data,
}: {
  categories?: string[];
  data?: number[];
}) => {
  const options: ApexOptions = {
    chart: { type: "bar", height: 180, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true } },
    dataLabels: { enabled: false },
    colors: ["#EF1E1E"],
    grid: { borderColor: "#E8E8E8", strokeDashArray: 4 },
    noData: { text: "Pas encore de données à afficher" },
    xaxis: { categories: categories?.length ? categories : [] },
  };

  return (
    <Chart
      options={options}
      series={[{ data: data?.length ? data : [] }]}
      type="bar"
      height={180}
    />
  );
};

export default LastChart;
