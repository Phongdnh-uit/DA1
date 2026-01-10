import { motion } from "framer-motion";
import { Home, ArrowLeft, LifeBuoy, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";

export function NotFoundPage() {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigate({ to: "/" });
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] relative">
            {/* Background Decor - Tối ưu hiệu ứng Blur */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col space-y-8"
                >
                    <div className="space-y-4">
                        <motion.div whileHover={{ scale: 1.05 }} className="w-fit">
                            <Badge
                                variant="outline"
                                className="px-4 py-1.5 border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex gap-2 items-center"
                            >
                                <AlertCircle className="size-4" />
                                <span className="font-bold tracking-wider uppercase text-xs">
                                    Trang không tồn tại
                                </span>
                            </Badge>
                        </motion.div>

                        <div className="relative">
                            <h1 className="text-8xl md:text-[12rem] font-black text-slate-200 dark:text-slate-800/50 leading-none select-none tracking-tighter">
                                404
                            </h1>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="absolute top-1/2 left-0 -translate-y-1/2"
                            >
                                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Bạn đang bị <br />
                                    <span className="text-primary inline-flex items-center gap-3">
                                        mất kết nối?
                                        <Sparkles className="text-yellow-400 size-8 md:size-12 animate-pulse" />
                                    </span>
                                </h2>
                            </motion.div>
                        </div>

                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                            Địa chỉ bạn truy cập có thể đã bị thay đổi hoặc không còn tồn tại.
                            Đừng lo lắng, chúng tôi sẽ giúp bạn tìm đường về nhà.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                            onClick={() => navigate({ to: "/" })}
                        >
                            <Home className="mr-2 size-5" />
                            Về trang chủ
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-8 h-14 text-base font-bold border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            onClick={handleBack}
                        >
                            <ArrowLeft className="mr-2 size-5" />
                            Quay lại
                        </Button>
                    </div>

                    <div className="flex items-center gap-6 pt-4 text-slate-400 dark:text-slate-600">
                        <span className="text-sm font-medium uppercase tracking-widest">
                            Hỗ trợ nhanh:
                        </span>
                        <div className="flex gap-4">
                            <LifeBuoy className="hover:text-primary cursor-pointer transition-colors size-5" />
                        </div>
                    </div>
                </motion.div>

                {/* Right Content - Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-slate-800 aspect-square">
                        <img
                            src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop"
                            alt="Not Found"
                            className="object-cover w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                    </div>

                    {/* Floating Card UI */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-[240px]"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <LifeBuoy className="size-5" />
                            </div>
                            <span className="font-bold text-sm dark:text-white">
                                Cần trợ giúp?
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                            Đội ngũ hỗ trợ Bất Động Sản Việt luôn sẵn sàng 24/7.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
