import { motion } from "framer-motion";
import {
    MapPin,
    Maximize2,
    Bed,
    Bath,
    Calendar,
    TrendingUp,
    DollarSign,
    type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type PropertyResponse } from "@/types/propertyResponse";
import { Route } from "@/routes/__client/compare.$id1.to.$id2";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export const PropertyComparison = () => {
    const { property1, property2 } = Route.useLoaderData();
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getBetterValue = (
        val1: number,
        val2: number,
        higherIsBetter: boolean = true,
    ) => {
        if (higherIsBetter) {
            return val1 > val2 ? "property1" : val2 > val1 ? "property2" : "equal";
        }
        return val1 < val2 ? "property1" : val2 < val1 ? "property2" : "equal";
    };

    const ComparisonRow = ({
        icon: Icon,
        label,
        value1,
        value2,
        unit = "",
        higherIsBetter = true,
    }: {
        icon: LucideIcon;
        label: string;
        value1: string | number;
        value2: string | number;
        unit?: string;
        higherIsBetter?: boolean;
    }) => {
        const numVal1 =
            typeof value1 === "number" ? value1 : parseFloat(String(value1));
        const numVal2 =
            typeof value2 === "number" ? value2 : parseFloat(String(value2));
        const better =
            !isNaN(numVal1) && !isNaN(numVal2)
                ? getBetterValue(numVal1, numVal2, higherIsBetter)
                : "equal";

        return (
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-3"
            >
                <div
                    className={`flex items-center justify-end gap-2 ${better === "property1"
                            ? "text-green-600 font-semibold"
                            : "text-muted-foreground"
                        }`}
                >
                    <span>
                        {value1}
                        {unit}
                    </span>
                    {better === "property1" && <TrendingUp className="w-4 h-4" />}
                </div>

                <div className="flex items-center gap-2 text-sm font-medium px-4">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{label}</span>
                </div>

                <div
                    className={`flex items-center gap-2 ${better === "property2"
                            ? "text-green-600 font-semibold"
                            : "text-muted-foreground"
                        }`}
                >
                    {better === "property2" && <TrendingUp className="w-4 h-4" />}
                    <span>
                        {value2}
                        {unit}
                    </span>
                </div>
            </motion.div>
        );
    };

    const PropertyCard = ({
        property,
        side,
        thumbnailUrl,
    }: {
        property: PropertyResponse;
        side: "left" | "right";
        thumbnailUrl: string;
    }) => (
        <motion.div
            initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="relative"
        >
            <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-colors">
                <div className="relative h-64 overflow-hidden group">
                    <motion.img
                        src={thumbnailUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-2xl font-bold mb-1">
                            {property.title}
                        </h3>
                        <p className="text-white/90 flex items-center gap-1 text-sm">
                            <MapPin className="w-4 h-4" />
                            {property.ward?.name}, {property.ward?.province?.name}
                        </p>
                    </div>
                </div>

                <CardContent className="p-6 space-y-4">
                    <motion.div
                        className="text-3xl font-bold text-primary"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {formatPrice(property.price as number)}
                    </motion.div>

                    {/* <p className="text-sm text-muted-foreground line-clamp-2"> */}
                    {/*     {property.description} */}
                    {/* </p> */}

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Maximize2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{property.landArea} m²</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Bed className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">
                                {property.bedrooms} phòng ngủ
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Bath className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">
                                {property.bathrooms} phòng tắm
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">test</span>
                        </div>
                    </div>

                    <Separator />

                    {/* <div> */}
                    {/*   <h4 className="text-sm font-semibold mb-2">Tiện ích</h4> */}
                    {/*   <div className="flex flex-wrap gap-1"> */}
                    {/*     {property.amenities.slice(0, 4).map((amenity, index) => ( */}
                    {/*       <Badge key={index} variant="secondary" className="text-xs"> */}
                    {/*         {amenity} */}
                    {/*       </Badge> */}
                    {/*     ))} */}
                    {/*     {property.amenities.length > 4 && ( */}
                    {/*       <Badge variant="outline" className="text-xs"> */}
                    {/*         +{property.amenities.length - 4} */}
                    {/*       </Badge> */}
                    {/*     )} */}
                    {/*   </div> */}
                    {/* </div> */}

                    {/* <div className="flex items-center justify-between text-sm"> */}
                    {/*   <div className="flex items-center gap-1"> */}
                    {/*     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> */}
                    {/*     <span className="font-semibold">{property.rating}</span> */}
                    {/*   </div> */}
                    {/*   <div className="flex items-center gap-1 text-muted-foreground"> */}
                    {/*     <Eye className="w-4 h-4" /> */}
                    {/*     <span>{property.views.toLocaleString()} lượt xem</span> */}
                    {/*   </div> */}
                    {/*   </div> */}
                </CardContent>
            </Card>
        </motion.div>
    );

    // const allAmenities = Array.from(new Set([...property1.amenities, ...property2.amenities]));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        So Sánh Bất Động Sản
                    </h1>
                    <p className="text-muted-foreground">
                        Đánh giá chi tiết và so sánh hai lựa chọn của bạn
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <PropertyCard
                        property={property1.data as PropertyResponse}
                        thumbnailUrl={property1.thumbnailUrl.data?.url || ""}
                        side="left"
                    />
                    <PropertyCard
                        property={property2.data as PropertyResponse}
                        thumbnailUrl={property2.thumbnailUrl.data?.url || ""}
                        side="right"
                    />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <DollarSign className="w-6 h-6" />
                                So Sánh Chi Tiết
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <ComparisonRow
                                icon={DollarSign}
                                label="Giá"
                                value1={formatPrice(property1?.data?.price as number)}
                                value2={formatPrice(property2?.data?.price as number)}
                                higherIsBetter={false}
                            />
                            <Separator />
                            <ComparisonRow
                                icon={Maximize2}
                                label="Diện tích"
                                value1={property1?.data?.landArea || 0}
                                value2={property2?.data?.landArea || 0}
                                unit=" m²"
                            />
                            <Separator />
                            <ComparisonRow
                                icon={Bed}
                                label="Phòng ngủ"
                                value1={property1?.data?.bedrooms || 0}
                                value2={property2?.data?.bedrooms || 0}
                            />
                            <Separator />
                            <ComparisonRow
                                icon={Bath}
                                label="Phòng tắm"
                                value1={property1?.data?.bathrooms || 0}
                                value2={property2?.data?.bathrooms || 0}
                            />
                            {/* <ComparisonRow */}
                            {/*   icon={Star} */}
                            {/*   label="Đánh giá" */}
                            {/*   value1={property1.rating} */}
                            {/*   value2={property2.rating} */}
                            {/* /> */}
                            <Separator />
                            {/* <ComparisonRow */}
                            {/*   icon={Eye} */}
                            {/*   label="Lượt xem" */}
                            {/*   value1={property1.views} */}
                            {/*   value2={property2.views} */}
                            {/* /> */}
                        </CardContent>
                    </Card>

                    {/* <Card> */}
                    {/*   <CardHeader> */}
                    {/*     <CardTitle className="text-2xl flex items-center gap-2"> */}
                    {/*       <Check className="w-6 h-6" /> */}
                    {/*       So Sánh Tiện Ích */}
                    {/*     </CardTitle> */}
                    {/*   </CardHeader> */}
                    {/*   <CardContent> */}
                    {/*     <motion.div variants={containerVariants} className="space-y-3"> */}
                    {/*       {allAmenities.map((amenity, index) => { */}
                    {/*         const hasInProperty1 = property1.amenities.includes(amenity); */}
                    {/*         const hasInProperty2 = property2.amenities.includes(amenity); */}
                    {/**/}
                    {/*         return ( */}
                    {/*           <motion.div */}
                    {/*             key={index} */}
                    {/*             variants={itemVariants} */}
                    {/*             className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-2" */}
                    {/*           > */}
                    {/*             <div className="flex justify-end"> */}
                    {/*               {hasInProperty1 ? ( */}
                    {/*                 <Check className="w-5 h-5 text-green-600" /> */}
                    {/*               ) : ( */}
                    {/*                 <X className="w-5 h-5 text-red-400" /> */}
                    {/*               )} */}
                    {/*             </div> */}
                    {/**/}
                    {/*             <Badge variant="outline" className="whitespace-nowrap"> */}
                    {/*               {amenity} */}
                    {/*             </Badge> */}
                    {/**/}
                    {/*             <div className="flex justify-start"> */}
                    {/*               {hasInProperty2 ? ( */}
                    {/*                 <Check className="w-5 h-5 text-green-600" /> */}
                    {/*               ) : ( */}
                    {/*                 <X className="w-5 h-5 text-red-400" /> */}
                    {/*               )} */}
                    {/*             </div> */}
                    {/*           </motion.div> */}
                    {/*         ); */}
                    {/*       })} */}
                    {/*     </motion.div> */}
                    {/*   </CardContent> */}
                    {/* </Card> */}
                </motion.div>
            </motion.div>
        </div>
    );
};
