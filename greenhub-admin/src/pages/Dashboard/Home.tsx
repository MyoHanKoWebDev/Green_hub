import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import axios from "../../../api/axios.js";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Alert from "../../components/ui/alert/Alert.js";
import ProjectTypeChart from "../../components/ecommerce/ProjectTypeChart.js";

export default function Home() {
  const [reportData, setReportData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const res = await axios.get("/admin/reports/top-project-types");
        if (res.data.status) {
          setPieData(res.data.data);
        }
      } catch (err) {
        console.error("Pie chart fetch error:", err);
      }
    };
    fetchPieData();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("/admin/reports");
        if (res.data.status) {
          setReportData(res.data.data);
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setAlertConfig({
          variant: "error",
          title: "Fetch Error",
          message: axiosError.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/admin/reports/sales?year=${year}`);
        if (res.data.status && isMounted) {
          setSalesData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchChartData();
    return () => {
      isMounted = false;
    };
  }, [year]);

  useEffect(() => {
    if (alertConfig) {
      const timer = setTimeout(() => {
        setAlertConfig(null);
      }, 4000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alertConfig]);

  return (
    <>
      <PageMeta
        title="Ecommerce Dashboard | GreenHub Admin"
        description="View secure reports for GreenHub"
      />
      {alertConfig && <Alert {...alertConfig} />}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics data={reportData} loading={loading} />

          {/* <MonthlySalesChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        <div className="col-span-12 xl:col-span-8">
          <StatisticsChart
            data={salesData}
            setYear={setYear}
            year={year}
            loading={loading}
          />
        </div>

        {/* Top 5 Project Types Pie Chart */}
        <div className="col-span-12 xl:col-span-4">
          <ProjectTypeChart data={pieData} loading={loading} />
        </div>
      </div>
    </>
  );
}
