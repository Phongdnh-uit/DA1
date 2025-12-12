import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useInView, useAnimation } from "motion/react";
import {
    Phone,
    Mail,
    MessageCircle,
    Calendar,
    Sparkles,
    ArrowRight,
    CheckCircle,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { useInitializeChat } from "@/services/conversation/conversation";

const features = [
    "Tư vấn miễn phí 100%",
    "Đội ngũ chuyên viên giàu kinh nghiệm",
    "Hỗ trợ 24/7",
];

export function CTASection() {
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
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const controls = useAnimation();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const handleSchedule = () => {
        navigate({
            to: "/booking",
        })
        toast.success("Đang mở form đặt lịch...");
    };

    const handleCall = () => {
        toast.info("Đang kết nối cuộc gọi...");
    };

    const handleEmail = () => {
        toast.info("Đang mở email...");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const handleChatNow = () => {
        chatInitializeMutation.mutate({
            data: {},
        });
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "Gọi cho chúng tôi",
            description: "Trao đổi trực tiếp với chuyên viên",
            buttonText: "(555) 123-4567",
            onClick: handleCall,
            gradient: "from-green-500 to-emerald-600",
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            icon: Mail,
            title: "Gửi email",
            description: "Nhận thông tin chi tiết qua email",
            buttonText: "Gửi Email",
            onClick: handleEmail,
            gradient: "from-blue-500 to-cyan-600",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: MessageCircle,
            title: "Trò chuyện trực tiếp",
            description: "Hỗ trợ tức thì qua chat",
            buttonText: "Bắt đầu trò chuyện",
            onClick: handleChatNow,
            gradient: "from-purple-500 to-pink-600",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];


    return (
        <section
            ref={ref}
            className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700"
        >
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

            <motion.div
                className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="max-w-7xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium text-white">
                            Ưu đãi đặc biệt cho khách hàng mới
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white text-balance">
                        Sẵn sàng cho bước đi tiếp theo?
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto text-pretty">
                        Nhận tư vấn chuyên nghiệp từ đội ngũ cố vấn giàu kinh nghiệm.
                        Đặt lịch tư vấn miễn phí ngay hôm nay.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                            >
                                <CheckCircle className="w-5 h-5 text-green-300" />
                                <span className="text-white font-medium">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                onHoverStart={() => setHoveredCard(index)}
                                onHoverEnd={() => setHoveredCard(null)}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="relative overflow-hidden bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl h-full group">
                                    <motion.div
                                        className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br transition-opacity duration-300",
                                            method.gradient
                                        )}
                                    />

                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className={cn(
                                                "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center",
                                                method.iconBg
                                            )}
                                            animate={{
                                                rotate: hoveredCard === index ? [0, -10, 10, -10, 0] : 0,
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Icon className={cn("w-8 h-8", method.iconColor)} />
                                        </motion.div>
                                        <CardTitle className="text-xl font-bold text-slate-800">
                                            {method.title}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            {method.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={method.onClick}
                                                className={cn(
                                                    "w-full font-semibold text-white shadow-lg bg-gradient-to-r",
                                                    method.gradient
                                                )}
                                            >
                                                {method.buttonText}
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </motion.div>
                                    </CardContent>

                                    <motion.div
                                        className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"
                                        animate={{
                                            scale: hoveredCard === index ? [1, 1.5, 1] : 1,
                                            opacity: hoveredCard === index ? [0.3, 0.6, 0.3] : 0.3,
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="text-center"
                    whileHover={{ scale: 1.02 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <Button
                            onClick={handleSchedule}
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-white/90 text-lg px-10 py-6 shadow-2xl font-bold group relative overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                layoutId="button-bg"
                            />
                            <span className="relative z-10 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Đặt lịch tư vấn miễn phí
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </span>
                        </Button>
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-white/80 text-sm"
                    >
                        Không yêu cầu thông tin thanh toán • Cam kết bảo mật thông tin
                    </motion.p>
                </motion.div>
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
