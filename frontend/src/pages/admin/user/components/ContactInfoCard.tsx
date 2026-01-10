import type { UserResponse } from "@/types";
import { motion } from "motion/react";
import { Mail, Smartphone, ShieldCheck, ShieldAlert } from "lucide-react";

interface ContactInfoCardProps {
    user: UserResponse;
}

export function ContactInfoCard({ user }: ContactInfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/50">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Thông tin liên hệ
                </h3>
            </div>

            <div className="p-6 grid gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Email</p>
                            <p className="text-base font-semibold text-foreground">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    {user.emailVerified ? (
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-800"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Đã xác thực</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium border border-amber-100 dark:border-amber-800"
                        >
                            <ShieldAlert className="h-4 w-4" />
                            <span>Chưa xác thực</span>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primary">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Số điện thoại
                            </p>
                            <p className="text-base font-semibold text-foreground">
                                {user.phone || "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>
                    {user.phoneVerified ? (
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-800"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Đã xác thực</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium border border-amber-100 dark:border-amber-800"
                        >
                            <ShieldAlert className="h-4 w-4" />
                            <span>Chưa xác thực</span>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
