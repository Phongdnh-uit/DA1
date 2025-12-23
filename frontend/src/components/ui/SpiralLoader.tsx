import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const SpiralLoader = ({ className }: { className: string }) => {
    const dots = 8;
    const radius = 20;

    return (
        <div className={cn("relative h-16 w-16", className)}>
            {[...Array(dots)].map((_, index) => {
                const angle = (index / dots) * (2 * Math.PI);
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                    <motion.div
                        key={index}
                        className="absolute h-3 w-3 rounded-full bg-red-500"
                        style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: (index / dots) * 1.5,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}
        </div>
    );
};

export function BounceLoader() {
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 [animation-delay:-0.13s]"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-red-500"></div>
        </div>
    );
}

export default SpiralLoader;
