import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { clsx } from "clsx";
import TextTicker from "@/components/ui/text-ticker";

type ChartDataPoint = {
    value: number;
};

interface KpiCardProps {
    title: string;
    metric: number;
    change: number;
    chartData: ChartDataPoint[];
    category?: string;
}

export function KpiCard({
    title,
    metric,
    change,
    chartData,
    category,
}: KpiCardProps) {
    const isPositive = change >= 0;

    const colorClass = isPositive ? "text-green-500" : "text-red-500";
    const chartStrokeColor = isPositive ? "#22c55e" : "#ef4444";

    const changePercentage =
        metric !== 0 ? (change / (metric - change)) * 100 : 0;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {title}
                    </CardTitle>
                    {category && (
                        <span className="text-sm text-gray-500">{category}</span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-4xl font-bold">
                            <TextTicker value={metric} />
                        </p>
                        <div className={clsx("font-semibold", colorClass)}>
                            <span>{isPositive ? "+" : "-"}</span>
                            <span>{Math.abs(change)}</span>
                            {!isNaN(changePercentage) && (
                                <span className="ml-2">
                                    ({isPositive ? "+" : ""}
                                    {changePercentage.toFixed(1)}%)
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-14 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1f2937",
                                        border: "none",
                                        borderRadius: "0.5rem",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                    formatter={(value: number) => [value, "Value"]}
                                    labelFormatter={() => ""}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartStrokeColor}
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
