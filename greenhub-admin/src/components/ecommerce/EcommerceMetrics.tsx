import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "../../icons";
import { RectangleGroupIcon } from "@heroicons/react/24/outline";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics({ data }) {
  const metrics = [
    {
      title: "Monthly Members",
      value: data?.members?.total || 0,
      change: data?.members?.change || 0,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      title: "Monthly Orders",
      value: data?.orders?.total || 0,
      change: data?.orders?.change || 0,
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      title: "Monthly Shared Projects",
      value: data?.projects?.total || 0,
      change: data?.projects?.change || 0,
      icon: <RectangleGroupIcon className="w-7 h-7 text-gray-800 dark:text-white/90" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
      {metrics.map((item, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {item.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.title}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {item.value.toLocaleString()}
              </h4>
            </div>
            <Badge color={item.change >= 0 ? "success" : "error"}>
              {item.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(item.change)}%
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}