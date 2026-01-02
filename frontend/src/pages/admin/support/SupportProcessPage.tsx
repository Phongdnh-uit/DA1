import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight } from "lucide-react";
import { SenderInfoCard } from "./components/SenderInfo";
import { ReportContentCard } from "./components/ReportContentCard";
import { ActionForm } from "./components/ActionForm";
import { Route } from "@/routes/admin/support/process.$id";

export function SupportProcessPage() {
    const { supportDetail } = Route.useLoaderData();
    const reportData = supportDetail.data;
    return (
        <div className="flex-1 p-6 md:p-8 overflow-auto">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                                Xử lý báo cáo # {reportData?.id}
                            </h1>
                            <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-800 border-yellow-300 font-bold"
                            >
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {reportData?.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-base">
                            Quản lý và xử lý các báo cáo từ người dùng một cách hiệu quả.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <SenderInfoCard
                            reporter={{
                                email: reportData?.userEmail || "",
                                name: reportData?.userName || "",
                            }}
                            reportDate={reportData?.createdAt || ""}
                        // reportedItem={reportData.reportedItem}
                        />
                        <ReportContentCard
                            reportType={reportData?.type || ""}
                            severity={reportData?.severity || ""}
                            content={reportData?.description || ""}
                            attachments={reportData?.attachments}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <ActionForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
