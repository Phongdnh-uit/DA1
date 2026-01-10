import { motion, AnimatePresence } from "framer-motion";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    User,
    FileText,
    ShieldCheck,
    Hash,
    GitBranch,
    Clock,
    Lock,
} from "lucide-react";
import type { RoleResponse } from "@/types";
import { getMethodColor } from "@/utils/colorUtil";
import { useFindAllPermission } from "@/services/permission/permission";
import { formatDate } from "@/utils/formatDate";

interface RoleDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: RoleResponse | null;
}

const DetailRow = ({
    icon: Icon,
    label,
    value,
    delay = 0,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | number;
    delay?: number;
}) => {
    if (!value) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
        >
            <div className="mt-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
                <p className=" font-medium text-muted-foreground">{label}</p>
                <p className=" text-foreground break-all">{value}</p>
            </div>
        </motion.div>
    );
};

export function RoleDetailSheet({
    open,
    onOpenChange,
    role,
}: RoleDetailSheetProps) {
    const permissions = useFindAllPermission(
        {
            all: true,
            filter: "roles.id==" + role?.id,
        },
        {
            query: {
                enabled: !!role?.id,
            },
        },
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {role && (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pr-2"
                        >
                            <SheetHeader className="mb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SheetTitle className="text-2xl flex items-center gap-2">
                                        <ShieldCheck className="h-6 w-6" />
                                        {role.name || "Chi tiết vai trò"}
                                    </SheetTitle>
                                    <SheetDescription>
                                        Xem thông tin chi tiết về vai trò này
                                    </SheetDescription>
                                </motion.div>
                            </SheetHeader>

                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Card className="p-4 bg-muted/50">
                                        <h3 className=" font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Thông tin cơ bản
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={Hash}
                                                label="ID"
                                                value={role.id}
                                                delay={0.15}
                                            />
                                            <DetailRow
                                                icon={ShieldCheck}
                                                label="Tên vai trò"
                                                value={role.name}
                                                delay={0.2}
                                            />
                                            <DetailRow
                                                icon={FileText}
                                                label="Mô tả"
                                                value={role.description}
                                                delay={0.25}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <Card className="p-4 bg-muted/50">
                                        <h3 className=" font-semibold mb-3 flex items-center gap-2">
                                            <GitBranch className="h-4 w-4" />
                                            Phiên bản & Theo dõi
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={GitBranch}
                                                label="Phiên bản"
                                                value={role.version}
                                                delay={0.35}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người tạo"
                                                value={role.createdBy || "Hệ thống"}
                                                delay={0.4}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người cập nhật"
                                                value={role.updatedBy || "Hệ thống"}
                                                delay={0.45}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                    <Card className="p-4 bg-muted/50">
                                        <h3 className=" font-semibold mb-3 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Thời gian
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày tạo"
                                                value={formatDate(new Date(role.createdAt as string))}
                                                delay={0.55}
                                            />
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày cập nhật"
                                                value={formatDate(new Date(role.updatedAt as string))}
                                                delay={0.6}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                {permissions.data?.data?.content &&
                                    permissions.data?.data?.content?.length > 0 && (
                                        <>
                                            <Separator />

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.65 }}
                                            >
                                                <Card className="p-4 bg-muted/50">
                                                    <h3 className=" font-semibold mb-3 flex items-center gap-2">
                                                        <Lock className="h-4 w-4" />
                                                        Danh sách quyền (
                                                        {permissions.data.data.content.length})
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {permissions.data.data.content.map(
                                                            (permission, index) => (
                                                                <motion.div
                                                                    key={permission.id}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        delay: 0.7 + index * 0.05,
                                                                    }}
                                                                    className="p-3 rounded-lg border bg-background hover:bg-accent/30 transition-colors"
                                                                >
                                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                                        <div className="flex-1">
                                                                            <p className=" font-semibold text-foreground mb-1">
                                                                                {permission.name}
                                                                            </p>
                                                                            {permission.code && (
                                                                                <p className="text-xs font-mono text-muted-foreground">
                                                                                    {permission.code}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {permission.method && (
                                                                            <Badge
                                                                                className={`text-xs ${getMethodColor(permission.method)}`}
                                                                                variant="outline"
                                                                            >
                                                                                {permission.method}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {permission.resource && (
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <span className="text-xs text-muted-foreground">
                                                                                Tài nguyên:
                                                                            </span>
                                                                            <span className="text-xs font-medium">
                                                                                {permission.resource}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {permission.urlPattern && (
                                                                        <div className="mt-1">
                                                                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                                                                                {permission.urlPattern}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            ),
                                                        )}
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        </>
                                    )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    );
}
