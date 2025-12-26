import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, Save, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentBlockResponse } from "@/types";
import { useFileUpload } from "@/hooks/useFileHook";
import { Route } from "@/routes/admin/settings";
import { useUploadCarousel } from "@/services/content-block/content-block";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { config } from "@/lib/config";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CarouselMetadata } from "@/no-gen/types/carouselMetadata";

interface CarouselImage {
    url?: string;
    contentBlock?: ContentBlockResponse;
}

export const CarouselSetting = () => {
    const { carousel, imageUrls } = Route.useLoaderData();
    const [images, setImages] = useState<CarouselImage[]>(
        carousel?.data?.map((item) => ({
            contentBlock: item,
            url: imageUrls?.find((img) => img.data?.key === item.file?.objectName)
                ?.data?.url,
        })) || [],
    );

    const sseControllersRef = useRef<Map<string, AbortController>>(new Map());

    const uploadCarousel = useUploadCarousel({
        mutation: {
            onSuccess: () => {
                toast.success("Cập nhật carousel thành công!");
            },
            onError: () => {
                toast.error("Cập nhật carousel thất bại. Vui lòng thử lại.");
            },
        },
    });

    const onSaveChanges = () => {
        uploadCarousel.mutate({
            data: {
                contentBlocks: images.map((img) => ({
                    metadata: img?.contentBlock?.metadata,
                    fileId: img?.contentBlock?.file?.id,
                })),
            },
        });
    };

    const { uploadFile } = useFileUpload();

    const handleDeleteImage = (idx: number) => {
        setImages((prev) => prev.filter((_, id) => id !== idx));
    };

    const handleUpdateContentBlockMetadata = (
        idx: number,
        fieldName: string,
        value: string,
    ) => {
        setImages((prev) =>
            prev.map((img, id) =>
                id === idx
                    ? {
                        ...img,
                        contentBlock: {
                            ...img.contentBlock,
                            metadata: {
                                ...img.contentBlock?.metadata,
                                [fieldName]: value,
                            },
                        },
                    }
                    : img,
            ),
        );
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newImages: CarouselImage[] = Array.from(files).map((file) => ({
            url: URL.createObjectURL(file),
        }));
        await Promise.all(
            Array.from(files).map(async (file, idx) => {
                const response = await uploadFile(file, "CAROUSEL_IMAGE");
                newImages[idx].contentBlock = {
                    file: response.file,
                };
            }),
        );
        newImages.forEach((res) => {
            subscribeFileSSE(res.contentBlock?.file?.objectName as string);
        });
        setImages((prev) => [...prev, ...newImages]);
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
                        const data = JSON.parse(event.data);
                        console.log("SSE data received:", data);
                        if (!isCancelled) {
                            setImages((prevImages) =>
                                prevImages.map((img) =>
                                    img.contentBlock?.file?.objectName === objectKey
                                        ? {
                                            url: data.url,
                                            contentBlock: {
                                                ...img.contentBlock,
                                                file: {
                                                    ...img.contentBlock?.file,
                                                    status: data.status,
                                                },
                                            },
                                        }
                                        : img,
                                ),
                            );
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

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Page Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ImagePlus className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight">
                                    Quản lý Carousel Trang Chủ
                                </h1>
                            </div>
                            <p className="text-lg text-muted-foreground">
                                Quản lý hình ảnh và hiển thị trên trang chủ để thu hút khách
                                hàng
                            </p>
                        </div>
                        <Button onClick={onSaveChanges} size="lg" className="gap-2">
                            <Save className="h-4 w-4" />
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Upload Section */}
                    <Card className="shadow-lg border-2 border-dashed">
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">
                                        Tải lên hình ảnh mới
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Hỗ trợ định dạng JPG, PNG, WebP. Tỷ lệ khuyến nghị 16:9
                                    </p>
                                </div>

                                <label className="relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-12 transition-all hover:bg-muted/50 hover:border-primary/50 cursor-pointer group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                    />
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-semibold">
                                            Kéo thả hình ảnh vào đây hoặc{" "}
                                            <span className="text-primary">
                                                chọn file từ máy tính
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Bạn có thể tải lên nhiều hình ảnh cùng lúc
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Danh sách hiển thị</h2>
                            </div>
                            <Badge variant="secondary" className="text-base px-3 py-1">
                                {images.length} hình ảnh
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {images.map((image, idx) => (
                                <Card
                                    key={idx}
                                    className={`relative transition-all shadow-md hover:shadow-xl hover:border-primary/50`}
                                >
                                    {/* Actions */}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteImage(idx)}
                                        className="gap-2 absolute top-4 right-4 z-10"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">Xóa</span>
                                    </Button>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="flex gap-4">
                                                <div className="relative group">
                                                    <div
                                                        className={`w-full lg:w-56 h-40 rounded-lg overflow-hidden border-2 transition-all `}
                                                    >
                                                        <img
                                                            src={image.url}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute top-3 right-3">
                                                        <Badge
                                                            className={
                                                                image.contentBlock?.file?.status === "PENDING"
                                                                    ? "bg-yellow-500 text-white"
                                                                    : image.contentBlock?.file?.status ===
                                                                        "REJECTED"
                                                                        ? "bg-red-500 text-white"
                                                                        : "bg-green-500 text-white"
                                                            }
                                                        >
                                                            {image.contentBlock?.file?.status === "PENDING"
                                                                ? "Đang kiểm tra hợp lệ!"
                                                                : image.contentBlock?.file?.status ===
                                                                    "REJECTED"
                                                                    ? "Bị từ chối"
                                                                    : "Đã chấp thuận"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Fields */}
                                            <div className="flex-1 grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`caption-${idx}`}
                                                        className="text-xs uppercase tracking-wider"
                                                    >
                                                        Tiêu đề (Caption)
                                                    </Label>

                                                    <div
                                                        className={cn(
                                                            "relative flex items-center rounded-2xl border backdrop-blur-sm",
                                                            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30",
                                                            "focus-within:scale-102 transition-all",
                                                            "hover:border-primary",
                                                            "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed error-display",
                                                        )}
                                                    >
                                                        <Input
                                                            id={`caption-${idx}`}
                                                            placeholder="Nhập tiêu đề hình ảnh..."
                                                            className="border-0 focus-visible:ring-0 shadow-none w-full rounded-[24px] h-14 placeholder:text-lg !text-lg"
                                                            value={
                                                                (
                                                                    image.contentBlock
                                                                        ?.metadata as CarouselMetadata
                                                                ).caption || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateContentBlockMetadata(
                                                                    idx,
                                                                    "caption",
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`subcaption-${idx}`}
                                                        className="text-xs uppercase tracking-wider"
                                                    >
                                                        Phụ đề
                                                    </Label>
                                                    <div
                                                        className={cn(
                                                            "relative flex items-center rounded-2xl border backdrop-blur-sm",
                                                            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30",
                                                            "focus-within:scale-102 transition-all",
                                                            "hover:border-primary",
                                                            "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed error-display",
                                                        )}
                                                    >
                                                        <Input
                                                            className="border-0 focus-visible:ring-0 shadow-none w-full rounded-[24px] h-14 placeholder:text-lg !text-lg"
                                                            id={`subcaption-${idx}`}
                                                            placeholder="Nhập phụ đề hình ảnh..."
                                                            value={
                                                                (
                                                                    image.contentBlock
                                                                        ?.metadata as CarouselMetadata
                                                                ).subcaption || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateContentBlockMetadata(
                                                                    idx,
                                                                    "subcaption",
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {images.length === 0 && (
                            <Card className="shadow-lg">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <ImagePlus className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Chưa có hình ảnh nào
                                    </h3>
                                    <p className="text-muted-foreground mb-6 max-w-md">
                                        Tải lên hình ảnh đầu tiên để bắt đầu quản lý carousel trang
                                        chủ của bạn
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
