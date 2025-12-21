import { Form } from "@/components/ui/form";
import {
    FormCheckbox,
    FormEditor,
    FormInput,
    FormSelect,
} from "@/utils/formUtil";
import { PropertyRequestStatus, type PropertyRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Upload from "@/components/general/Upload";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import SpiralLoader from "@/components/ui/SpiralLoader";
import { LocationPicker } from "@/components/general/LocationPicker";
import { Separator } from "@/components/ui/separator";
import { type Location } from "@/types/location";
import { DocumentUpload } from "./DocumentUpload";
import useUpdatePropertyVM from "./UpdateProperty.vm";

export const UpdatePropertyPage = () => {
    const {
        form,
        onSubmit,
        wards,
        propertyTypes,
        provinces,
        thumbnail,
        handleThumbnailChange,
        gallery,
        handleGalleryChange,
        handleRemoveGallery,
        handleRemoveThumbnail,
        documents,
        handleAddDocument,
        handleRemoveDocument,
        onLocationChange,
    } = useUpdatePropertyVM();

    return (
        <div className="min-h-screen">
            <div className="mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="size-6" />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Cập nhật thông tin bất động sản
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Image Upload Section */}
                        <Card className="p-6 rounded-[24px] shadow-sm mb-6">
                            <div className="mb-6 flex justify-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                                        Hình ảnh bất động sản
                                    </h2>
                                    <p className="text-gray-500">
                                        Chọn một ảnh làm thumbnail và các ảnh còn lại cho gallery.
                                    </p>
                                </div>
                            </div>

                            <div>
                                {/* Thumbnail - Left/Top */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                                        Ảnh Thumbnail
                                    </h3>
                                    {thumbnail ? (
                                        <div className="relative w-full h-full lg:w-80 lg:h-80">
                                            {thumbnail.file?.status === "PENDING" && (
                                                <SpiralLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 z-10" />
                                            )}
                                            <button
                                                onClick={() => handleRemoveThumbnail()}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full z-20 p-1 transition-colors"
                                            >
                                                <XIcon className="size-4 text-white" />
                                            </button>
                                            <ImageZoom>
                                                <img
                                                    className={
                                                        "w-full h-full object-cover rounded-xl cursor-pointer border-2 border-blue-300 shadow-lg " +
                                                        (thumbnail.file?.status === "PENDING"
                                                            ? " opacity-50"
                                                            : "")
                                                    }
                                                    src={thumbnail.url}
                                                    alt="Thumbnail"
                                                />
                                            </ImageZoom>
                                        </div>
                                    ) : (
                                        <div className="w-full lg:w-80 h-80">
                                            <Upload
                                                name="thumbnail"
                                                onUpload={(files) => handleThumbnailChange(files[0])}
                                                isSingle={true}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Gallery - Right/Bottom */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                                        Gallery
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        <Upload
                                            className="size-32"
                                            name="gallery"
                                            isMinimal
                                            onUpload={(files) => handleGalleryChange(files[0])}
                                            isSingle={true}
                                        />
                                        {gallery.length > 0 &&
                                            gallery.map((imageSrc, index) => (
                                                <div key={index} className="relative size-32">
                                                    {imageSrc.file?.status === "PENDING" && (
                                                        <SpiralLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 z-10" />
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveGallery(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full z-20 p-1 transition-colors"
                                                    >
                                                        <XIcon className="size-4 text-white" />
                                                    </button>
                                                    <ImageZoom>
                                                        <img
                                                            className={
                                                                "w-full h-full object-cover rounded-lg cursor-pointer border-2 border-blue-300 shadow " +
                                                                (imageSrc.file?.status === "PENDING"
                                                                    ? " opacity-50"
                                                                    : "")
                                                            }
                                                            src={imageSrc.url}
                                                            alt={`Gallery ${index + 1}`}
                                                        />
                                                    </ImageZoom>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Location Picker */}
                        <Card className="p-6 rounded-[24px] shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Vị trí trên bản đồ
                                </h2>
                                <p className="text-gray-500">
                                    Chọn vị trí chính xác của bất động sản
                                </p>
                            </div>
                            <LocationPicker
                                onChange={(data) =>
                                    onLocationChange(data ? (data as Location) : undefined)
                                }
                            />
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card className="p-6 rounded-[24px] shadow-sm">
                            <CardHeader className="px-0 pt-0">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Thông tin cơ bản
                                </h2>
                                <p className="text-gray-500">
                                    Điền đầy đủ thông tin về bất động sản
                                </p>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                <Form {...form}>
                                    <div className="space-y-4">
                                        <FormInput<PropertyRequest>
                                            title="Tên bất động sản"
                                            placeholder="Nhập tên bất động sản"
                                            name="title"
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormSelect<PropertyRequest>
                                                title="Mục đích"
                                                name="purpose"
                                                options={[
                                                    {
                                                        key: "FOR_SALE",
                                                        render: "Bán",
                                                    },
                                                    {
                                                        key: "FOR_RENT",
                                                        render: "Cho thuê",
                                                    },
                                                ]}
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Giá (VNĐ)"
                                                placeholder="Nhập giá"
                                                type="number"
                                                name="price"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormSelect<PropertyRequest>
                                                title="Loại bất động sản"
                                                name="typeId"
                                                keyType="number"
                                                options={
                                                    propertyTypes?.data?.content?.map((type) => ({
                                                        key: "" + type.id,
                                                        render: type.name,
                                                    })) || []
                                                }
                                            />
                                            <FormSelect<PropertyRequest>
                                                title="Trạng thái"
                                                name="status"
                                                options={Object.keys(PropertyRequestStatus).map(
                                                    (key) => ({
                                                        key: key,
                                                        render:
                                                            PropertyRequestStatus[
                                                            key as keyof typeof PropertyRequestStatus
                                                            ],
                                                    }),
                                                )}
                                            />
                                        </div>

                                        <Separator className="my-6" />

                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Địa chỉ
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormSelect<PropertyRequest>
                                                title="Tỉnh/Thành phố"
                                                name="provinceId"
                                                keyType="number"
                                                disabled={provinces?.data?.content?.length === 0}
                                                options={
                                                    provinces?.data?.content?.map((province) => ({
                                                        key: "" + province.id,
                                                        render: "" + province.type + " " + province.name,
                                                    })) || []
                                                }
                                            />
                                            <FormSelect<PropertyRequest>
                                                title="Phường/Xã"
                                                name="wardId"
                                                keyType="number"
                                                disabled={!form.getValues("provinceId")}
                                                options={
                                                    wards?.data?.content?.map((ward) => ({
                                                        key: "" + ward.id,
                                                        render: "" + ward.type + " " + ward.name,
                                                    })) || []
                                                }
                                            />
                                        </div>

                                        <FormInput<PropertyRequest>
                                            title="Địa chỉ"
                                            placeholder="Nhập địa chỉ cụ thể"
                                            disabled={!form.getValues("wardId")}
                                            name="lineAddress"
                                        />

                                        <Separator className="my-6" />

                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Chi tiết diện tích
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormInput<PropertyRequest>
                                                title="Diện tích đất (m²)"
                                                placeholder="Nhập diện tích"
                                                type="number"
                                                name="landArea"
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Diện tích sàn (m²)"
                                                placeholder="Nhập diện tích"
                                                type="number"
                                                name="floorArea"
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Chiều rộng đường (m)"
                                                placeholder="Chiều rộng"
                                                type="number"
                                                name="entranceRoadWidth"
                                            />
                                        </div>

                                        <Separator className="my-6" />

                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Thông số kỹ thuật
                                        </h3>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <FormInput<PropertyRequest>
                                                title="Số tầng"
                                                placeholder="Số tầng"
                                                type="number"
                                                name="floors"
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Tầng hiện tại"
                                                placeholder="Tầng"
                                                type="number"
                                                name="floorNumber"
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Phòng ngủ"
                                                placeholder="Số phòng"
                                                type="number"
                                                name="bedrooms"
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Phòng tắm"
                                                placeholder="Số phòng"
                                                type="number"
                                                name="bathrooms"
                                            />
                                            <FormSelect<PropertyRequest>
                                                title="Hướng nhà"
                                                options={[
                                                    { key: "NORTH", render: "Bắc" },
                                                    { key: "SOUTH", render: "Nam" },
                                                    { key: "EAST", render: "Đông" },
                                                    { key: "WEST", render: "Tây" },
                                                    { key: "NORTHEAST", render: "ĐB" },
                                                    { key: "NORTHWEST", render: "TB" },
                                                    { key: "SOUTHEAST", render: "ĐN" },
                                                    { key: "SOUTHWEST", render: "TN" },
                                                ]}
                                                name="direction"
                                            />
                                            <FormSelect<PropertyRequest>
                                                title="Hướng ban công"
                                                options={[
                                                    { key: "NORTH", render: "Bắc" },
                                                    { key: "SOUTH", render: "Nam" },
                                                    { key: "EAST", render: "Đông" },
                                                    { key: "WEST", render: "Tây" },
                                                    { key: "NORTHEAST", render: "ĐB" },
                                                    { key: "NORTHWEST", render: "TB" },
                                                    { key: "SOUTHEAST", render: "ĐN" },
                                                    { key: "SOUTHWEST", render: "TN" },
                                                ]}
                                                name="balconyDirection"
                                            />
                                        </div>

                                        <FormInput<PropertyRequest>
                                            title="Nội thất"
                                            placeholder="Mô tả nội thất (VD: Đầy đủ, cơ bản...)"
                                            name="interior"
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                            <FormCheckbox<PropertyRequest>
                                                title="Có tầng hầm"
                                                direction="row"
                                                name="hasBasement"
                                            />
                                            <FormCheckbox<PropertyRequest>
                                                title="Có thang máy"
                                                direction="row"
                                                name="hasElevator"
                                            />
                                            <FormCheckbox<PropertyRequest>
                                                title="Có gác lửng"
                                                direction="row"
                                                name="hasMezzanine"
                                            />
                                        </div>
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Document Upload Section */}
                <div className="mb-6">
                    <DocumentUpload
                        documents={documents}
                        onDocumentAdd={handleAddDocument}
                        onDocumentRemove={handleRemoveDocument}
                    />
                </div>

                {/* Description Editor */}
                <Card className="p-6 rounded-[24px] shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Mô tả chi tiết
                        </h2>
                        <p className="text-gray-500">Viết mô tả chi tiết về bất động sản</p>
                    </div>
                    <Form {...form}>
                        <FormEditor<PropertyRequest>
                            name="description"
                            className="h-[600px] overflow-hidden"
                        />
                    </Form>
                </Card>
                {/* Submit Button - Full Width at Bottom */}
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={() =>
                            form.handleSubmit(onSubmit, (errors) => {
                                console.log(errors);
                            })()
                        }
                        className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                        name="confirm-button"
                    >
                        Cập nhật Bất động sản
                    </Button>
                </div>
            </div>
        </div>
    );
};
