import { queryClient } from "@/lib/queryClient";
import { useFindAllPropertyType } from "@/services/property-type/property-type";
import { useCreateProperty } from "@/services/property/property";
import { createPropertyBody } from "@/services/property/property.zod";
import { useFindAllProvince } from "@/services/province/province";
import { useFindAllWard } from "@/services/ward/ward";
import type { PropertyRequest, UploadConfirmRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetUploadSignature } from "@/services/upload/upload";
import { upload } from "@/utils/cloudinaryUpload";
import type { CloudinaryUploadResponse } from "@/lib/cloudinaryResponse";
import { convertCloudinaryUploadResponse } from "@/utils/convertCloudinaryUploadResponse";

export default function useCreatePropertyVM() {
    const form = useForm<PropertyRequest>({
        defaultValues: {},
        mode: "onSubmit",
        resolver: zodResolver(createPropertyBody),
    });
    const mutation = useCreateProperty({
        mutation: {
            onSuccess: () => {
                toast.success("Create property successfully");
                queryClient.invalidateQueries({
                    queryKey: ["/properties/all"],
                    exact: false,
                });
                form.reset();
                setThumbnail(undefined);
                setGallery([]);
            },
        },
    });
    const onSubmit = (data: PropertyRequest) => {
        mutation.mutate({ data });
    };

    const { data: provinces } = useFindAllProvince({ size: undefined, all: true });

    const { data: wards } = useFindAllWard(
        {
            size: undefined,
            filter: `province.id==${form.watch("provinceId")}`,
            all: true
        },
        {
            query: {
                enabled: !!form.watch("provinceId"),
            },
        },
    );

    const { data: propertyTypes } = useFindAllPropertyType({ size: undefined });

    const [thumbnail, setThumbnail] = useState<
        | {
            preview?: string;
            result?: UploadConfirmRequest;
        }
        | undefined
    >(undefined);
    const [gallery, setGallery] = useState<
        {
            preview?: string;
            result?: UploadConfirmRequest;
        }[]
    >([]);

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
    };
}
