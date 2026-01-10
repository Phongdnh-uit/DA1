import { useFindAllPropertyType } from "@/services/property-type/property-type";
import { updatePropertyBody } from "@/services/property/property.zod";
import { useFindAllProvince } from "@/services/province/province";
import { useFindAllWard } from "@/services/ward/ward";
import { type PropertyRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Route } from "@/routes/admin/property/detail.$id";

export default function useDetailPropertyVM() {
    const { property } = Route.useLoaderData();
    const form = useForm<PropertyRequest>({
        defaultValues: {
            title: property?.data?.title ?? undefined,
            balconyDirection: property?.data?.balconyDirection ?? undefined,
            bedrooms: property?.data?.bedrooms ?? undefined,
            bathrooms: property?.data?.bathrooms ?? undefined,
            landArea: property?.data?.landArea ?? undefined,
            price: property?.data?.price ?? undefined,
            description: property?.data?.description ?? undefined,
            provinceId: property?.data?.ward?.province?.id ?? undefined,
            wardId: property?.data?.ward?.id ?? undefined,
            direction: property?.data?.direction ?? undefined,
            entranceRoadWidth: property?.data?.entranceRoadWidth ?? undefined,
            floorArea: property?.data?.floorArea ?? undefined,
            floorNumber: property?.data?.floorNumber ?? undefined,
            floors: property?.data?.floors ?? undefined,
            hasBasement: property?.data?.hasBasement ?? undefined,
            hasElevator: property?.data?.hasElevator ?? undefined,
            hasMezzanine: property?.data?.hasMezzanine ?? undefined,
            interior: property?.data?.interior ?? undefined,
            lineAddress: property?.data?.lineAddress ?? undefined,
            purpose: property?.data?.purpose ?? undefined,
            status: property?.data?.status ?? undefined,
            typeId: property?.data?.type?.id ?? undefined,
            documentIds: property?.data?.documents?.map((doc) => doc.id) ?? [],
            thumbnailId: property?.data?.thumbnail?.id ?? undefined,
            galleryIds: property?.data?.galleries?.map((media) => media.id) ?? [],
            location: property?.data?.location ?? undefined,
        },
        mode: "onSubmit",
        resolver: zodResolver(updatePropertyBody),
        disabled: true,
    });

    // STATE

    // HOOK

    const { data: provinces } = useFindAllProvince({
        size: undefined,
        all: true,
    });

    const { data: wards } = useFindAllWard(
        {
            size: undefined,
            filter: `province.id==${form.watch("provinceId")}`,
            all: true,
        },
        {
            query: {
                enabled: !!form.watch("provinceId"),
            },
        },
    );

    const { data: propertyTypes } = useFindAllPropertyType({ size: undefined });

    // FUNCTIONS

    return {
        form,
        wards,
        propertyTypes,
        provinces,
        galleries: property?.data?.galleries ?? [],
        documents: property?.data?.documents ?? [],
        thumbnail: property?.data?.thumbnail ?? null,
    };
}
