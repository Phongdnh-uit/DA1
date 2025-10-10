"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagesSlider } from "@/components/ui/images-slider";
import SearchBox from "./SearchBox";

export default function ClientBanner() {
    const slides = [
        {
            id: 1,
            image: "https://picsum.photos/1920/560?random=1",
            title: "Tìm nhà dễ hơn bao giờ hết",
            subtitle: "Hàng ngàn tin rao mỗi ngày, cập nhật liên tục",
        },
        {
            id: 2,
            image: "https://picsum.photos/1920/560?random=2",
            title: "Cho thuê, mua bán, tất cả ở đây",
            subtitle: "Cập nhật giá trị thị trường theo từng khu vực",
        },
        {
            id: 3,
            image: "https://picsum.photos/1920/560?random=3",
            title: "Kết nối người mua và người bán",
            subtitle: "Cộng đồng môi giới uy tín toàn quốc",
        },
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        document.title = "Bất động sản - Trang chủ";

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000); // đổi text mỗi 4s

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative w-full overflow-hidden">
            <ImagesSlider
                className="h-[35rem] md:h-[40rem]"
                images={slides.map((s) => s.image)}
            >
                <div className="z-50 flex flex-col items-center justify-center text-center px-6">
                    {/* <SearchBox/> */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slides[current].id}
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center mt-8"
                        >
                            <h2 className="font-extrabold text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 leading-tight drop-shadow-md">
                                {slides[current].title}
                            </h2>
                            <p className="text-lg md:text-2xl text-neutral-200 mt-4 mb-6 max-w-2xl">
                                {slides[current].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </ImagesSlider>
        </section>
    );
}
