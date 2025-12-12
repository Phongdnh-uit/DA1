import PropertyCard from "./PropertyCard";
import { useFindAllProperty } from "@/services/property/property";
import { useFindAllWish } from "@/services/wish/wish";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles } from "lucide-react";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export const PropertyList = () => {
    const listProperty = useFindAllProperty({
        size: 8,
    });
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const listWish = useFindAllWish(
        {
            filter:
                "type=='PROPERTY';identifier=in=(" +
                listProperty.data?.data?.content?.map((item) => item.id).join(",") +
                ")",
        },
        {
            query: {
                enabled: isAuthenticated && !!listProperty.data?.data?.content?.length,
            },
        },
    );

    const favoriteMap = listWish.data?.data?.content?.reduce(
        (acc, wish) => {
            if (!wish.identifier) return acc;
            acc[wish.identifier] = true;
            return acc;
        },
        {} as Record<string, boolean>,
    );

    const isLoading = listProperty.isLoading;
    const properties = listProperty.data?.data?.content || [];

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
            <div className="max-w-[85rem] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Badge
                        variant="secondary"
                        className="mb-4 px-4 py-1.5 text-sm font-medium"
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Được tuyển chọn đặc biệt
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent p-1">
                            Bất động sản nổi bật
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                        Khám phá danh sách các dự án và căn hộ tiềm năng nhất được chúng tôi
                        tuyển chọn kỹ lưỡng dành cho bạn.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[...Array(8)].map((_, idx) => (
                            <div key={idx} className="space-y-3">
                                <Skeleton className="h-[240px] w-full rounded-xl" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                        >
                            {properties.map((property) => (
                                <motion.div key={property.id} variants={item}>
                                    <PropertyCard
                                        isMini
                                        data={property}
                                        isFavorite={!!favoriteMap?.[property.id as number]}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex justify-center"
                        >
                            <Link to="/properties">
                                <Button size="lg" className="group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Xem tất cả bất động sản
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Button>
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
};
