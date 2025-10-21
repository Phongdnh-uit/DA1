import { useEffect, useMemo, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

export default function Counter({
    value,
    direction = "up",
}: {
    value: number;
    direction?: "up" | "down";
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(direction === "down" ? 0 : value);
        }
    }, [motionValue, isInView, direction, value]);

    const formatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    useEffect(
        () =>
            springValue.on("change", (latest) => {
                if (ref.current) {
                    ref.current.textContent = formatter.format(latest);
                }
            }),
        [formatter, springValue],
    );

    return <span ref={ref} />;
}
