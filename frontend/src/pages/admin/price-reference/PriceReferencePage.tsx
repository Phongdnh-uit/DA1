import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGetPriceReferences } from "@/services/price-reference/price-reference";
import { useFindAllProvince } from "@/services/province/province";
import { useState } from "react";
import { formatCurrency } from "@/utils/converter";
import { useNavigate } from "@tanstack/react-router";
import { Combobox } from "@/components/customs/Combobox";

export const PriceReferencePage = () => {
    const [selectedProvinceId, setSelectedProvinceId] = useState<
        number | undefined
    >(undefined);

    const navigate = useNavigate();

    const provinces = useFindAllProvince({
        all: true,
    });

    const priceReferences = useGetPriceReferences(
        {
            filter: `ward.province.id==${selectedProvinceId}`,
        },
        {
            query: {
                enabled: !!selectedProvinceId,
            },
        },
    );

    const wardId = priceReferences.data?.data?.content?.map(
        (item) => item?.ward?.id,
    );

    const groupedByWard = wardId?.map((id) => {
        const items = priceReferences.data?.data?.content?.filter(
            (item) => item?.ward?.id === id,
        );
        let totalPrice = 0;
        let maxPrice = 0;
        let minPrice = Number.MAX_SAFE_INTEGER;
        for (const item of items || []) {
            totalPrice += item.averagePrice || 0;
            if (item.averagePrice && item.averagePrice > maxPrice) {
                maxPrice = item.averagePrice;
            }
            if (item.averagePrice && item.averagePrice < minPrice) {
                minPrice = item.averagePrice;
            }
        }
        const averagePrice = totalPrice / (items?.length || 1);
        return {
            wardId: id,
            wardName: items?.[0]?.ward?.name,
            maxPrice,
            minPrice,
            averagePrice,
        };
    });

    return (
        <div className="space-y-6">
            {/* City Selector */}
            <Card className="w-full">
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <Combobox
                            options={
                                provinces.data?.data?.content?.map((option) => ({
                                    key: option.id?.toString() as string,
                                    render: `${option.type} ${option.name}`,
                                    searchKey: `${option.type} ${option.name}`,
                                })) || []
                            }
                            value={selectedProvinceId ? selectedProvinceId.toString() : null}
                            onChange={(value) => {
                                setSelectedProvinceId(value ? +value : undefined);
                            }}
                            searchable
                            className="w-sm"
                        />
                        <a className="pb-2 text-sm text-muted-foreground">
                            {selectedProvinceId
                                ? `Hiển thị ${groupedByWard ? Object.keys(groupedByWard).length : 0} khu vực tại ${provinces.data?.data?.content?.find(
                                    (p) => p.id === selectedProvinceId,
                                )?.name || "chưa chọn"
                                }`
                                : "Vui lòng chọn tỉnh/thành phố để xem dữ liệu giá bất động sản tham khảo."}
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Bảng Giá Bất Động Sản</CardTitle>
                    <CardDescription>Giá trung bình (triệu VNĐ/m²)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Khu vực
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Giá TB
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-blue-600">
                                        Cao nhất
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-green-600">
                                        Thấp nhất
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {groupedByWard && Object.keys(groupedByWard).length > 0 ? (
                                    Object.entries(groupedByWard).map(([wardId, wardData]) => (
                                        <tr
                                            key={wardId}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                {wardData.wardName}
                                            </td>
                                            <td className="p-4 align-middle text-right font-bold">
                                                {formatCurrency(wardData?.averagePrice as number)}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                {formatCurrency(wardData?.maxPrice as number)}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                {formatCurrency(wardData?.minPrice as number)}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate({
                                                            to: `/admin/price-reference/detail/${wardData.wardId}`,
                                                        })
                                                    }
                                                    className="gap-2"
                                                >
                                                    Chi tiết <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center">
                                            Không có dữ liệu cho thành phố này.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
