import { motion, AnimatePresence } from "framer-motion";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    User,
    Hash,
    GitBranch,
    Clock,
    FileText,
    Home,
} from "lucide-react";
import type { PropertyTypeResponse } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface PropertyTypeDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    propertyType: PropertyTypeResponse | null;
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

export function PropertyTypeDetailSheet({
    open,
    onOpenChange,
    propertyType,
}: PropertyTypeDetailSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {propertyType && (
                        <motion.div
                            key={propertyType.id}
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
                                        <Home className="h-6 w-6" />
                                        {propertyType.name || "Chi tiết loại bất động sản"}
                                    </SheetTitle>
                                    <SheetDescription>
                                        Xem thông tin chi tiết về loại bất động sản này
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
                                                value={propertyType.id}
                                                delay={0.15}
                                            />
                                            <DetailRow
                                                icon={Home}
                                                label="Tên loại bất động sản"
                                                value={propertyType.name}
                                                delay={0.2}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.25 }}
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
                                                value={propertyType.version}
                                                delay={0.3}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người tạo"
                                                value={propertyType.createdBy || "Hệ thống"}
                                                delay={0.35}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người cập nhật"
                                                value={propertyType.updatedBy || "Hệ thống"}
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
                                            <Clock className="h-4 w-4" />
                                            Thời gian
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày tạo"
                                                value={formatDate(
                                                    new Date(propertyType.createdAt as string),
                                                )}
                                                delay={0.5}
                                            />
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày cập nhật"
                                                value={formatDate(
                                                    new Date(propertyType.updatedAt as string),
                                                )}
                                                delay={0.55}
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
