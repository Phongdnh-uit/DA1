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
    MapPin,
    Hash,
    GitBranch,
    Clock,
    FileText,
    Tag,
    Building2,
} from "lucide-react";
import type { WardResponse } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface WardDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ward: WardResponse | null;
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

export function WardDetailSheet({
    open,
    onOpenChange,
    ward,
}: WardDetailSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {ward && (
                        <motion.div
                            key={ward.id}
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
                                        <Building2 className="h-6 w-6" />
                                        {ward.name || "Chi tiết xã/phường"}
                                    </SheetTitle>
                                    <SheetDescription>
                                        Xem thông tin chi tiết về xã/phường này
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
                                                value={ward.id}
                                                delay={0.15}
                                            />
                                            <DetailRow
                                                icon={Building2}
                                                label="Tên"
                                                value={ward.name}
                                                delay={0.2}
                                            />
                                            <DetailRow
                                                icon={Tag}
                                                label="Mã"
                                                value={ward.code}
                                                delay={0.25}
                                            />
                                            {ward.type && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.3 }}
                                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="mt-1">
                                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <p className=" font-medium text-muted-foreground">
                                                            Loại
                                                        </p>
                                                        <div>{ward.type}</div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>

                                {ward.province && (
                                    <>
                                        <Separator />

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.35 }}
                                        >
                                            <Card className="p-4 bg-muted/50">
                                                <h3 className=" font-semibold mb-3 flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Tỉnh/Thành phố
                                                </h3>
                                                <div className="space-y-2">
                                                    <DetailRow
                                                        icon={Hash}
                                                        label="ID"
                                                        value={ward.province.id}
                                                        delay={0.4}
                                                    />
                                                    <DetailRow
                                                        icon={MapPin}
                                                        label="Tên"
                                                        value={ward.province.name}
                                                        delay={0.45}
                                                    />
                                                    <DetailRow
                                                        icon={Tag}
                                                        label="Mã"
                                                        value={ward.province.code}
                                                        delay={0.5}
                                                    />
                                                    {ward.province.type && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.3, delay: 0.55 }}
                                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                                                        >
                                                            <div className="mt-1">
                                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <p className=" font-medium text-muted-foreground">
                                                                    Loại
                                                                </p>
                                                                <div>{ward.province.type}</div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </>
                                )}

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 }}
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
                                                value={ward.version}
                                                delay={0.65}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người tạo"
                                                value={ward.createdBy || "Hệ thống"}
                                                delay={0.7}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người cập nhật"
                                                value={ward.updatedBy || "Hệ thống"}
                                                delay={0.75}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.8 }}
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
                                                value={formatDate(new Date(ward.createdAt as string))}
                                                delay={0.85}
                                            />
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày cập nhật"
                                                value={formatDate(new Date(ward.updatedAt as string))}
                                                delay={0.9}
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
