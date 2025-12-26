import { motion } from "framer-motion";
import {
    Home,
    ArrowLeft,
    FileQuestion,
    AlertTriangle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useRouter } from "@tanstack/react-router";

export function NotFoundPage() {
    const navigate = useNavigate();
    const { history } = useRouter();
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
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
                    className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
                <motion.div
                    className="flex flex-col items-start space-y-6 order-2 lg:order-1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Badge
                            variant="destructive"
                            className="mb-4 px-4 py-2 font-bold gap-2 bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-2xl"
                        >
                            <div className="size-5">
                                <AlertTriangle className="size-full" />
                            </div>
                            LỖI KẾT NỐI
                        </Badge>
                    </motion.div>

                    <div className="relative">
                        <motion.h1
                            className="text-[140px] sm:text-[200px] font-black text-blue-500/10 dark:text-blue-400/20 leading-none select-none -ml-4"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.8, type: "spring" }}
                        >
                            404
                        </motion.h1>
                        <motion.div
                            className="absolute inset-0 flex flex-col justify-end pb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
                                Oops! Trang này đã{" "}
                                <span className="text-blue-600 dark:text-blue-400 inline-flex items-center gap-2">
                                    "đi lạc"
                                    <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Sparkles className="h-8 w-8" />
                                    </motion.span>
                                </span>{" "}
                                rồi.
                            </h2>
                        </motion.div>
                    </div>

                    <motion.p
                        className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc địa chỉ URL
                        không chính xác. Đừng lo, hãy quay về trang chủ hoặc thử tìm kiếm
                        nội dung khác!
                    </motion.p>

                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div className="flex flex-wrap gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all gap-2 text-base"
                                    onClick={() => navigate({ to: "/" })}
                                >
                                    <Home className="h-5 w-5" />
                                    Về Trang Chủ
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 border-2 font-bold rounded-xl gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-base"
                                    onClick={() => history.back()}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Quay lại
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="order-1 lg:order-2 w-full relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <motion.div
                        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    'url("https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1200")',
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px]"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                        >
                            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border-2 border-white/50 dark:border-gray-700/50">
                                <motion.div
                                    className="flex flex-col items-center text-center space-y-4"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                                >
                                    <motion.div
                                        className="size-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-full flex items-center justify-center shadow-lg"
                                        animate={{
                                            rotate: [0, -10, 10, -10, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <FileQuestion className="h-10 w-10 text-red-600 dark:text-red-400" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            Không tìm thấy trang
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Trang bạn yêu cầu không tồn tại hoặc đã bị di chuyển.
                                        </p>
                                    </div>
                                </motion.div>
                            </Card>
                        </motion.div>

                        <motion.div
                            className="absolute top-6 right-6 bg-white/90 dark:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-gray-900 dark:text-white border-2 border-white/50 shadow-lg"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            Error 404
                        </motion.div>

                        <motion.div
                            className="absolute bottom-6 left-6 flex gap-2"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-2 w-2 bg-white rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center p-1">
                            <motion.div
                                className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                                animate={{ y: [0, 12, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                    </motion.div>
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-medium">
                        Scroll to explore
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
