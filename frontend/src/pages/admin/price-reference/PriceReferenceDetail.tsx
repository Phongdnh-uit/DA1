import { Building2, TrendingUp, DollarSign } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Route } from "@/routes/admin/price-reference/detail.$id";
import { useGetPriceReferences } from "@/services/price-reference/price-reference";
import { BackButton } from "@/components/general/BackButton";
import { formatCurrency } from "@/utils/converter";
import { useMemo } from "react";

export const PriceReferenceDetail = () => {
    const { id } = Route.useParams();
    const createdAt = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString();
    }, []);
    const priceReferenceData = useGetPriceReferences(
        {
            filter: `ward.id==${id};createdAt>${createdAt}`,
        },
        {
            query: {
                enabled: !!id,
            },
        },
    );
    let totalPrice = 0;
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;
    let totalCount = 0;

    for (const item of priceReferenceData.data?.data?.content || []) {
        totalPrice += item.averagePrice || 0;
        if (item.averagePrice && item.averagePrice < minPrice) {
            minPrice = item.averagePrice;
        }
        if (item.averagePrice && item.averagePrice > maxPrice) {
            maxPrice = item.averagePrice;
        }
        totalCount += item.count || 0;
    }
    const avgPrice =
        totalPrice / (priceReferenceData.data?.data?.content?.length || 1);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <BackButton />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {priceReferenceData.data?.data?.content?.[0]?.ward?.name}
                    </h1>
                    <p className="text-muted-foreground">Báo cáo thị trường chi tiết</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Giá Trung Bình
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(avgPrice)}</div>
                        <p className="text-xs text-muted-foreground">
                            Trung bình toàn khu vực
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tổng số bất động sản
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{totalCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Phân Khúc Cao Nhất
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(maxPrice)}</div>
                        <p className="text-xs text-muted-foreground">Đỉnh giá ghi nhận</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Phân Khúc Thấp Nhất
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(minPrice === Number.MAX_VALUE ? 0 : minPrice)}</div>
                        <p className="text-xs text-muted-foreground">Đáy giá ghi nhận</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Biểu Đồ Giá Theo Phân Khúc</CardTitle>
                        <CardDescription>
                            So sánh giá trung bình (triệu/m²) giữa các loại hình BĐS
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priceReferenceData.data?.data?.content}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="propertyType.name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) =>
                                            `${formatCurrency(value as number)}`
                                        }
                                    />
                                    <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "none",
                                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        }}
                                        labelFormatter={(label) => `Loại hình: ${label}`}
                                        separator=""
                                        formatter={(value) => [
                                            `Giá TB: ${formatCurrency(value as number)}`,
                                            "",
                                        ]}
                                    />
                                    <Bar dataKey="averagePrice" radius={[4, 4, 0, 0]}>
                                        {priceReferenceData?.data?.data?.content?.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        (entry.averagePrice as number) >= avgPrice
                                                            ? "#34D399"
                                                            : "#F87171"
                                                    }
                                                />
                                            ),
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Chi Tiết Phân Khúc</CardTitle>
                        <CardDescription>
                            Thông tin tăng trưởng từng loại hình
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {priceReferenceData.data?.data?.content?.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="ml-4 space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none">
                                            {item.propertyType?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Giá TB:{" "}
                                            <span className="font-semibold text-foreground">
                                                {formatCurrency(item.averagePrice as number)}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <span>
                                            {item.count}{" "}
                                            <span className="text-sm text-muted-foreground">bđs</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
