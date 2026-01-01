import { motion } from "framer-motion";
import { Lock, Home, Headset, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // Giả định bạn đã cài Shadcn UI

const Error403Page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white dark:bg-[#1a2632] p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-center"
            >
                {/* Biểu tượng 403 cách điệu */}
                <div className="relative flex justify-center mb-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, -5, 5, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="p-6 bg-red-50 dark:bg-red-900/20 rounded-full"
                    >
                        <Lock className="w-16 h-16 text-red-500 dark:text-red-400" />
                    </motion.div>
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                        403
                    </div>
                </div>

                {/* Nội dung thông báo */}
                <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-3">
                    Truy cập bị từ chối
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    Rất tiếc, bạn không có quyền xem nội dung này. Khu vực này chỉ dành
                    cho chủ sở hữu hoặc quản trị viên hệ thống.
                </p>

                {/* Nhóm nút hành động */}
                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full h-12 text-md font-semibold gap-2 transition-all hover:scale-[1.02]"
                        onClick={() => (window.location.href = "/")}
                    >
                        <Home className="w-4 h-4" />
                        Về trang chủ
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="h-11 gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <Headset className="w-4 h-4" />
                            Hỗ trợ
                        </Button>
                    </div>
                </div>

                {/* Liên kết phụ */}
                <motion.div
                    className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800"
                    whileHover={{ scale: 1.05 }}
                >
                    <a
                        href="/login"
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        Đăng nhập bằng tài khoản khác
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Error403Page;
