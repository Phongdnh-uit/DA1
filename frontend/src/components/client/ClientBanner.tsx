"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagesSlider } from "@/components/ui/images-slider";
import { Route } from "@/routes/__client/index";

export default function ClientBanner() {
    const { carousel } = Route.useLoaderData();

    const slides =
        carousel?.data?.map((item) => ({
            carousel: item,
        })) || [];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        document.title = "Bất động sản - Trang chủ";

        const timer = setInterval(() => {
            setCurrent(
                (prev) => (prev + 1) % (slides.length > 0 ? slides.length : 1),
            );
        }, 4000); // đổi text mỗi 4s

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative w-full overflow-hidden">
            {slides.length === 0 ? (
                <div className="h-[35rem] md:h-[40rem] bg-neutral-200 flex items-center justify-center">
                    <h2 className="text-2xl md:text-4xl text-neutral-500">
                        Không có dữ liệu banner
                    </h2>
                </div>
            ) : (
                <ImagesSlider
                    className="h-[35rem] md:h-[40rem]"
                    images={slides.map((s) => s.carousel.file?.url || "")}
                >
                    <div className="z-50 flex flex-col items-center justify-center text-center px-6">
                        <AnimatePresence mode="sync">
                            <motion.div
                                key={slides[current].carousel.id}
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center mt-8"
                            >
                                <h2 className="font-extrabold text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 leading-tight drop-shadow-md">
                                    {slides[current]?.carousel?.metadata?.caption}
                                </h2>
                                <p className="text-lg md:text-2xl text-neutral-200 mt-4 mb-6 max-w-2xl">
                                    {slides[current]?.carousel?.metadata?.subcaption}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </ImagesSlider>
            )}
        </section>
    );
}
