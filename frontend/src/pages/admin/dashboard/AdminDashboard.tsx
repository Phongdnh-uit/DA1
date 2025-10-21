import { KpiCard } from "./components/StatCard";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
    return (
        // <div className="flex flex-1">
        //   <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        //     <div className="flex gap-2">
        //       {[...new Array(4)].map((idx) => (
        //         <StatCard key={"first-array-demo-1" + idx} />
        //       ))}
        //     </div>
        //     <div className="w-full h-80 rounded-3xl">
        //       <ChartAreaInteractive />
        //     </div>
        //     <div className="flex flex-1 gap-2">
        //       {[...new Array(2)].map((idx) => (
        //         <div
        //           key={"second-array-demo-1" + idx}
        //           className="h-70 w-full rounded-3xl"
        //         >
        //           <ChartBarLabel />
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        // </div>
        <>
            <div className="p-4 sm:p-6 lg:p-8">
                <header>
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Overview
                        </h3>
                    </div>
                </header>
                <main>
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <KpiCard
                            title={"Số lượng người dùng mới"}
                            metric={250}
                            change={0}
                            chartData={[{ value: 10 }, { value: 20 }, { value: 15 }]}
                        />
                        <KpiCard
                            title={"Số lượng bất động sản"}
                            metric={670}
                            change={-20}
                            chartData={[{ value: 50 }, { value: 20 }, { value: 10 }]}
                        />
                        <KpiCard
                            title={"Số lượng truy cập"}
                            metric={320}
                            change={0}
                            chartData={[{ value: 10 }, { value: 20 }, { value: 40 }]}
                        />
                    </div>
                    <Card className="mt-4 h-96 rounded-tremor-small p-2">test</Card>
                </main>
            </div>
        </>
    );
}
