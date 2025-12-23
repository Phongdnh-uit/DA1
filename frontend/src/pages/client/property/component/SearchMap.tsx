import LocationView, {
    type LocationItem,
} from "@/components/general/LocationView";
import { useFindPropertiesWithinRadius } from "@/services/property/property";
import { useState } from "react";

export default function SearchMap() {
    const [params, setParams] = useState<{
        latitude: number;
        longitude: number;
        radiusInMeters: number;
    }>();
    const propertiesWithinRadius = useFindPropertiesWithinRadius(
        {
            latitude: params?.latitude as number,
            longitude: params?.longitude as number,
            radiusInMeters: params?.radiusInMeters as number,
        },
        {
            query: {
                enabled:
                    params?.latitude !== undefined &&
                    params?.longitude !== undefined &&
                    params?.radiusInMeters !== undefined,
            },
        },
    );
    

    const onRegionChange = (params: {
        latitude: number;
        longitude: number;
        radiusInMeters: number;
    }) => {
        setParams(params);
    };
    return (
        <LocationView
            locations={
                propertiesWithinRadius.data?.data
                    ?.filter(
                        (property) =>
                            property &&
                            property.location?.latitude &&
                            property.location?.longitude,
                    )
                    .map(
                        (property) =>
                            ({
                                data: property,
                                latitude: property?.location?.latitude as number,
                                longitude: property?.location?.longitude as number,
                            }) as LocationItem,
                    ) || []
            }
            height="800px"
            onRegionChange={onRegionChange}
            isLoading={propertiesWithinRadius.isLoading}
        />
    );
}
