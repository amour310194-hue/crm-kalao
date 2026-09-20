
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const RevenueChart = () => {
  // Actual revenue values (0–100 scale)
  const revenueData = [50, 30, 75, 60, 40, 55, 42];

  // Auto-calculate remaining values
  const remainingData = revenueData.map((value) => 100 - value);

  const series = [
    {
      name: 'Revenue',
      data: revenueData,
    },
    {
      name: 'Remaining',
      data: remainingData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 292,
      width: '100%',
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: '70%',
        borderRadius: 5,
        borderRadiusWhenStacked: 'all',
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: false,
    },

    colors: ['#E11D48', '#E5E7EB'],

    fill: {
      type: ['gradient', 'solid'],
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        gradientToColors: ['#FB7185'],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July'],

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          fontSize: '14px',
          colors: '#6B7280',
        },
      },
    },

    yaxis: {
      show: false,
      max: 100,
    },

    grid: {
      show: false,
    },

    legend: {
      show: false,
    },

    tooltip: {
      custom: ({
        series,
        seriesIndex,
        dataPointIndex,
        w,
      }) => {
        const month = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];

        return `
          <div style="
            background:#ffffff;
            padding:20px 24px;
            border-radius:20px;
            box-shadow:0 25px 50px rgba(0,0,0,0.08);
            min-width:160px;
          ">
            <div style="
              font-size:18px;
              font-weight:600;
              color:#111827;
              margin-bottom:12px;
            ">
              ${month}
            </div>

            <div style="
              display:flex;
              align-items:center;
              font-size:15px;
              color:#6B7280;
              margin-bottom:6px;
            ">
              <span style="
                width:8px;
                height:8px;
                background:#EF4444;
                border-radius:50%;
                display:inline-block;
                margin-right:8px;
              "></span>
              Revenue
            </div>

            <div style="
              font-size:22px;
              font-weight:700;
              color:#111827;
            ">
              ${value}k FCFA
            </div>
          </div>
        `;
      },
    },

    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%',
            },
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={292}
      width="100%"
    />
  );
};

export default RevenueChart;