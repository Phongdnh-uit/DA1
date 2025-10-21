import PropertyCard from "./PropertyCard";
import useGetPropertyList from "./PropertyList.vm";

export const PropertyList = () => {
    const { listProperty } = useGetPropertyList();
    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Bất động sản dành cho bạn</h2>
                <div className="flex gap-x-4">
                    <p>Tin nhà đất bán mới nhất</p>
                    <p>Tin nhà đất cho thuê mới nhất</p>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Property items will go here */}
                {listProperty.data?.data?.content?.map((property) => (
                    <PropertyCard key={property.id} data={property} />
                ))}
            </div>
        </div>
    );
};
