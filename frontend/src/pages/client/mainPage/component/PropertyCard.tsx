import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Image as ImageIcon, MapPin } from "lucide-react";
import { MediaResponsePurpose, type PropertyResponse } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency } from "@/utils/converter";
import { motion } from "motion/react";
import { formatDate } from "@/utils/formatDate";
import { useCreateWish } from "@/services/wish/wish";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface PropertyCardProps {
    data: PropertyResponse;
    isFavorite?: boolean;
}

const MotionCard = motion.create(Card);

const PropertyCard = ({ data, isFavorite }: PropertyCardProps) => {
    const navigate = useNavigate();

    const [isFavorited, setIsFavorited] = useState(false);

    const createWishMutation = useCreateWish({
        mutation: {
            onSuccess: () => {
                toast.success("Đã thêm vào danh sách yêu thích");
                setIsFavorited(true);
            },
        },
    });

    const onFavoriteClick = () => {
        if (data.id) {
            createWishMutation.mutate({
                data: {
                    identifier: data.id,
                    type: "PROPERTY",
                },
            });
        }
    };

    useEffect(() => {
        if (isFavorite) {
            setIsFavorited(isFavorite);
        }
    }, [isFavorite]);

    if (!data) return null;
    return (
        <MotionCard
            whileHover={{
                translateY: -5,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
            transition={{ type: "spring", stiffness: 200 }}
            className="overflow-hidden shadow-md hover:shadow-2xl rounded-xl bg-white flex flex-col md:flex-row group cursor-pointer p-0"
            onClick={() => navigate({ to: `/detail/${data.id}` })}
        >
            {/* PHẦN HÌNH ẢNH */}
            <div className="relative w-full md:w-1/3 h-48 md:h-auto md:max-h-56 overflow-hidden flex-shrink-0">
                <img
                    src={
                        data.medias?.find(
                            (m) => m.purpose === MediaResponsePurpose.THUMBNAIL,
                        )?.secureUrl || "/placeholder-image.png"
                    }
                    alt={data.title || "Property Image"}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400/cccccc/ffffff?text=Image+Error";
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                <Badge
                    variant="secondary"
                    className="absolute bottom-3 left-3 bg-black/20 text-white flex items-center gap-1.5 backdrop-blur-lg"
                >
                    <ImageIcon className="h-4 w-4" /> {data.medias?.length || 0}
                </Badge>

                {!isFavorited && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 text-white bg-black/30 hover:bg-white/30 hover:text-red-500 rounded-full transition-colors"
                        aria-label="Add to favorites"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteClick();
                        }}
                    >
                        <Heart className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* PHẦN NỘI DUNG */}
            <div className="p-5 flex flex-col flex-grow">
                <h2
                    className="text-lg md:text-xl font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors mb-1"
                    title={data.title}
                >
                    {data.title}
                </h2>

                <p className="text-gray-600 flex items-center gap-1.5 text-lg mb-4">
                    <MapPin className="size-6 text-gray-500 flex-shrink-0" />
                    <span>
                        {data.ward?.name}, {data.ward?.province?.name}
                    </span>
                </p>

                <p className="text-2xl font-bold text-blue-700 mb-2">
                    {formatCurrency(data.price as number)}
                </p>

                <div className="flex-grow" />

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                    <span>{formatDate(new Date(data.updatedAt ?? ""), true)}</span>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: `/detail/${data.id}` });
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </MotionCard>
    );
};

export default PropertyCard;
