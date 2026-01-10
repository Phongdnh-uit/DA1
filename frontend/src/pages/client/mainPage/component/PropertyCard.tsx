import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Image as ImageIcon, MapPin, ScaleIcon } from "lucide-react";
import { type PropertyResponse } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency, propertyStatusConverter } from "@/utils/converter";
import { motion } from "motion/react";
import { formatDate } from "@/utils/formatDate";
import { useCreateWish } from "@/services/wish/wish";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { usePropertyComparisonStore } from "@/stores/propertyComparisonStore";

interface PropertyCardProps {
    data: PropertyResponse;
    isFavorite?: boolean;
    isMini?: boolean;
}

const PropertyCard = ({ data, isFavorite, isMini }: PropertyCardProps) => {
    const addPropertyToCompare = usePropertyComparisonStore(
        (state) => state.addProperty,
    );
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
    return isMini ? (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 gap-y-1">
                <div className="relative overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={data.thumbnail?.url || "/placeholder-image.png"}
                        alt={data.title}
                        className="w-full h-[240px] object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 shadow-md">
                            {data.type?.name}
                        </Badge>
                        <Badge variant="default" className="shadow-md">
                            {propertyStatusConverter(data.status || "")}
                        </Badge>
                    </div>
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
                <CardContent className="p-5 space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {data.title}
                        </h3>
                        <div className="flex items-center text-md text-muted-foreground gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="line-clamp-1">
                                {data.ward?.name}, {data.ward?.province?.name}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-5 pt-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {formatCurrency(data.price as number)}
                            </p>
                            <p className="text-xs text-muted-foreground">VNĐ</p>
                        </div>
                        {/* <Button */}
                        {/*     onClick={() => addPropertyToCompare(data.id as number)} */}
                        {/*     variant="outline" */}
                        {/*     size="sm" */}
                        {/*     className="group/btn" */}
                        {/* > */}
                        {/*     <span>So sánh</span> */}
                        {/*     <motion.span */}
                        {/*         className="inline-block ml-1" */}
                        {/*         animate={{ x: [0, 3, 0] }} */}
                        {/*         transition={{ repeat: Infinity, duration: 1.5 }} */}
                        {/*     > */}
                        {/*         <ScaleIcon /> */}
                        {/*     </motion.span> */}
                        {/* </Button> */}
                    </div>
                    <Button
                        onClick={() => navigate({ to: `/detail/${data.id}` })}
                        variant="outline"
                        size="sm"
                        className="w-full justify-center h-12 group/btn"
                    >
                        <span>Chi tiết</span>
                        <motion.span
                            className="inline-block ml-1"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            →
                        </motion.span>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    ) : (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card
                className="overflow-hidden shadow-md hover:shadow-2xl rounded-xl flex flex-col md:flex-row group cursor-pointer p-0"
                onClick={() => navigate({ to: `/detail/${data.id}` })}
            >
                <div className="relative w-full md:w-1/3 h-48 md:h-auto md:max-h-56 overflow-hidden flex-shrink-0">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={data.thumbnail?.url || "/placeholder-image.png"}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 shadow-md">
                            {data.type?.name}
                        </Badge>
                        <Badge variant="default" className="shadow-md">
                            {propertyStatusConverter(data.status || "")}
                        </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                    <Badge
                        variant="secondary"
                        className="absolute bottom-3 left-3 bg-black/20 text-white flex items-center gap-1.5 backdrop-blur-lg"
                    >
                        <ImageIcon className="h-4 w-4" /> {data.galleries?.length || 0}
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
                        className="text-lg md:text-xl font-semibold leading-snug group-hover:text-primary transition-colors mb-1"
                        title={data.title}
                    >
                        {data.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 text-lg mb-4">
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
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default PropertyCard;
