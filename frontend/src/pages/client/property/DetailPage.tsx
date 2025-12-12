"use client";

import { motion } from "framer-motion";
import { generateHTML } from "@tiptap/react";
import {
    BathIcon,
    BedDoubleIcon,
    Building2Icon,
    DoorOpenIcon,
    Heart,
    HouseIcon,
    Share2,
    SofaIcon,
    TriangleAlert,
    TriangleIcon,
} from "lucide-react";
import { fadeInUp } from "@/lib/animation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageGallery, type Image } from "./component/ImageGallery";
import { ProductSpecs, type SpecItemProps } from "./component/PropertySpec";
import {
    IconDirections,
    IconElevator,
    IconRoad,
    IconStairs,
    IconTransferIn,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    useFindPropertyById,
    useFindSimilarProperties,
} from "@/services/property/property";
import { Route } from "@/routes/__client/detail.$id";
import { extensions } from "@/components/tiptap/rich-text-editor";
import { directionConverter, formatCurrency } from "@/utils/converter";
import ConsultationCard from "./component/ConsultationCard";
import PropertyCard from "../mainPage/component/PropertyCard";
import LocationView from "@/components/general/LocationView";

export default function PropertyDetailPage() {
    const { id } = Route.useParams();
    const product = useFindPropertyById(+id);
    const productData = product.data?.data;
    const similarProperties = useFindSimilarProperties(+id);
    const getAddress = () => {
        let address = "";
        if (productData?.lineAddress) {
            address += productData.lineAddress + ", ";
        }
        address += productData?.ward?.name + ", ";
        address += productData?.ward?.province?.name;
        return address;
    };
    const getPricePerSquareMeter = () => {
        if (productData?.price && productData?.landArea) {
            return formatCurrency(productData.price / productData.landArea);
        }
    };
    const getProductSpec = () => {
        const productSpec: SpecItemProps[] = [];
        if (productData?.type?.name) {
            productSpec.push({
                icon: HouseIcon,
                title: "Loại BĐS",
                value: productData.type.name,
            });
        }
        if (productData?.floors) {
            productSpec.push({
                icon: IconStairs,
                title: "Số tầng",
                value: productData.floors.toString() + " tầng",
            });
        }
        if (productData?.floorNumber) {
            productSpec.push({
                icon: DoorOpenIcon,
                title: "Tầng thứ",
                value: productData.floorNumber.toString(),
            });
        }
        if (productData?.bedrooms) {
            productSpec.push({
                icon: BedDoubleIcon,
                title: "Phòng ngủ",
                value: productData.bedrooms.toString() + " phòng",
            });
        }
        if (productData?.bathrooms) {
            productSpec.push({
                icon: BathIcon,
                title: "Phòng tắm",
                value: productData.bathrooms.toString() + " phòng",
            });
        }
        if (productData?.interior) {
            productSpec.push({
                icon: SofaIcon,
                title: "Nội thất",
                value: productData.interior,
            });
        }
        if (productData?.entranceRoadWidth) {
            productSpec.push({
                icon: IconRoad,
                title: "Đường vào",
                value: productData.entranceRoadWidth + " m",
            });
        }
        if (productData?.direction) {
            productSpec.push({
                icon: IconDirections,
                title: "Hướng nhà",
                value: directionConverter(productData.direction),
            });
        }
        if (productData?.balconyDirection) {
            productSpec.push({
                icon: Building2Icon,
                title: "Hướng ban công",
                value: directionConverter(productData.balconyDirection),
            });
        }
        if (productData?.hasMezzanine) {
            productSpec.push({
                icon: TriangleIcon,
                title: "Gác lửng",
                value: "Có gác lửng",
            });
        }
        if (productData?.hasBasement) {
            productSpec.push({
                icon: IconTransferIn,
                title: "Hầm",
                value: "Có hầm",
            });
        }
        if (productData?.hasElevator) {
            productSpec.push({
                icon: IconElevator,
                title: "Thang máy",
                value: "Có thang máy",
            });
        }
        return productSpec;
    };
    const descriptionHTML = generateHTML(
        productData?.description
            ? JSON.parse(productData.description)
            : { type: "doc", content: [] },
        extensions,
    );

    return (
        <motion.div
            className="h-full container mx-auto py-8 grid grid-cols-1 md:grid-cols-6 gap-2"
            variants={fadeInUp.container}
            initial="hidden"
            animate="show"
        >
            {/* Left Column */}
            <motion.div
                className="flex flex-col gap-6 col-start-2 col-span-4"
                variants={fadeInUp.item}
            >
                <Card className="p-6 md:p-8">
                    <ImageGallery
                        images={
                            productData?.medias?.map(
                                (media) =>
                                    ({
                                        alt: productData.title || "Property Image",
                                        largeUrl: media.secureUrl,
                                        thumbnailUrl: media.secureUrl,
                                    }) as Image,
                            ) || []
                        }
                    />
                </Card>

                <Separator />

                {/* Product Info Header */}
                <div>
                    <motion.h1
                        variants={fadeInUp.item}
                        initial="hidden"
                        whileInView="show"
                        className="text-3xl font-bold leading-tight"
                    >
                        {productData?.title}
                    </motion.h1>
                    <p className="text-muted-foreground mt-1">{getAddress()}</p>
                </div>

                <Card>
                    <CardContent>
                        <motion.div
                            variants={fadeInUp.item}
                            initial="hidden"
                            whileInView="show"
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-baseline gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Khoảng giá</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(productData?.price as number)}
                                    </p>
                                    {productData?.landArea && (
                                        <p className="text-sm text-muted-foreground">
                                            ~{getPricePerSquareMeter()}
                                            /m²
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-12" />
                            <div>
                                <p className="text-sm text-muted-foreground">Diện tích</p>
                                <p className="text-2xl font-bold">
                                    {productData?.landArea + " m²"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button variant="ghost" size="icon">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button variant="ghost" size="icon">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button variant="ghost" size="icon">
                                        <TriangleAlert className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
                <motion.div
                    variants={fadeInUp.item}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                >
                    <ProductSpecs specs={getProductSpec()} />
                </motion.div>

                {/* Map */}
                {productData?.location?.latitude && productData?.location?.longitude ? (
                    <div className="w-full">
                        <LocationView
                            locations={[
                                {
                                    latitude: productData.location.latitude,
                                    longitude: productData.location.longitude,
                                },
                            ]}
                        />
                    </div>
                ) : null}

                {/* Description Section */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold">Thông tin mô tả</h2>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            variants={fadeInUp.item}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.25 }}
                        >
                            <div
                                className="prose prose-neutral dark:prose-invert text-muted-foreground whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                            />
                        </motion.div>
                    </CardContent>
                </Card>
                {/* Similar Properties Section */}
                {similarProperties.data?.data?.length &&
                    similarProperties.data?.data?.length > 0 ? (
                    <motion.div
                        variants={fadeInUp.item}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">
                            Bất động sản tương tự
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {similarProperties.data?.data.map((property) => (
                                <PropertyCard key={property.id} data={property} isMini />
                            ))}
                        </div>
                    </motion.div>
                ) : null}
            </motion.div>
            {/* Right Column */}
            <motion.div className="ml-6">
                <ConsultationCard
                    className="sticky top-20"
                    propertyId={productData?.id}
                />
            </motion.div>
        </motion.div>
    );
}
