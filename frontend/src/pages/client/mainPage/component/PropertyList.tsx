import PropertyCard from "./PropertyCard";
import { FilterTopBar } from "./FilterTopBar";
import { FilterSidebar } from "./FilterSidebar";
import { useState } from "react";
import { useFindAllProperty } from "@/services/property/property";
import { useFindAllWish } from "@/services/wish/wish";
import { useAuthStore } from "@/stores/useAuthStore";

export const PropertyList = () => {
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const listProperty = useFindAllProperty({
        filter: searchQuery,
    });
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const listWish = useFindAllWish(
        {
            filter:
                "type=='PROPERTY';identifier=in=(" +
                listProperty.data?.data?.content?.map((item) => item.id).join(",") +
                ")",
        },
        {
            query: {
                enabled: isAuthenticated && !!listProperty.data?.data?.content?.length,
            },
        },
    );

    const favoriteMap = listWish.data?.data?.content?.reduce(
        (acc, wish) => {
            if (!wish.identifier) return acc;
            acc[wish.identifier] = true;
            return acc;
        },
        {} as Record<string, boolean>,
    );

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Bất động sản dành cho bạn</h2>
                <div className="flex gap-x-4">
                    <p>Tin nhà đất bán mới nhất</p>
                    <p>Tin nhà đất cho thuê mới nhất</p>
                </div>
            </div>
            <FilterTopBar onFilterChange={setSearchQuery} />
            <div className="mt-4 flex gap-6">
                <FilterSidebar />
                <div className="grid grid-cols-1 w-full gap-4">
                    {/* Property items will go here */}
                    {listProperty.data?.data?.content?.map((property) => (
                        <PropertyCard
                            key={property.id}
                            data={property}
                            isFavorite={!!favoriteMap?.[property.id as number]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
