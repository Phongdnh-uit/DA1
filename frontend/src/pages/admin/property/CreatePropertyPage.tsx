import { Form } from "@/components/ui/form";
import {
    FormCheckbox,
    FormEditor,
    FormInput,
    FormSelect,
} from "@/utils/formUtil";
import {
    PropertyRequestPurpose,
    PropertyRequestStatus,
    type PropertyRequest,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import useCreatePropertyVM from "./CreateProperty.vm";
import Upload from "@/components/general/Upload";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import SpiralLoader from "@/components/ui/SpiralLoader";

export const CreatePropertyPage = () => {
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
    } = useCreatePropertyVM();

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-7" />
                </Button>
                <h1 className="text-2xl font-semibold">Tạo bất động sản mới</h1>
            </div>
            <div className="flex flex-wrap gap-8">
                <Card className="max-w-2xl p-4 rounded-[24px] flex-1">
                    <CardContent>
                        <Form {...form}>
                            <div className="flex flex-col gap-4">
                                <FormInput<PropertyRequest>
                                    title="Tên bất động sản"
                                    placeholder="Nhập tên bất động sản"
                                    name="title"
                                />
                                <FormSelect<PropertyRequest>
                                    title="Mục đích"
                                    name="purpose"
                                    options={Object.keys(PropertyRequestPurpose).map((key) => ({
                                        key: key,
                                        render:
                                            PropertyRequestPurpose[
                                            key as keyof typeof PropertyRequestPurpose
                                            ],
                                    }))}
                                />
                                <FormInput<PropertyRequest>
                                    title="Giá"
                                    placeholder="Nhập giá"
                                    type="number"
                                    name="price"
                                />
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
                                    title="Tỉnh/Thành phố"
                                    name="provinceId"
                                    keyType="number"
                                    options={
                                        provinces?.data?.content?.map((province) => ({
                                            key: "" + province.id,
                                            render: province.name,
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
                                            render: ward.name,
                                        })) || []
                                    }
                                />
                                <FormInput<PropertyRequest>
                                    title="Địa chỉ"
                                    placeholder="Nhập địa chỉ"
                                    name="lineAddress"
                                />
                                <FormInput<PropertyRequest>
                                    title="Diện tích đất (m²)"
                                    placeholder="Nhập diện tích đất"
                                    type="number"
                                    name="landArea"
                                />
                                <FormInput<PropertyRequest>
                                    title="Diện tích sàn (m²)"
                                    placeholder="Nhập diện tích sàn"
                                    type="number"
                                    name="floorArea"
                                />
                                <FormInput<PropertyRequest>
                                    title="Chiều rộng đường vào (m)"
                                    placeholder="Nhập chiều rộng đường vào"
                                    type="number"
                                    name="entranceRoadWidth"
                                />
                                <FormInput<PropertyRequest>
                                    title="Số tầng"
                                    placeholder="Nhập số tầng"
                                    type="number"
                                    name="floors"
                                />
                                <FormInput<PropertyRequest>
                                    title="Tầng hiện tại"
                                    placeholder="Nhập tầng hiện tại"
                                    type="number"
                                    name="floorNumber"
                                />
                                <FormInput<PropertyRequest>
                                    title="Số phòng ngủ"
                                    placeholder="Nhập số phòng ngủ"
                                    type="number"
                                    name="bedrooms"
                                />
                                <FormInput<PropertyRequest>
                                    title="Số phòng tắm"
                                    placeholder="Nhập số phòng tắm"
                                    type="number"
                                    name="bathrooms"
                                />
                                <FormSelect<PropertyRequest>
                                    title="Hướng"
                                    options={[
                                        { key: "NORTH", render: "Bắc" },
                                        { key: "SOUTH", render: "Nam" },
                                        { key: "EAST", render: "Đông" },
                                        { key: "WEST", render: "Tây" },
                                        { key: "NORTHEAST", render: "Đông Bắc" },
                                        { key: "NORTHWEST", render: "Tây Bắc" },
                                        { key: "SOUTHEAST", render: "Đông Nam" },
                                        { key: "SOUTHWEST", render: "Tây Nam" },
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
                                        { key: "NORTHEAST", render: "Đông Bắc" },
                                        { key: "NORTHWEST", render: "Tây Bắc" },
                                        { key: "SOUTHEAST", render: "Đông Nam" },
                                        { key: "SOUTHWEST", render: "Tây Nam" },
                                    ]}
                                    name="balconyDirection"
                                />
                                <FormInput<PropertyRequest>
                                    title="Nội thất"
                                    placeholder="Mô tả nội thất"
                                    name="interior"
                                />
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
                                <FormSelect<PropertyRequest>
                                    title="Trạng thái"
                                    name="status"
                                    options={Object.keys(PropertyRequestStatus).map((key) => ({
                                        key: key,
                                        render:
                                            PropertyRequestStatus[
                                            key as keyof typeof PropertyRequestStatus
                                            ],
                                    }))}
                                />
                            </div>
                            <div className="mt-4 flex justify-end items-center">
                                <Button
                                    onClick={() =>
                                        form.handleSubmit(onSubmit, (errors) => {
                                            console.log(errors);
                                        })()
                                    }
                                    className="h-14 bg-blue-500 rounded-xl text-lg hover:bg-blue-600"
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
                <div className="max-w-4xl flex-1 flex flex-col gap-8">
                    <Card className="p-4 rounded-[24px] h-1/2">
                        {/* Tiêu đề */}
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Tải lên hình ảnh mô tả bất động sản
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Chọn một ảnh làm thumbnail và các ảnh còn lại cho gallery.
                            </p>
                        </div>

                        {/* Khu vực Upload */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                                Ảnh Thumbnail
                            </h2>
                            {thumbnail ? (
                                <div className="relative flex justify-center items-center">
                                    {thumbnail.preview && (
                                        <SpiralLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10" />
                                    )}
                                    <div className="relative inline-block">
                                        <XIcon
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full z-20 text-white cursor-pointer"
                                            onClick={() => handleRemoveThumbnail()}
                                        />
                                        <ImageZoom>
                                            <img
                                                className={
                                                    "h-80 w-80 object-cover mx-auto rounded-lg cursor-pointer border-2 border-violet-300 shadow-lg " +
                                                    (thumbnail.preview ? " opacity-50" : "")
                                                }
                                                src={thumbnail.preview || thumbnail.result?.secureUrl}
                                            />
                                        </ImageZoom>
                                    </div>
                                </div>
                            ) : (
                                <Upload
                                    onUpload={(files) => handleThumbnailChange(files[0])}
                                    isSingle={true}
                                />
                            )}
                        </div>

                        <div className="w-full overflow-y-auto">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Gallery
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {gallery.length > 0 &&
                                    gallery.map((imageSrc, index) => (
                                        <div key={index} className="aspect-square size-50">
                                            <div className="relative flex justify-center items-center">
                                                {imageSrc.preview && (
                                                    <SpiralLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10" />
                                                )}
                                                <div className="relative inline-block h-50">
                                                    <XIcon
                                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full z-20 text-white cursor-pointer"
                                                        onClick={() => handleRemoveGallery(index)}
                                                    />
                                                    <ImageZoom>
                                                        <img
                                                            className={
                                                                "object-cover mx-auto rounded-lg cursor-pointer border-2 border-violet-300 shadow-lg size-49" +
                                                                (imageSrc.preview ? " opacity-50" : "")
                                                            }
                                                            src={
                                                                imageSrc.preview || imageSrc.result?.secureUrl
                                                            }
                                                        />
                                                    </ImageZoom>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                <Upload
                                    isMinimal
                                    onUpload={(files) => handleGalleryChange(files[0])}
                                    isSingle={true}
                                />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4 rounded-[24px] h-1/2">
                        <CardContent className="h-full">
                            <Form {...form}>
                                <FormEditor<PropertyRequest>
                                    name="description"
                                    title="Mô tả"
                                    className="h-full"
                                />
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
