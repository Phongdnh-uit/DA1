import { useGetStatistics } from "@/services/statistic/statistic";
import { KpiCard, type ChartDataPoint } from "./components/StatCard";
import { Card } from "@/components/ui/card";
import { HomeIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import { DateRangeFilter } from "./components/DateRange";

export default function AdminDashboard() {
    const statistic = useGetStatistics();
    if (statistic.isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8">
                <header>
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">
                                Dashboard
                            </h2>
                            <p className="text-muted-foreground">
                                Chào mừng quay lại, hãy xem tổng quan hôm nay
                            </p>
                        </div>
                    </div>
                </header>
                <main className="mt-8">
                    <DateRangeFilter />
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <KpiCard
                            title={"Tổng số người dùng"}
                            metric={statistic.data?.data?.totalUsers?.currentCount as number}
                            changePercentage={
                                statistic.data?.data?.totalUsers?.percentageChange as number
                            }
                            chartData={
                                statistic.data?.data?.totalUsers?.dataPoints as ChartDataPoint[]
                            }
                            icon={
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                                    <UsersIcon className="h-6 w-6 text-green-500" />
                                </div>
                            }
                        />
                        <KpiCard
                            title={"Tổng số bất động sản"}
                            metric={
                                statistic.data?.data?.totalProperties?.currentCount as number
                            }
                            changePercentage={
                                statistic.data?.data?.totalProperties
                                    ?.percentageChange as number
                            }
                            chartData={
                                statistic.data?.data?.totalProperties
                                    ?.dataPoints as ChartDataPoint[]
                            }
                            icon={
                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                                    <HomeIcon className="h-6 w-6 text-blue-500" />
                                </div>
                            }
                        />

                        <KpiCard
                            title={"Cần tư vấn"}
                            metric={
                                statistic.data?.data?.pendingConversations
                                    ?.currentCount as number
                            }
                            changePercentage={
                                statistic.data?.data?.pendingConversations
                                    ?.percentageChange as number
                            }
                            chartData={
                                statistic.data?.data?.pendingConversations
                                    ?.dataPoints as ChartDataPoint[]
                            }
                            icon={
                                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                                    <MessageSquareIcon className="h-6 w-6 text-purple-500" />
                                </div>
                            }
                        />
                    </div>
                    <Card className="mt-4 h-96 rounded-tremor-small p-2">test</Card>
                </main>
            </div>
        </>
    );
}
