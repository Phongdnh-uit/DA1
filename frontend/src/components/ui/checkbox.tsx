import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { MinusIcon } from "lucide-react";

function Checkbox({
    className,
    splashClassName,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    splashClassName?: string;
}) {
    const [splashes, setSplashes] = React.useState<number[]>([]);

    const handleClick = (checked: boolean) => {
        if (!checked) return;
        setSplashes((prev) => [...prev, Date.now()]);
        setTimeout(() => {
            setSplashes((prev) => prev.slice(1));
        }, 1000);
    };

    return (
        <div className="relative inline-block">
            <CheckboxPrimitive.Root
                data-slot="checkbox"
                className={cn(
                    "peer border-input dark:bg-input/30 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white dark:data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[5px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=indeterminate]:bg-blue-500 dark:data-[state=indeterminate]:bg-blue-500",
                    className,
                )}
                {...props}
                onClick={() => handleClick(!props.checked)}
            >
                <CheckboxPrimitive.Indicator
                    data-slot="checkbox-indicator"
                    className="flex items-center justify-center text-current transition-none"
                >
                    {props.checked === "indeterminate" ? (
                        <MinusIcon className="h-5 w-5 text-white" />
                    ) : (
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1920 1920"
                            className="text-current size-full"
                            fill={"none"}
                            stroke="currentColor"
                            strokeWidth="300"
                            width="100"
                            height="100"
                        >
                            <motion.path
                                d="M92 825 L800 1432"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.1, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M699 1432 L1828 303"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
                            />
                        </motion.svg>
                    )}
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            {splashes.map((id) => (
                <div
                    key={id}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                    {Array.from({ length: 6 }).map((_, i) => {
                        const angle = (i / 6) * Math.PI * 2;

                        return (
                            <motion.div
                                key={i}
                                style={{ rotate: `${angle}rad` }}
                                className="absolute z-50"
                            >
                                <motion.span
                                    className={cn(
                                        "block h-1 w-1 rounded-full bg-current",
                                        splashClassName,
                                    )}
                                    initial={{ x: 0, opacity: 1, scaleX: 1 }}
                                    animate={{
                                        x: 30,
                                        scaleX: [1, 1, 3],
                                        opacity: [1, 0.9, 0],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: "easeInOut",
                                        times: [0, 0.3, 1],
                                    }}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export { Checkbox };
