"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type Plugin,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const gaugeNeedle: Plugin<"doughnut"> = {
  id: "gaugeNeedle",
  afterDatasetDraw(chart) {
    const { ctx, chartArea } = chart;
    const meta = chart.getDatasetMeta(0);
    const arc = meta.data[0] as ArcElement | undefined;

    if (!arc) return;

    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = arc.y;
    const innerRadius = arc.innerRadius;

    ctx.save();

    // Labels
    const min = 0;
    const max = 100;
    const steps = 5;

    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= steps; i++) {
      const value = min + (i * (max - min)) / steps;
      const angle = Math.PI + (i / steps) * Math.PI;

      const x = cx + Math.cos(angle) * innerRadius;
      const y = cy + Math.sin(angle) * innerRadius;

      ctx.fillText(String(value), x, y);
    }

    // Needle
    const needleValue = 55.6;
    const needleAngle = Math.PI + (needleValue / 100) * Math.PI;

    ctx.translate(cx, cy);
    ctx.rotate(needleAngle);

    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(innerRadius - 10, 0);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fillStyle = "#3F3F46";
    ctx.fill();

    // Center cap
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#3F3F46";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  },
};

export default function StorageRequestChart() {
  const totalSegments = 25;
  const percentage = 60;

  const { data, options } = useMemo(() => {
    const filledSegments = Math.round((percentage / 100) * totalSegments);

    const chartData: ChartData<"doughnut", number[], string> = {
      labels: Array.from(
        { length: totalSegments },
        (_, index) => `Segment ${index + 1}`,
      ),
      datasets: [
        {
          data: Array(totalSegments).fill(1),
          backgroundColor: Array.from({ length: totalSegments }, (_, index) =>
            index < filledSegments ? "#E41F07" : "#F3F4F6",
          ),
          borderWidth: 0,
          borderRadius: 12,
          spacing: 6,
        },
      ],
    };

    const chartOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      rotation: -90,
      circumference: 180,
      layout: {
        padding: {
          bottom: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [percentage, totalSegments]);

  return (
    <div id="storage-request" className="relative h-[250px] w-full">
      <Doughnut data={data} options={options} plugins={[gaugeNeedle]} />
    </div>
  );
}
