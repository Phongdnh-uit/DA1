import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gavel, Lock, Mail, CheckCircle2, X } from "lucide-react";
import {
    useCloseSupportTicket,
    useProcessSupportTicket,
} from "@/services/support-controller/support-controller";
import { toast } from "react-toastify";
import type { ProcessSupportRequest } from "@/types";
import { Route } from "@/routes/admin/support/process.$id";
import { useRef } from "react";

export function ActionForm() {
    const { id } = Route.useParams();

    const dataRef = useRef<ProcessSupportRequest>({});

    const handleChange = (field: keyof ProcessSupportRequest, value: string) => {
        dataRef.current = {
            ...dataRef.current,
            [field]: value,
        };
    };

    const ticketProcess = useProcessSupportTicket({
        mutation: {
            onSuccess: () => {
                toast.success("Xử lý báo cáo thành công");
            },
            onError: () => {
                toast.error("Xử lý báo cáo thất bại, vui lòng thử lại");
            },
        },
    });

    const closeTicket = useCloseSupportTicket();

    const handleProcessReport = () => {
        ticketProcess.mutate({
            id: +id,
            data: { ...dataRef.current },
        });
    };

    const handleCloseReport = () => {
        closeTicket.mutate({ id: +id });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            <Card className="shadow-lg sticky top-6">
                <CardHeader className="px-6 py-4 bg-muted/50 border-b rounded-t-xl">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-primary" />
                        Xử lý vi phạm
                    </h3>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-6">
                    <div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Chi chú nội bộ
                                <span className="text-xs text-muted-foreground font-normal ml-auto italic">
                                    Ẩn với người dùng
                                </span>
                            </Label>
                            <Textarea
                                onChange={(e) => handleChange("note", e.target.value)}
                                className="min-h-[100px] bg-amber-50/50 dark:bg-amber-950/20 resize-y"
                                placeholder="Ghi lại quá trình xử lý vi phạm để làm bằng chứng sau này..."
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                Phản hồi cho người báo cáo
                                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-normal ml-auto">
                                    Tùy chọn
                                </span>
                            </Label>
                            <Textarea
                                onChange={(e) => handleChange("reply", e.target.value)}
                                className="min-h-[120px] resize-y"
                                placeholder="Gửi phản hồi cho người dùng đã báo cáo vi phạm này..."
                            />
                        </div>

                        <div className="border-t my-2" />

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleProcessReport}
                                size="lg"
                                className="w-full gap-2 shadow-md font-bold"
                            >
                                <CheckCircle2 className="h-5 w-5" />
                                Lưu và Đánh dấu đã giải quyết
                            </Button>
                            <Button
                                onClick={handleCloseReport}
                                variant="outline"
                                size="lg"
                                className="w-full gap-2 font-bold hover:text-destructive hover:border-destructive"
                            >
                                <X className="h-5 w-5" />
                                Đóng phản ánh
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
