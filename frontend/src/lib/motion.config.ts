import type { MotionProps } from "motion/react";

export type ButtonMotionConfig = Pick<
    MotionProps,
    "whileHover" | "whileTap" | "transition"
>;

export const buttonMotion = {
    default: {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 24,
        },
    },
    subtle: {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: undefined,
    },
    none: {
        whileHover: undefined,
        whileTap: undefined,
        transition: undefined,
    },
} as const satisfies Record<string, ButtonMotionConfig>;

export type ButtonMotionVariant = keyof typeof buttonMotion;
