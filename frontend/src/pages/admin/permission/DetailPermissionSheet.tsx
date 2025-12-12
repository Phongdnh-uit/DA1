import { motion, AnimatePresence } from "motion/react";
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
    Code,
    Shield,
    Link,
    Hash,
    GitBranch,
    Clock,
} from "lucide-react";
import { type PermissionResponse } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getMethodColor } from "@/utils/colorUtil";

interface PermissionDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permission: PermissionResponse | null;
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

export function PermissionDetailSheet({
    open,
    onOpenChange,
    permission,
}: PermissionDetailSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {permission && (
                        <motion.div
                            key={permission.id}
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
                                        <Shield className="h-6 w-6" />
                                        {permission.name || "Chi tiết phân quyền"}
                                    </SheetTitle>
                                    <SheetDescription>
                                        Xem thông tin chi tiết về quyền này
                                    </SheetDescription>
                                </motion.div>
                            </SheetHeader>

                            <div className="space-y-6">
                                {permission.method && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        <Badge
                                            className={` px-4 py-1.5 ${getMethodColor(permission.method)}`}
                                            variant="outline"
                                        >
                                            {permission.method}
                                        </Badge>
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <Card className="p-4 bg-muted/50">
                                        <h3 className=" font-semibold mb-3 flex items-center gap-2">
                                            <Code className="h-4 w-4" />
                                            Thông tin cơ bản
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={Hash}
                                                label="ID"
                                                value={permission.id}
                                                delay={0.25}
                                            />
                                            <DetailRow
                                                icon={Code}
                                                label="Mã"
                                                value={permission.code}
                                                delay={0.3}
                                            />
                                            <DetailRow
                                                icon={Shield}
                                                label="Tài nguyên"
                                                value={permission.resource}
                                                delay={0.35}
                                            />
                                            <DetailRow
                                                icon={Link}
                                                label="Mẫu URL"
                                                value={permission.urlPattern}
                                                delay={0.4}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.45 }}
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
                                                value={permission.version}
                                                delay={0.5}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người tạo"
                                                value={permission.createdBy || "Hệ thống"}
                                                delay={0.55}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người cập nhật"
                                                value={permission.updatedBy || "Hệ thống"}
                                                delay={0.6}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.65 }}
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
                                                value={formatDate(
                                                    new Date(permission.createdAt as string),
                                                )}
                                                delay={0.7}
                                            />
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày cập nhật"
                                                value={formatDate(
                                                    new Date(permission.updatedAt as string),
                                                )}
                                                delay={0.75}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    );
}
