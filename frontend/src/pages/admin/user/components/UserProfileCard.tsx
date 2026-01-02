import { motion } from "framer-motion";
import { Badge } from "lucide-react";
import { UserResponseStatus, type UserResponse } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface UserProfileCardProps {
    user: UserResponse;
}

const statusConfig = {
    [UserResponseStatus.ACTIVE]: {
        label: "Active",
        className:
            "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
    },
    [UserResponseStatus.INACTIVE]: {
        label: "Inactive",
        className:
            "bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800",
    },
    [UserResponseStatus.BLOCKED]: {
        label: "Suspended",
        className:
            "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
    },
    [UserResponseStatus.UNVERIFIED]: {
        label: "Pending",
        className:
            "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    },
};

export function UserProfileCard({ user }: UserProfileCardProps) {
    const statusInfo = statusConfig[user.status as UserResponseStatus];
    const isOnline = user.status === UserResponseStatus.ACTIVE;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col items-center text-center"
        >
            <div className="relative mb-4">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="h-32 w-32 rounded-full ring-4 ring-slate-50 dark:ring-slate-800 shadow-md overflow-hidden bg-muted"
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar.url}
                            alt={`Avatar of ${user.fullName}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </motion.div>
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.3,
                        delay: 0.3,
                        type: "spring",
                        stiffness: 500,
                    }}
                    className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-2 border-white dark:border-card ${isOnline ? "bg-green-500" : "bg-slate-400"
                        }`}
                />
            </div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-foreground text-2xl font-bold leading-tight tracking-tight mb-1"
            >
                {user.fullName}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-muted-foreground text-sm mb-4"
            >
                ID:{" "}
                <span className="font-mono bg-muted px-1 rounded select-all">
                    {user.id}
                </span>
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 flex-wrap justify-center mb-6"
            >
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                    <Badge className="h-4 w-4" />
                    Vai trò #{user.roleId}
                </span>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${statusInfo.className}`}
                >
                    {statusInfo.label}
                </span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full border-t border-border pt-6 flex flex-col gap-4"
            >
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Ngày tham gia</span>
                    <span className="font-medium text-foreground">
                        {formatDate(new Date(user.createdAt as string))}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Cập nhật lần cuối</span>
                    <span className="font-medium text-foreground">
                        {formatDate(new Date(user.updatedAt as string))}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}
