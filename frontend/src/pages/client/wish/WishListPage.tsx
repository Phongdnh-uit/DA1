import { useFindAllProperty } from "@/services/property/property";
import { useDeleteBulkWish, useFindAllWish } from "@/services/wish/wish";
import { Heart } from "lucide-react";
import PropertyCard from "../mainPage/component/PropertyCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function WishListPage() {
    const wishList = useFindAllWish();
    const properties = useFindAllProperty(
        {
            filter:
                "id=in=(" +
                wishList.data?.data?.content?.map((wish) => wish.identifier).join(",") +
                ")",
        },
        {
            query: {
                enabled: !!wishList.data?.data?.content?.length,
            },
        },
    );
    const bulkDeleteWish = useDeleteBulkWish({
        mutation: {
            onSuccess: () => {
                toast.success("Xóa bất động sản yêu thích thành công");
                wishList.refetch();
            },
            onError: () => {
                toast.error("Xóa bất động sản yêu thích thất bại");
            },
        },
    });
    const [deleteIds, setDeleteIds] = useState<number[]>([]);
    const handleDeleteSelected = () => {
        const wishIds = (wishList.data?.data?.content || [])
            .filter((wish) => deleteIds.includes(wish.identifier as number))
            .map((wish) => wish.id);
        if (!wishIds || wishIds.length === 0) {
            toast.error("Không có bất động sản nào được chọn để xóa");
            return;
        }
        bulkDeleteWish.mutate({
            params: {
                ids: wishIds as number[],
            },
        });
    };
    return (
        <div>
            {/* Header */}
            <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                                <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                                Bất động sản yêu thích
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {wishList.data?.data?.content?.length ?? 0} bất động sản được
                                lưu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleteIds.length === 0}
                    >
                        Xóa đã chọn ({deleteIds.length})
                    </Button>
                </div>
                {/* Properties Grid */}
                {(properties.data?.data?.content?.length ?? 0) > 0 ? (
                    <div className="grid grid-cols-1 gap-6 mt-8">
                        {properties.data?.data?.content?.map((property) => (
                            <div className="grid grid-cols-[50px_1fr] gap-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={deleteIds.includes(property.id as number)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setDeleteIds((prev) => [
                                                    ...prev,
                                                    property.id as number,
                                                ]);
                                            } else {
                                                setDeleteIds((prev) =>
                                                    prev.filter((id) => id !== property.id),
                                                );
                                            }
                                        }}
                                        className="size-7"
                                    />
                                </div>
                                <PropertyCard
                                    key={property.id}
                                    data={property}
                                    isFavorite={true}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground text-lg">
                            Không có bất động sản yêu thích
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
