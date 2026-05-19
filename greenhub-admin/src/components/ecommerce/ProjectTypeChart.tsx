import React, { useMemo } from "react";
import Chart from "react-apexcharts";

export default function ProjectTypeChart({ data, loading }) {
  // data should be an array of objects: [{ name: "Urban Gardening", count: 45 }, ...]
  
  const chartOptions = useMemo(() => ({
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: data.map(item => item.name),
    colors: ["#465FFF", "#9CB9FF", "#31E1F7", "#11E4A5", "#FFA500"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Sales",
              formatter: () => data.reduce((a, b) => a + b.count, 0)
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val) => `${val} Purchases` }
    }
  }), [data]);

  const series = useMemo(() => data.map(item => item.count), [data]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
       <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Top 5 Project Types
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Performance overview for this month.
          </p>
        </div>
      <div className="h-[350px] flex items-center justify-center">
        {loading ? (
          <div className="text-gray-400">Loading chart...</div>
        ) : (
          <Chart options={chartOptions} series={series} type="donut" width="100%" />
        )}
      </div>
    </div>
  );
}