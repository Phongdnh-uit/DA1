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
import { ArrowLeft } from "lucide-react";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { LocationPicker } from "@/components/general/LocationPicker";
import { Separator } from "@/components/ui/separator";
import { DocumentUpload } from "./DocumentUpload";
import { Badge } from "@/components/ui/badge";
import useDetailPropertyVM from "./DetailProperty.vm";

export const DetailPropertyPage = () => {
    const {
        form,
        wards,
        propertyTypes,
        provinces,
        thumbnail,
        galleries,
        documents,
    } = useDetailPropertyVM();

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
                        Thông tin bất động sản
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
                                            <div className="absolute top-0 -left-2 z-20">
                                                <Badge
                                                    className={
                                                        thumbnail?.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : thumbnail?.status === "REJECTED"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-green-100 text-green-800"
                                                    }
                                                >
                                                    {thumbnail?.status === "PENDING"
                                                        ? "Đang chờ hệ thống kiểm tra"
                                                        : thumbnail?.status === "REJECTED"
                                                            ? "Không được chấp nhận!"
                                                            : "An toàn và được chấp nhận"}
                                                </Badge>
                                            </div>
                                            <ImageZoom>
                                                <img
                                                    className={
                                                        "size-full lg:size-80 object-cover rounded-xl cursor-pointer border-2 border-blue-300 shadow-lg " +
                                                        (thumbnail?.status === "PENDING"
                                                            ? " opacity-50"
                                                            : "")
                                                    }
                                                    src={thumbnail.url}
                                                    alt="Thumbnail"
                                                />
                                            </ImageZoom>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Gallery - Right/Bottom */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                                        Gallery
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {galleries.length > 0 &&
                                            galleries.map((imageSrc, index) => (
                                                <div key={index} className="relative size-32">
                                                    <div className="absolute top-0 -left-2 z-20">
                                                        <Badge
                                                            className={
                                                                imageSrc?.status === "PENDING"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : thumbnail?.status === "REJECTED"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-green-100 text-green-800"
                                                            }
                                                        >
                                                            {imageSrc.status === "PENDING"
                                                                ? "Đang kiểm tra"
                                                                : imageSrc?.status === "REJECTED"
                                                                    ? "Không được chấp nhận!"
                                                                    : "Được chấp nhận"}
                                                        </Badge>
                                                    </div>
                                                    <ImageZoom>
                                                        <img
                                                            className={
                                                                "size-32 object-cover rounded-lg cursor-pointer border-2 border-blue-300 shadow " +
                                                                (imageSrc?.status === "PENDING"
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
                                initialLocation={
                                    form.getValues("location.latitude") &&
                                        form.getValues("location.longitude")
                                        ? {
                                            latitude: form.getValues("location.latitude") as number,
                                            longitude: form.getValues(
                                                "location.longitude",
                                            ) as number,
                                        }
                                        : undefined
                                }
                                interactive={false}
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
                                            disabled={true}
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
                                                disabled={true}
                                            />
                                            <FormInput<PropertyRequest>
                                                title="Giá (VNĐ)"
                                                placeholder="Nhập giá"
                                                type="number"
                                                name="price"
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormSelect<PropertyRequest>
                                                disabled={true}
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
                                                disabled={true}
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
                                                disabled={true}
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
                                                disabled={true}
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
                                            disabled={true}
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
                                                disabled={true}
                                            />
                                            <FormInput<PropertyRequest>
                                                disabled={true}
                                                title="Diện tích sàn (m²)"
                                                placeholder="Nhập diện tích"
                                                type="number"
                                                name="floorArea"
                                            />
                                            <FormInput<PropertyRequest>
                                                disabled={true}
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
                                                disabled={true}
                                                title="Số tầng"
                                                placeholder="Số tầng"
                                                type="number"
                                                name="floors"
                                            />
                                            <FormInput<PropertyRequest>
                                                disabled={true}
                                                title="Tầng hiện tại"
                                                placeholder="Tầng"
                                                type="number"
                                                name="floorNumber"
                                            />
                                            <FormInput<PropertyRequest>
                                                disabled={true}
                                                title="Phòng ngủ"
                                                placeholder="Số phòng"
                                                type="number"
                                                name="bedrooms"
                                            />
                                            <FormInput<PropertyRequest>
                                                disabled={true}
                                                title="Phòng tắm"
                                                placeholder="Số phòng"
                                                type="number"
                                                name="bathrooms"
                                            />
                                            <FormSelect<PropertyRequest>
                                                disabled={true}
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
                                                disabled={true}
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
                                            disabled={true}
                                            title="Nội thất"
                                            placeholder="Mô tả nội thất (VD: Đầy đủ, cơ bản...)"
                                            name="interior"
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                            <FormCheckbox<PropertyRequest>
                                                disabled={true}
                                                title="Có tầng hầm"
                                                direction="row"
                                                name="hasBasement"
                                            />
                                            <FormCheckbox<PropertyRequest>
                                                disabled={true}
                                                title="Có thang máy"
                                                direction="row"
                                                name="hasElevator"
                                            />
                                            <FormCheckbox<PropertyRequest>
                                                disabled={true}
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
                    <DocumentUpload documents={documents} />
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
                            disabled={true}
                            name="description"
                            className="h-[600px] overflow-hidden"
                        />
                    </Form>
                </Card>
            </div>
        </div>
    );
};
