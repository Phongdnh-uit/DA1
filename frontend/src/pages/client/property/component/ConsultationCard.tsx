"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { MessageCircle, Phone, Clock, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInitializeChat } from "@/services/conversation/conversation";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";

interface ConsultationCardProps {
    className?: string;
    propertyId?: number;
}

export default function ConsultationCard({ className, propertyId }: ConsultationCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const chatInitializeMutation = useInitializeChat({
        mutation: {
            onSuccess: (data) => {
                toast.success("Xin chờ một chút, đang chuyển bạn đến phòng chat...");
                navigate({
                    to: `/chat/${data.data?.id}`,
                });
            },
        },
    });
    const handleChatNow = () => {
        chatInitializeMutation.mutate({
            data: {
                contextId: propertyId,
            },
        });
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, x: 20 },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.5,
            },
        },
        hover: {
            y: -5,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10,
            },
        },
    } as Variants;

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    } as Variants;

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    } as Variants;

    const buttonVariants = {
        rest: { scale: 1 },
        hover: {
            scale: 1.05,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
        },
        tap: { scale: 0.98 },
    } as Variants;

    return (
        <div className={cn("z-40", className)}>
            <motion.div
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-80"
            >
                <Card className="border-border/50 shadow-lg overflow-hidden backdrop-blur-sm bg-card/95">
                    <motion.div
                        className="h-1 bg-gradient-to-r from-primary via-accent to-primary"
                        animate={{ opacity: isHovered ? 1 : 0.5 }}
                        transition={{ duration: 0.3 }}
                    />

                    <CardHeader className="pb-3">
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                animate={{ rotate: isHovered ? 12 : 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Sparkles className="h-5 w-5 text-primary" />
                            </motion.div>
                            <h2 className="text-lg font-semibold text-foreground leading-tight">
                                Liên hệ tư vấn
                            </h2>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className="text-xs text-muted-foreground mt-1"
                        >
                            Nhận tư vấn chi tiết ngay
                        </motion.p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <motion.p
                            variants={itemVariants}
                            className="text-sm text-muted-foreground leading-relaxed"
                        >
                            Quan tâm đến bất động sản này? Hãy liên hệ với chúng tôi để được
                            tư vấn chi tiết và nhận những ưu đãi đặc biệt.
                        </motion.p>

                        <motion.div
                            variants={{
                                ...itemVariants,
                                ...buttonVariants,
                            }}
                            whileHover="hover"
                            whileTap="tap"
                            initial="rest"
                            animate="rest"
                        >
                            <Button
                                onClick={handleChatNow}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 group"
                            >
                                <motion.div
                                    className="flex items-center justify-center gap-2"
                                    animate={{ x: isHovered ? 4 : 0 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    <span>Chat với tư vấn viên</span>
                                </motion.div>
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            className="pt-3 border-t border-border/50 space-y-3"
                        >
                            <motion.p
                                variants={itemVariants}
                                className="text-xs text-muted-foreground font-medium uppercase tracking-wide"
                            >
                                Thông tin liên hệ
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-2 group cursor-pointer"
                                whileHover={{ x: 4 }}
                            >
                                <motion.div
                                    animate={{ rotate: isHovered ? -5 : 0 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Phone className="h-4 w-4 text-primary group-hover:text-primary/80" />
                                </motion.div>
                                <p className="text-sm font-semibold text-foreground">
                                    +84 123 456 789
                                </p>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-2"
                            >
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    Hỗ trợ 8:00 - 22:00
                                </p>
                            </motion.div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
