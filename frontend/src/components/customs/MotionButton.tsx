import { forwardRef } from "react";
import { motion, type MotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { buttonMotion, type ButtonMotionVariant } from "@/lib/motion.config";
import { Button, buttonVariants } from "../ui/button";
import type { VariantProps } from "class-variance-authority";

type MotionButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    } & MotionProps & {
        motionVariant?: ButtonMotionVariant;
        motionProps?: MotionProps;
    };

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
    (
        { motionVariant = "default", disabled, className, motionProps, ...props },
        ref,
    ) => {
        const motionConfig = buttonMotion[motionVariant];

        return (
            <motion.button
                ref={ref}
                whileHover={!disabled ? motionConfig.whileHover : undefined}
                whileTap={!disabled ? motionConfig.whileTap : undefined}
                transition={motionConfig.transition}
                {...motionProps}
            >
                <Button
                    disabled={disabled}
                    {...props}
                    className={cn("transition-none", className)}
                />
            </motion.button>
        );
    },
);

MotionButton.displayName = "MotionButton";
