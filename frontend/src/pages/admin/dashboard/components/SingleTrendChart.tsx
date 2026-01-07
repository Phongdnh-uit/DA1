import { Card } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
    date: string;
    count: number;
}

interface SingleTrendChartProps {
    title: string;
    description: string;
    data: ChartDataPoint[];
    color: string;
    icon?: React.ReactNode;
}

export function SingleTrendChart({
    title,
    description,
    data,
    color,
    icon,
}: SingleTrendChartProps) {
    const chartData = data.map((item) => ({
        date: item.date,
        value: item.count,
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">
                        {label}
                    </p>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {payload[0].value.toLocaleString()}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
                {icon}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                        dataKey="date"
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        dot={{ fill: color, r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
