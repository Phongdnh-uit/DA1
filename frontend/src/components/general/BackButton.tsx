import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { MotionButton } from "../customs/MotionButton";

export function BackButton() {
    const router = useRouter();
    const handleGoBack = () => {
        if (router.history.length > 1) {
            router.history.back();
        } else {
            router.navigate({
                to: "/",
            });
        }
    };
    return (
        <MotionButton
            variant="outline"
            className="flex items-center gap-2 rounded-2xl border-muted-foreground/20 bg-white/70 backdrop-blur-sm hover:bg-muted/50 hover:border-muted-foreground/30 transition-all shadow-sm hover:shadow w-fit mb-4 text-lg transition-none"
            onClick={handleGoBack}
        >
            <motion.div
                animate={{ x: -5 }}
                transition={{ repeat: Infinity, repeatType: "reverse" , duration: 0.8 }}
            >
                <ArrowLeft className="w-8 h-8" />
            </motion.div>
            <span className="font-medium">Quay lại</span>
        </MotionButton>
    );
}
