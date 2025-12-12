"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";

export const ImagesSlider = ({
    images,
    children,
    overlay = true,
    overlayClassName,
    className,
    autoplay = true,
    direction = "up",
}: {
    images: string[];
    children: React.ReactNode;
    overlay?: React.ReactNode;
    overlayClassName?: string;
    className?: string;
    autoplay?: boolean;
    direction?: "up" | "down";
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 === images.length ? 0 : prevIndex + 1,
        );
    }, [images.length]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1,
        );
    }, [images.length]);

    const loadImages = useCallback(() => {
        setLoading(true);
        const loadPromises = images.map(
            (image) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = image;
                    img.onload = () => resolve(image);
                    img.onerror = reject;
                }),
        );

        Promise.all(loadPromises)
            .then((loaded) => {
                setLoadedImages(loaded as string[]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load images", error);
                setLoading(false);
            });
    }, [images]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") handleNext();
            if (event.key === "ArrowLeft") handlePrevious();
        };

        window.addEventListener("keydown", handleKeyDown);

        let interval: NodeJS.Timeout | null = null;
        if (autoplay) {
            interval = setInterval(() => {
                handleNext();
            }, 5000);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (interval) clearInterval(interval);
        };
    }, [autoplay, handleNext, handlePrevious]);

    const slideVariants: Variants = {
        initial: { scale: 0.95, opacity: 0, rotateX: 45 },
        visible: {
            scale: 1,
            rotateX: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1.0] },
        },
        upExit: {
            opacity: 1,
            y: "-150%",
            transition: { duration: 1 },
        },
        downExit: {
            opacity: 1,
            y: "150%",
            transition: { duration: 1 },
        },
    };

    const ready = loadedImages.length === images.length && !loading;

    return (
        <div
            className={cn(
                "overflow-hidden h-full w-full relative flex items-center justify-center",
                className,
            )}
            style={{ perspective: "1000px" }}
        >
            {ready && children}

            {ready && overlay && (
                <div
                    className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
                />
            )}

            {ready && (
                <AnimatePresence mode="sync">
                    <motion.img
                        key={currentIndex}
                        src={loadedImages[currentIndex]}
                        initial="initial"
                        animate="visible"
                        exit={direction === "up" ? "upExit" : "downExit"}
                        variants={slideVariants}
                        className="image h-full w-full absolute inset-0 object-cover object-center"
                    />
                </AnimatePresence>
            )}
        </div>
    );
};
