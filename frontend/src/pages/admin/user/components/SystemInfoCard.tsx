import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { UserResponseStatus, type UserResponse } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface SystemInfoCardProps {
    user: UserResponse;
}

const statusConfig = {
    [UserResponseStatus.ACTIVE]: { label: "Active", color: "bg-green-500" },
    [UserResponseStatus.INACTIVE]: { label: "Inactive", color: "bg-slate-400" },
    [UserResponseStatus.BLOCKED]: { label: "Suspended", color: "bg-red-500" },
    [UserResponseStatus.UNVERIFIED]: { label: "Pending", color: "bg-amber-500" },
};

export function SystemInfoCard({ user }: SystemInfoCardProps) {
    const statusInfo = statusConfig[user.status as UserResponseStatus];
    const infoItems = [
        {
            label: "User Role ID",
            value: `ROLE_${user.roleId}`,
            isStatus: false,
        },
        {
            label: "Account Status",
            value: statusInfo.label,
            isStatus: true,
            statusColor: statusInfo.color,
        },
        {
            label: "Created At",
            value: formatDate(new Date(user.createdAt as string)),
            isStatus: false,
        },
        {
            label: "Updated At",
            value: formatDate(new Date(user.updatedAt as string)),
            isStatus: false,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-border bg-muted/50">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Thông tin hệ thống
                </h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {infoItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex flex-col gap-1"
                        >
                            <label className="text-sm font-medium text-muted-foreground">
                                {item.label}
                            </label>
                            <div className="flex items-center gap-2">
                                {item.isStatus && (
                                    <span
                                        className={`h-2 w-2 rounded-full ${item.statusColor}`}
                                    />
                                )}
                                <span className="text-base font-medium text-foreground">
                                    {item.value}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
