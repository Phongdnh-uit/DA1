import type { Variants } from "motion/react";
export const fadeInUp = {
    container: {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
            },
        },
    } as Variants,
    item: {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
            },
        },
    } as Variants,
};

export const drawLineVariants = {
    rest: { width: 0 },
    hover: { width: "100%" },
} as Variants;

export const imageVariants: Variants = {
    hidden: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        transition: { type: "tween", duration: 0.3 },
    }),
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "tween", duration: 0.3 },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        transition: { type: "tween", duration: 0.3 },
    }),
};
