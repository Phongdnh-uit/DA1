import { queryClient } from "@/lib/queryClient";
import { useFindAllPropertyType } from "@/services/property-type/property-type";
import {
    useFindPropertyById,
    useUpdateProperty,
} from "@/services/property/property";
import { updatePropertyBody } from "@/services/property/property.zod";
import { useFindAllProvince } from "@/services/province/province";
import { useFindAllWard } from "@/services/ward/ward";
import type {
    MediaResponse,
    PropertyRequest,
    UploadConfirmRequest,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetUploadSignature } from "@/services/upload/upload";
import { upload } from "@/utils/cloudinaryUpload";
import type { CloudinaryUploadResponse } from "@/lib/cloudinaryResponse";
import { convertCloudinaryUploadResponse } from "@/utils/convertCloudinaryUploadResponse";
import { Route } from "@/routes/admin/property/update.$id";
import { type Location } from "@/types/location";

export default function useUpdatePropertyVM() {
    const { id } = Route.useParams();
    const property = useFindPropertyById(+id);
    const form = useForm<PropertyRequest>({
        defaultValues: {
            title: property?.data?.data?.title ?? undefined,
            balconyDirection: property?.data?.data?.balconyDirection ?? undefined,
            bedrooms: property?.data?.data?.bedrooms ?? undefined,
            bathrooms: property?.data?.data?.bathrooms ?? undefined,
            landArea: property?.data?.data?.landArea ?? undefined,
            price: property?.data?.data?.price ?? undefined,
            description: property?.data?.data?.description ?? undefined,
            provinceId: property?.data?.data?.ward?.province?.id ?? undefined,
            wardId: property?.data?.data?.ward?.id ?? undefined,
            direction: property?.data?.data?.direction ?? undefined,
            entranceRoadWidth: property?.data?.data?.entranceRoadWidth ?? undefined,
            floorArea: property?.data?.data?.floorArea ?? undefined,
            floorNumber: property?.data?.data?.floorNumber ?? undefined,
            floors: property?.data?.data?.floors ?? undefined,
            hasBasement: property?.data?.data?.hasBasement ?? undefined,
            hasElevator: property?.data?.data?.hasElevator ?? undefined,
            hasMezzanine: property?.data?.data?.hasMezzanine ?? undefined,
            interior: property?.data?.data?.interior ?? undefined,
            lineAddress: property?.data?.data?.lineAddress ?? undefined,
            purpose: property?.data?.data?.purpose ?? undefined,
            status: property?.data?.data?.status ?? undefined,
            typeId: property?.data?.data?.type?.id ?? undefined,
            medias: property?.data?.data?.medias?.map((media) => ({
                bytes: media.bytes,
                format: media.format,
                height: media.height,
                width: media.width,
                purpose: media.purpose,
                publicId: media.publicId,
                resourceType: media.resourceType,
                secureUrl: media.secureUrl,
                version: media.version,
            })),
            location: property?.data?.data?.location ?? undefined,
        },
        mode: "onSubmit",
        resolver: zodResolver(updatePropertyBody),
    });

    const mutation = useUpdateProperty({
        mutation: {
            onSuccess: () => {
                toast.success("Cập nhật thông tin bất động sản thành công");
                queryClient.invalidateQueries({
                    queryKey: ["/properties/all"],
                    exact: false,
                });
                form.reset();
                setThumbnail(undefined);
                setGallery([]);
            },
            onError: () => {
                toast.error("Lỗi xảy ra, vui lòng thử lại");
            },
        },
    });
    const onSubmit = (data: PropertyRequest) => {
        mutation.mutate({ id: +id, data: data });
    };

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

    const mediaResponseToUploadConfirmRequest = (
        data: MediaResponse,
    ): UploadConfirmRequest => ({
        publicId: data.publicId as string,
        bytes: data.bytes as number,
        format: data.format as string,
        resourceType: data.resourceType as string,
        height: data.height as number,
        width: data.width as number,
        purpose: data.purpose as "THUMBNAIL" | "GALLERY",
        secureUrl: data.secureUrl as string,
        version: data.version as number,
    });

    const { data: propertyTypes } = useFindAllPropertyType({ size: undefined });

    const [thumbnail, setThumbnail] = useState<
        | {
            preview?: string;
            result?: UploadConfirmRequest;
        }
        | undefined
    >({
        preview: undefined,
        result: {
            ...mediaResponseToUploadConfirmRequest(
                property?.data?.data?.medias?.find(
                    (media) => media.purpose === "THUMBNAIL",
                ) as MediaResponse,
            ),
        },
    });
    const [gallery, setGallery] = useState<
        {
            preview?: string;
            result?: UploadConfirmRequest;
        }[]
    >(
        property?.data?.data?.medias
            ?.filter((media) => media.purpose === "GALLERY")
            .map((media) => ({
                preview: undefined,
                result: mediaResponseToUploadConfirmRequest(media),
            })) || [],
    );

    const [cloudName, setCloudName] = useState<string | undefined>(undefined);

    const { mutateAsync } = useGetUploadSignature();

    const handleThumbnailChange = async (file: File) => {
        const preview = URL.createObjectURL(file);
        setThumbnail({ preview });
        try {
            const data = await mutateAsync();
            if (!data.data) return;
            if (!cloudName) setCloudName(data.data.cloudName);
            const result: CloudinaryUploadResponse = await upload(file, data.data);
            if (result.public_id) {
                const converted = convertCloudinaryUploadResponse(result, "THUMBNAIL");
                form.setValue("medias", [
                    ...(form.getValues("medias") || []),
                    converted,
                ]);
                setThumbnail({ preview: undefined, result: converted });
                toast.success("Upload ảnh thành công");
                console.log(thumbnail);
            } else {
                toast.error("Upload ảnh thất bại. Vui lòng thử lại");
            }
        } catch {
            toast.error("Upload ảnh thất bại. Vui lòng thử lại");
            setThumbnail(undefined);
        } finally {
            URL.revokeObjectURL(preview);
        }
    };

    const handleGalleryChange = async (file: File) => {
        const preview = URL.createObjectURL(file);
        setGallery((prev) => [...prev, { preview }]);
        try {
            const data = await mutateAsync();
            if (!data.data) return;
            if (!cloudName) setCloudName(data.data.cloudName);
            const result: CloudinaryUploadResponse = await upload(file, data.data);
            if (result.public_id) {
                const converted = convertCloudinaryUploadResponse(result, "GALLERY");
                form.setValue("medias", [
                    ...(form.getValues("medias") || []),
                    converted,
                ]);
                setGallery((prev) =>
                    prev.map((item) =>
                        item.preview === preview
                            ? { preview: undefined, result: converted }
                            : item,
                    ),
                );
                toast.success("Upload ảnh thành công");
            }
        } catch {
            toast.error("Upload ảnh thất bại. Vui lòng thử lại");
            setGallery((prev) => prev.filter((item) => item.preview !== preview));
        } finally {
            URL.revokeObjectURL(preview);
        }
    };

    const handleRemoveThumbnail = () => {
        form.setValue(
            "medias",
            (form.getValues("medias") || []).filter(
                (media) => media.purpose !== "THUMBNAIL",
            ),
        );
        setThumbnail(undefined);
    };

    const handleRemoveGallery = (index: number) => {
        const toBeRemoved = gallery.at(index);
        if (toBeRemoved?.result) {
            form.setValue(
                "medias",
                (form.getValues("medias") || []).filter(
                    (media) => media.publicId !== toBeRemoved.result?.publicId,
                ),
            );
            setGallery((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const onLocationChange = (data: Location | undefined) => {
        form.setValue("location", data);
    };

    return {
        form,
        onSubmit,
        wards,
        propertyTypes,
        provinces,
        thumbnail,
        gallery,
        handleThumbnailChange,
        handleGalleryChange,
        cloudName,
        handleRemoveThumbnail,
        handleRemoveGallery,
        onLocationChange,
    };
}
