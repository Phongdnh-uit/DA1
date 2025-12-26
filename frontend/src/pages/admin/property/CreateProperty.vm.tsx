import { queryClient } from "@/lib/queryClient";
import { useFindAllPropertyType } from "@/services/property-type/property-type";
import { useCreateProperty } from "@/services/property/property";
import { createPropertyBody } from "@/services/property/property.zod";
import { useFindAllProvince } from "@/services/province/province";
import { useFindAllWard } from "@/services/ward/ward";
import {
    type FileResponse,
    PresignedUploadRequestPurpose,
    type Location,
    type PropertyRequest,
    FileResponseStatus,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useFileUpload } from "@/hooks/useFileHook";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { config } from "@/lib/config";

export default function useCreatePropertyVM() {
    const form = useForm<PropertyRequest>({
        defaultValues: {
            title: "",
            purpose: "FOR_SALE",
            typeId: undefined,
            price: 0,
            lineAddress: "",
            provinceId: undefined,
            wardId: undefined,
            landArea: undefined,
            floorArea: undefined,
            floors: undefined,
            floorNumber: undefined,
            bedrooms: undefined,
            bathrooms: undefined,
            direction: undefined,
            description: "",
            entranceRoadWidth: undefined,
            balconyDirection: undefined,
            hasMezzanine: false,
            hasBasement: false,
            hasElevator: false,
            interior: "",
            status: "AVAILABLE",
            location: undefined,
            documentIds: [],
            thumbnailId: undefined,
            galleryIds: [],
        },
        mode: "onSubmit",
        resolver: zodResolver(createPropertyBody),
    });

    // STATE
    const [documents, setDocuments] = useState<FileResponse[]>([]);
    const [thumbnail, setThumbnail] = useState<
        | {
            url?: string;
            file?: FileResponse;
        }
        | undefined
    >(undefined);
    const [gallery, setGallery] = useState<
        {
            url?: string;
            file?: FileResponse;
        }[]
    >([]);

    const sseControllersRef = useRef<Map<string, AbortController>>(new Map());

    // HOOK
    const { uploadFile } = useFileUpload();

    const mutation = useCreateProperty({
        mutation: {
            onSuccess: () => {
                toast.success("Tạo mới bất động sản thành công");
                sseControllersRef.current.forEach((c) => c.abort());
                sseControllersRef.current.clear();
                form.reset(undefined, {
                    keepDefaultValues: true,
                });
                setThumbnail(undefined);
                setGallery([]);
                setDocuments([]);
                queryClient.invalidateQueries({
                    queryKey: ["/properties/all"],
                    exact: false,
                });
            },
            onError: () => {
                toast.error("Tạo mới bất động sản thất bại. Vui lòng thử lại");
            },
        },
    });

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
    const onSubmit = (data: PropertyRequest) => {
        mutation.mutate({ data });
    };

    const handleThumbnailChange = async (file: File) => {
        const preview = URL.createObjectURL(file);
        setThumbnail({ url: preview });
        try {
            const response = await uploadFile(
                file,
                PresignedUploadRequestPurpose.PROPERTY_THUMBNAIL,
            );
            form.setValue("thumbnailId", response.file?.id as number);
            // TODO: Need to subscribe SSE to listen to the upload status
            setThumbnail({
                url: preview,
                file: response.file,
            });
            subscribeFileSSE(response.file?.objectName as string);
        } catch {
            setThumbnail(undefined);
            URL.revokeObjectURL(preview);
        }
    };

    const handleGalleryChange = async (file: File) => {
        const preview = URL.createObjectURL(file);
        setGallery((prev) => [...prev, { url: preview }]);
        try {
            const response = await uploadFile(
                file,
                PresignedUploadRequestPurpose.PROPERTY_GALLERY,
            );
            form.setValue("galleryIds", [
                ...(form.getValues("galleryIds") || []),
                response.file?.id as number,
            ]);
            setGallery((prev) =>
                prev.map((item) =>
                    item.url === preview
                        ? {
                            url: preview,
                            file: response.file,
                        }
                        : item,
                ),
            );
            subscribeFileSSE(response.file?.objectName as string);
        } catch {
            toast.error("Upload ảnh thất bại. Vui lòng thử lại");
            setGallery((prev) => prev.filter((item) => item.url !== preview));
            URL.revokeObjectURL(preview);
        }
    };

    const handleRemoveThumbnail = () => {
        form.setValue("thumbnailId", 0);
        if (
            thumbnail?.file &&
            thumbnail.file.status !== FileResponseStatus.PENDING
        ) {
            const controller = sseControllersRef.current.get(
                thumbnail.file.objectName as string,
            );
            if (controller) {
                controller.abort();
                sseControllersRef.current.delete(thumbnail.file.objectName as string);
            }
            // Revoke object URL
            if (thumbnail.url?.startsWith("blob:"))
                URL.revokeObjectURL(thumbnail.url as string);
        }
        setThumbnail(undefined);
    };

    const handleRemoveGallery = (index: number) => {
        form.setValue(
            "galleryIds",
            (form.getValues("galleryIds") || []).filter((_, idx) => idx !== index),
        );
        setGallery((prev) => prev.filter((_, i) => i !== index));
        const toBeRemoved = gallery.at(index);
        if (
            toBeRemoved?.file &&
            toBeRemoved.file.status !== FileResponseStatus.PENDING
        ) {
            const controller = sseControllersRef.current.get(
                toBeRemoved.file.objectName as string,
            );
            if (controller) {
                controller.abort();
                sseControllersRef.current.delete(toBeRemoved.file.objectName as string);
            }
            // Revoke object URL
            if (toBeRemoved.url?.startsWith("blob:"))
                URL.revokeObjectURL(toBeRemoved.url as string);
        }
    };

    const onLocationChange = (data: Location | undefined) => {
        form.setValue("location", data);
    };

    const handleAddDocument = async (file: File) => {
        const response = await uploadFile(
            file,
            PresignedUploadRequestPurpose.PROPERTY_FILE,
        );
        setDocuments((prev) => [...prev, response.file as FileResponse]);
        form.setValue("documentIds", [
            ...(form.getValues("documentIds") || []),
            response.file?.id as number,
        ]);
        subscribeFileSSE(response.file?.objectName as string);
    };

    const handleRemoveDocument = (index: number) => {
        const toBeRemoved = documents.at(index);
        const controller = sseControllersRef.current.get(
            toBeRemoved?.objectName as string,
        );
        if (controller) {
            controller.abort();
            sseControllersRef.current.delete(toBeRemoved?.objectName as string);
        }
        form.setValue(
            "documentIds",
            (form.getValues("documentIds") || []).filter((_, idx) => idx !== index),
        );
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    const subscribeFileSSE = useCallback((objectKey: string) => {
        const controller = new AbortController();
        if (!objectKey) return;

        sseControllersRef.current.set(objectKey, controller);

        let isCancelled = false;

        fetchEventSource(
            `${config.backendUrl}/sse/files/notifications/${objectKey}/subscribe`,
            {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${config.accessToken}`,
                },
                onmessage(event) {
                    try {
                        if (event.event !== "file-process") return;
                        console.log("SSE message received:", event);
                        const data = JSON.parse(event.data);
                        if (!isCancelled) {
                            setDocuments((prev) =>
                                prev.map((doc) =>
                                    doc.objectName !== objectKey
                                        ? doc
                                        : { ...doc, status: data.status },
                                ),
                            );
                            setGallery((prev) =>
                                prev.map((item) => {
                                    if (item.file?.objectName !== objectKey) return item;
                                    // Revoke old URL if status changed
                                    if (item.url?.startsWith("blob:"))
                                        URL.revokeObjectURL(item.url as string);
                                    return {
                                        url: data.url,
                                        file: {
                                            ...item.file,
                                            status: data.status,
                                        },
                                    };
                                }),
                            );
                            setThumbnail((prev) => {
                                if (prev?.file?.objectName !== objectKey) return prev;
                                // Revoke old URL if status changed
                                if (prev.url?.startsWith("blob:"))
                                    URL.revokeObjectURL(prev.url as string);
                                URL.revokeObjectURL(prev?.url as string);
                                return {
                                    url: data.url,
                                    file: {
                                        ...prev?.file,
                                        status: data.status,
                                    },
                                };
                            });
                        }
                    } catch (err) {
                        console.error("Invalid JSON from SSE", err);
                    }
                },
                onerror(err) {
                    console.error("SSE error", err);
                    if (!isCancelled) throw err;
                },
                signal: controller.signal,
            },
        );

        return () => {
            isCancelled = true;
        };
    }, []);

    // SIDE EFFECTS && CLEANUP
    useEffect(() => {
        return () => {
            sseControllersRef.current.forEach((controller) => {
                controller.abort();
            });
            sseControllersRef.current.clear();
        };
    }, []);

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
        handleRemoveThumbnail,
        handleRemoveGallery,
        onLocationChange,
        documents,
        handleAddDocument,
        handleRemoveDocument,
    };
}
