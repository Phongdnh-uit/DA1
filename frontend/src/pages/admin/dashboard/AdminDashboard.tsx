import { ChartAreaInteractive } from "@/components/ui/shadcn-io/area-chart-01";
import StatCard from "./components/StatCard";
import { ChartBarLabel } from "@/components/ui/shadcn-io/bar-chart-06";

export default function AdminDashboard() {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((idx) => (
            <StatCard key={"first-array-demo-1" + idx} />
          ))}
        </div>
        <div className="w-full h-80 rounded-3xl">
          <ChartAreaInteractive />
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-70 w-full rounded-3xl"
            >
              <ChartBarLabel />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
