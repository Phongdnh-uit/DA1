"use client";

import { motion } from "framer-motion";
import {
    Heart,
    HouseIcon,
    PackageIcon,
    Share2,
    TriangleAlert,
} from "lucide-react";
import { fadeInUp } from "@/lib/animation";

// Import Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "./component/ImageGallery";
import { ProductSpecs } from "./component/PropertySpec";
import { IconRoad } from "@tabler/icons-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Mock Data
const productData = {
    images: [
        {
            largeUrl:
                "https://file4.batdongsan.com.vn/resize/1275x717/2025/10/14/20251014210133-38fa_wm.jpg",
            thumbnailUrl:
                "https://file4.batdongsan.com.vn/resize/200x200/2025/10/14/20251014210133-38fa_wm.jpg",
            alt: "Ảnh 1",
        },
        {
            largeUrl:
                "https://file4.batdongsan.com.vn/resize/1275x717/2025/10/14/20251014205410-b650_wm.jpg",
            thumbnailUrl:
                "https://file4.batdongsan.com.vn/resize/200x200/2025/10/14/20251014205410-b650_wm.jpg",
            alt: "Ảnh 2",
        },
        {
            largeUrl:
                "https://file4.batdongsan.com.vn/resize/1275x717/2025/10/14/20251014205847-1fdb_wm.jpg",
            thumbnailUrl:
                "https://file4.batdongsan.com.vn/resize/200x200/2025/10/14/20251014205847-1fdb_wm.jpg",
            alt: "Ảnh 3",
        },
        {
            largeUrl:
                "https://file4.batdongsan.com.vn/resize/1275x717/2025/10/14/20251014205848-b2bb_wm.jpg",
            thumbnailUrl:
                "https://file4.batdongsan.com.vn/resize/200x200/2025/10/14/20251014205848-b2bb_wm.jpg",
            alt: "Ảnh 4",
        },
        {
            largeUrl:
                "https://file4.batdongsan.com.vn/resize/1275x717/2025/10/15/20251015084114-3770_wm.jpg",
            thumbnailUrl:
                "https://file4.batdongsan.com.vn/resize/200x200/2025/10/15/20251015084114-3770_wm.jpg",
            alt: "Ảnh 5",
        },
    ],
    title: "Đất ngộp cần bán thích hợp đầu tư",
    address: "Đường 12, Xã Nha Bích, Chơn Thành, Bình Phước",
    price: "450 triệu",
    pricePerSqm: "1,8 triệu",
    area: "250 m²",
    description:
        "Cần tiền làm ăn nên bán gấp miếng đất nằm ngay mặt tiền đường nhựa 16m. Dân cư xung quanh sầm uất đất đã có sẵn thổ cư, sổ hồng sẵn thích hợp đầu tư. Diện tích 250m² gần hồ khu du lịch nghỉ dưỡng. Thiện chí gọi trực tiếp xem đất.",
};

export default function PropertyDetailPage() {
    return (
        <motion.div
            className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-6 gap-2"
            variants={fadeInUp.container}
            initial="hidden"
            animate="show"
        >
            {/* Left Column */}
            <motion.div
                className="flex flex-col gap-6 col-start-2 col-span-4"
                variants={fadeInUp.item}
            >
                <ImageGallery images={productData.images} />

                <Separator />

                {/* Product Info Header */}
                <div>
                    <motion.h1
                        variants={fadeInUp.item}
                        initial="hidden"
                        whileInView="show"
                        className="text-3xl font-bold leading-tight"
                    >
                        {productData.title}
                    </motion.h1>
                    <p className="text-muted-foreground mt-1">{productData.address}</p>
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
                                        {productData.price}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        ~{productData.pricePerSqm}/m²
                                    </p>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-12" />
                            <div>
                                <p className="text-sm text-muted-foreground">Diện tích</p>
                                <p className="text-2xl font-bold">{productData.area}</p>
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
                    <ProductSpecs
                        specs={[
                            {
                                icon: HouseIcon,
                                title: "Loại BĐS",
                                value: "Đất nền",
                            },
                            {
                                icon: IconRoad,
                                title: "Đường rộng",
                                value: "16 m",
                            },
                            {
                                icon: IconRoad,
                                title: "Mặt tiền",
                                value: "5 m",
                            },
                            {
                                icon: PackageIcon,
                                title: "Pháp lý",
                                value: "Sổ hồng riêng",
                            },
                        ]}
                    />
                </motion.div>

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
                            <p className="text-muted-foreground whitespace-pre-line">
                                {productData.description}
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
