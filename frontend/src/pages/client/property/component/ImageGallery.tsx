"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

export interface Image {
    url: string;
    alt: string;
}

interface ImageGalleryProps {
    images: Image[];
}

const imageVariants = {
    hidden: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 1000 : -1000,
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeInOut",
        },
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -1000 : 1000,
        transition: {
            duration: 0.5,
            ease: "easeInOut",
        },
    }),
} as Variants;

export function ImageGallery({ images }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [expandThumbnails, setExpandThumbnails] = useState(false);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = images.length - 1;
            if (nextIndex >= images.length) nextIndex = 0;
            return nextIndex;
        });
    };

    const handleThumbnailClick = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const showCompressedThumbnails = images.length > 8;

    return (
        <div className="w-full flex flex-col gap-6 p-4 md:p-6">
            {/* Main Image Viewer */}
            <div className="w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                    <AnimatePresence initial={false} custom={direction} mode="sync">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute inset-0"
                        >
                            <ImageZoom>
                                <img
                                    src={images[currentIndex].url || "/placeholder.svg"}
                                    alt={images[currentIndex].alt}
                                    className="h-full w-full object-cover"
                                />
                            </ImageZoom>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <motion.button
                        onClick={() => paginate(-1)}
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(255, 255, 255, 1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/80 shadow-lg backdrop-blur-sm hover:bg-white flex items-center justify-center group cursor-pointer"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-900 group-hover:scale-110 transition-transform" />
                    </motion.button>

                    <motion.button
                        onClick={() => paginate(1)}
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(255, 255, 255, 1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/80 shadow-lg backdrop-blur-sm hover:bg-white flex items-center justify-center group cursor-pointer"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-5 w-5 text-slate-900 group-hover:scale-110 transition-transform" />
                    </motion.button>

                    {/* Counter Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Zoom Indicator */}
                    <div className="absolute top-4 right-4 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-white/20">
                        <ZoomIn className="h-3 w-3" />
                        Click để phóng to
                    </div>
                </div>
            </div>

            {/* Thumbnails Section */}
            <div className="w-full">
                {/* Toggle Button - Show when compressed thumbnails available */}
                {showCompressedThumbnails && (
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {images.length} photos
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandThumbnails(!expandThumbnails)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-8"
                        >
                            {expandThumbnails ? "Collapse" : "View all"}
                        </Button>
                    </div>
                )}

                {/* Thumbnails Container */}
                {expandThumbnails ? (
                    // Expanded Grid
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
                    >
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                onClick={() => {
                                    handleThumbnailClick(index);
                                    setExpandThumbnails(false);
                                }}
                                className="relative cursor-pointer rounded-lg overflow-hidden aspect-square ring-2 ring-transparent hover:ring-blue-400 transition-all"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                                {currentIndex === index && (
                                    <motion.div
                                        className="absolute inset-0 ring-2 ring-blue-500 rounded-lg"
                                        layoutId="active-thumbnail-border"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    // Compact Horizontal Scroll
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                onClick={() => handleThumbnailClick(index)}
                                className="relative cursor-pointer rounded-lg overflow-hidden aspect-square flex-shrink-0 w-20 ring-2 ring-transparent hover:ring-blue-400 transition-all"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                                {currentIndex === index && (
                                    <motion.div
                                        className="absolute inset-0 ring-2 ring-blue-500 rounded-lg"
                                        layoutId="active-thumbnail-border"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
