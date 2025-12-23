import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const MotionButton = motion(Button);

export const SupportButton = () => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate({ to: "/support" });
    };
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <MotionButton
                    onClick={onClick}
                    type="button"
                    aria-label="Hỗ trợ tư vấn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-40 right-6 z-50 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-400 focus-visible:ring-2 transition-none size-14"
                >
                    <AlertCircle className="size-8" />
                </MotionButton>
            </TooltipTrigger>
            <TooltipContent side={"left"}>Hỗ trợ</TooltipContent>
        </Tooltip>
    );
};
