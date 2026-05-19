import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function StatisticsChart({data , setYear, year, loading}) {
  // Generate an array for the last 5 years
  const lastFiveYears = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i), 
  []);
  const options: ApexOptions = useMemo(() => ({
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 310,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    stroke: { curve: "smooth", width: 3 },
    // Keep tooltip shared to prevent flickering on multi-series
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val) => `${val.toLocaleString()} Ks` }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val.toLocaleString()} Ks`,
        style: { colors: ["#6B7280"] },
      },
    },
    dataLabels: { enabled: false },
  }), []);

  // Wrap series in useMemo to prevent unnecessary re-renders
  const series = useMemo(() => [
    { name: "Revenue", data: data }
  ], [data]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Sales Revenue
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Performance overview for {year}
          </p>
        </div>

        {/* Year Filter Dropdown */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-transparent dark:border-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
        >
          {lastFiveYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <div className="h-[310px] flex items-center justify-center text-gray-400">Loading...</div>
          ) : (
            <Chart options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
}