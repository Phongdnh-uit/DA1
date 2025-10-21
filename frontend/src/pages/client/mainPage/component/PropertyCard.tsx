import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, Image as ImageIcon, MapPin } from "lucide-react";
import { MediaResponsePurpose, type PropertyResponse } from "@/types";
import { useNavigate } from "@tanstack/react-router";

interface PropertyCardProps {
    data: PropertyResponse;
}

const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} tỷ`;
    }
    return `${amount.toLocaleString("vi-VN")} VNĐ`;
};

const PropertyCard = ({ data }: PropertyCardProps) => {
    if (!data) return null;

    const truncatedTitle =
        data.title?.length > 70 ? data.title.slice(0, 70) + "..." : data.title;

    const navigate = useNavigate();

    return (
        <Card
            className="w-[370px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl bg-white flex flex-col group"
            onClick={() => navigate({ to: "/detail" })}
        >
            {/* PHẦN HÌNH ẢNH */}
            <div className="relative overflow-hidden">
                <AspectRatio ratio={16 / 10}>
                    <img
                        src={
                            data.medias?.find(
                                (m) => m.purpose === MediaResponsePurpose.THUMBNAIL,
                            )?.secureUrl || "/placeholder-image.png"
                        }
                        alt={data.title || "Property Image"}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                </AspectRatio>

                {/* Overlay mờ dần ở dưới ảnh */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                <Badge
                    variant="secondary"
                    className="absolute bottom-3 left-3 bg-black/60 text-white flex items-center gap-1.5 backdrop-blur-sm"
                >
                    <ImageIcon className="h-4 w-4" /> {data.medias?.length || 0}
                </Badge>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 text-white bg-black/30 hover:bg-white/30 hover:text-red-500 rounded-full transition-colors"
                    aria-label="Add to favorites"
                >
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            {/* PHẦN NỘI DUNG */}
            <div className="p-4 py-2 flex flex-col flex-grow">
                {/* Giá tiền */}

                {/* Tiêu đề */}
                <h2
                    className="text-2xl font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors"
                    title={data.title}
                >
                    {truncatedTitle}
                </h2>
                <p className="text-2xl font-bold text-blue-700 mb-2">
                    {formatCurrency(data.price)}
                </p>

                {/* Địa chỉ */}
                <p className="text-lg text-gray-600 flex items-center gap-1.5 mt-1 mb-4">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>
                        {data.ward?.name}, {data.ward?.province?.name}
                    </span>
                </p>
                <div className="flex-grow" />

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{data.updatedAt}</span>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default PropertyCard;
