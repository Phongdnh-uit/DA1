import StatCard from "./components/StatCard";

export default function AdminDashboard() {
    return (
        <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex gap-2">
                    {[...new Array(4)].map((idx) => (
                        <StatCard key={"first-array-demo-1" + idx} />
                    ))}
                </div>
                <div className="w-full h-80 animate-pulse rounded-3xl bg-zinc-200 dark:bg-neutral-800"></div>
                <div className="flex flex-1 gap-2">
                    {[...new Array(2)].map((idx) => (
                        <div
                            key={"second-array-demo-1" + idx}
                            className="h-70 w-full animate-pulse rounded-3xl bg-zinc-200 dark:bg-neutral-800"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
