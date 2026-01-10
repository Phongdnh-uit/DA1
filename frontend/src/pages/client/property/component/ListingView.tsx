import { useState } from "react";
import { PaginationWithLabel } from "@/components/general/Pagination";
import { useFindAllProperty } from "@/services/property/property";
import { useFindAllWish } from "@/services/wish/wish";
import { FilterTopBar } from "./FilterTopBar";
import { FilterSidebar } from "./FilterSidebar";
import PropertyCard from "../../mainPage/component/PropertyCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFilterStore } from "@/stores/filterStore";

export const ListingView = () => {
    const buildQuery = useFilterStore((s) => s.buildQuery);
    const initialQuery = buildQuery();
    const [query, setQuery] = useState<string | undefined>(
        initialQuery != "" ? initialQuery : undefined,
    );
    const [pagination, setPagination] = useState<{ page: number; size: number }>({
        page: 0,
        size: 5,
    });
    const listProperty = useFindAllProperty({
        filter: query,
        page: pagination.page,
        size: pagination.size,
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

    const onSubmit = () => {
        setQuery(buildQuery());
    };

    return (
        <>
            <FilterTopBar onSubmit={onSubmit} />
            <div className="mb-8 flex gap-8">
                <FilterSidebar className="w-sm" />
                <div className="grid grid-cols-1 h-full gap-6 flex-1">
                    {listProperty.data?.data?.content?.map((property) => (
                        <PropertyCard
                            key={property.id}
                            data={property}
                            isFavorite={!!favoriteMap?.[property.id as number]}
                        />
                    ))}
                </div>
            </div>
            <PaginationWithLabel
                currentPage={pagination.page}
                totalPages={listProperty.data?.data?.totalPages ?? 0}
                onPageChange={(page) => setPagination({ ...pagination, page })}
            />
        </>
    );
};
