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
