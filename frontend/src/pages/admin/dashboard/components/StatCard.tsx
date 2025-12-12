import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { clsx } from "clsx";
import TextTicker from "@/components/ui/text-ticker";

export type ChartDataPoint = {
    label: string;
    value: number;
};

interface KpiCardProps {
    title: string;
    metric: number;
    changePercentage: number;
    chartData: ChartDataPoint[];
    icon?: React.ReactNode;
}

export function KpiCard({
    title,
    metric,
    changePercentage,
    chartData,
    icon,
}: KpiCardProps) {
    const isPositive = changePercentage >= 0;
    const colorClass = isPositive ? "text-green-500" : "text-red-500";
    const chartStrokeColor = isPositive ? "#22c55e" : "#ef4444";
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {title}
                    </CardTitle>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-4xl font-bold">
                            <TextTicker value={metric} />
                        </p>
                        <div className={clsx("font-semibold", colorClass)}>
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
                                    formatter={(value: number, _, props) => [
                                        `${props.payload.label}: ${value}`,
                                        "",
                                    ]}
                                    separator=""
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
