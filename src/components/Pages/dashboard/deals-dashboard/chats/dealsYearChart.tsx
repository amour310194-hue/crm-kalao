import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DealsYearChart = ({
  categories,
  data,
}: {
  categories?: string[];
  data?: number[];
}) => {
  const values = data?.length ? data : [];
  const max = Math.max(1, ...values);
  const options: ApexOptions = {
    chart: { type: "area", height: 273, zoom: { enabled: false }, toolbar: { show: false } },
    colors: ["#FFA201"],
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    fill: { type: "solid", opacity: 0 },
    markers: { size: 5, shape: "circle", strokeWidth: 2, strokeColors: "#FFA201", hover: { size: 7 } },
    grid: { borderColor: "#E8E8E8", strokeDashArray: 4 },
    noData: { text: "Pas encore de données à afficher" },
    xaxis: { categories: categories?.length ? categories : [] },
    yaxis: {
      min: 0,
      max: max,
      tickAmount: 5,
      labels: { offsetX: -15, formatter: (val: number) => `${val} k` },
    },
    legend: { position: "top", horizontalAlign: "left" },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Encaissé", data: values }]}
      type="area"
      height={273}
    />
  );
};

export default DealsYearChart;
