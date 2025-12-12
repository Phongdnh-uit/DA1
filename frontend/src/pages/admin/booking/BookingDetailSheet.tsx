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
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    User,
    Hash,
    GitBranch,
    Clock,
    FileText,
    CalendarCheck2,
    Mail,
    Phone,
    StickyNote,
    CircleDot,
    Timer,
} from "lucide-react";
import {
    type BookingResponse,
    BookingResponseType,
    BookingResponseStatus,
} from "@/types";
import { format } from "date-fns";
import { formatDate } from "@/utils/formatDate";

interface BookingDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: BookingResponse | null;
}

const DetailRow = ({
    icon: Icon,
    label,
    value,
    delay = 0,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | number | React.ReactNode;
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
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {typeof value === "string" || typeof value === "number" ? (
                    <p className="text-sm text-foreground break-all">{value}</p>
                ) : (
                    value
                )}
            </div>
        </motion.div>
    );
};

const getTypeLabel = (type?: BookingResponseType) => {
    const labels = {
        [BookingResponseType.BUY_ADVICE]: "Tư vấn mua",
        [BookingResponseType.SELL_ADVICE]: "Tư vấn bán",
        [BookingResponseType.LEGAL_ADVICE]: "Tư vấn pháp lý",
        [BookingResponseType.OTHER]: "Khác",
    };
    return type ? labels[type] : undefined;
};

const getTypeColor = (type?: BookingResponseType) => {
    const colors = {
        [BookingResponseType.BUY_ADVICE]:
            "bg-blue-500/10 text-blue-600 border-blue-500/20",
        [BookingResponseType.SELL_ADVICE]:
            "bg-purple-500/10 text-purple-600 border-purple-500/20",
        [BookingResponseType.LEGAL_ADVICE]:
            "bg-orange-500/10 text-orange-600 border-orange-500/20",
        [BookingResponseType.OTHER]:
            "bg-green-500/10 text-green-600 border-green-500/20",
    };
    return type
        ? colors[type] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
        : "bg-gray-500/10 text-gray-600 border-gray-500/20";
};

const getStatusLabel = (status?: BookingResponseStatus) => {
    const labels = {
        [BookingResponseStatus.PENDING]: "Chờ xác nhận",
        [BookingResponseStatus.CONFIRMED]: "Đã xác nhận",
        [BookingResponseStatus.COMPLETED]: "Hoàn thành",
        [BookingResponseStatus.CANCELLED]: "Đã hủy",
    };
    return status ? labels[status] : undefined;
};

const getStatusColor = (status?: BookingResponseStatus) => {
    const colors = {
        [BookingResponseStatus.PENDING]:
            "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        [BookingResponseStatus.CONFIRMED]:
            "bg-blue-500/10 text-blue-600 border-blue-500/20",
        [BookingResponseStatus.COMPLETED]:
            "bg-green-500/10 text-green-600 border-green-500/20",
        [BookingResponseStatus.CANCELLED]:
            "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return status
        ? colors[status] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
        : "bg-gray-500/10 text-gray-600 border-gray-500/20";
};

export function BookingDetailSheet({
    open,
    onOpenChange,
    booking,
}: BookingDetailSheetProps) {
    const formatBookingDate = (dateString?: string) => {
        if (!dateString) return undefined;
        try {
            return format(new Date(dateString), "dd/MM/yyyy");
        } catch {
            return dateString;
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {booking && (
                        <motion.div
                            key={booking.id}
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
                                        <CalendarCheck2 className="h-6 w-6" />
                                        {booking.name || "Chi tiết đặt lịch"}
                                    </SheetTitle>
                                    <SheetDescription>
                                        Xem thông tin chi tiết về lịch hẹn này
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
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Thông tin khách hàng
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={Hash}
                                                label="ID"
                                                value={booking.id}
                                                delay={0.15}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Họ và tên"
                                                value={booking.name}
                                                delay={0.2}
                                            />
                                            <DetailRow
                                                icon={Mail}
                                                label="Email"
                                                value={booking.email}
                                                delay={0.25}
                                            />
                                            <DetailRow
                                                icon={Phone}
                                                label="Số điện thoại"
                                                value={booking.phone}
                                                delay={0.3}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.35 }}
                                >
                                    <Card className="p-4 bg-muted/50">
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <CalendarCheck2 className="h-4 w-4" />
                                            Thông tin lịch hẹn
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={CircleDot}
                                                label="Loại lịch hẹn"
                                                value={
                                                    booking.type ? (
                                                        <Badge className={getTypeColor(booking.type)}>
                                                            {getTypeLabel(booking.type)}
                                                        </Badge>
                                                    ) : undefined
                                                }
                                                delay={0.4}
                                            />
                                            <DetailRow
                                                icon={CircleDot}
                                                label="Trạng thái"
                                                value={
                                                    booking.status ? (
                                                        <Badge className={getStatusColor(booking.status)}>
                                                            {getStatusLabel(booking.status)}
                                                        </Badge>
                                                    ) : undefined
                                                }
                                                delay={0.45}
                                            />
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày hẹn"
                                                value={formatBookingDate(booking.date)}
                                                delay={0.5}
                                            />
                                            <DetailRow
                                                icon={Timer}
                                                label="Giờ hẹn"
                                                value={booking.time}
                                                delay={0.55}
                                            />
                                            <DetailRow
                                                icon={StickyNote}
                                                label="Ghi chú"
                                                value={booking.note}
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
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <GitBranch className="h-4 w-4" />
                                            Phiên bản & Theo dõi
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={GitBranch}
                                                label="Phiên bản"
                                                value={booking.version}
                                                delay={0.7}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người tạo"
                                                value={booking.createdBy || "Hệ thống"}
                                                delay={0.75}
                                            />
                                            <DetailRow
                                                icon={User}
                                                label="Người cập nhật"
                                                value={booking.updatedBy || "Hệ thống"}
                                                delay={0.8}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>

                                <Separator />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.85 }}
                                >
                                    <Card className="p-4 bg-muted/50">
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Thời gian
                                        </h3>
                                        <div className="space-y-2">
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày tạo"
                                                value={formatDate(
                                                    new Date(booking.createdAt as string),
                                                )}
                                                delay={0.9}
                                            />
                                            <DetailRow
                                                icon={Calendar}
                                                label="Ngày cập nhật"
                                                value={formatDate(
                                                    new Date(booking.updatedAt as string),
                                                )}
                                                delay={0.95}
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
