import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Image, Eye } from "lucide-react";

interface ReportContentProps {
    reportType: string;
    severity: string;
    content: string;
    attachments: string[];
}

export function ReportContentCard({
    reportType,
    severity,
    content,
    attachments,
}: ReportContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <Card className="flex flex-col h-full">
                <CardHeader className="py-4 px-6 border-b">
                    <h3 className="text-lg font-bold">Nội dung phản ánh</h3>
                </CardHeader>

                <div className="px-6 pt-6 pb-2 flex flex-wrap gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-muted-foreground uppercase font-medium">
                            Loại báo cáo
                        </span>
                        <Badge
                            variant="destructive"
                            className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        >
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            {reportType}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-muted-foreground uppercase font-medium">
                            Mức độ nghiêm trọng
                        </span>
                        <Badge className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            {severity}
                        </Badge>
                    </div>
                </div>

                <CardContent className="px-6 py-4 flex-1">
                    <div className="bg-muted/50 p-4 rounded-lg border">
                        <p className="text-base leading-relaxed">{content}</p>
                    </div>
                </CardContent>

                <div className="px-6 pb-6">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Image className="h-4 w-4 text-muted-foreground" />
                        Hinh anh dinh kem ({attachments.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {attachments.map((attachment, index) => (
                            <motion.div
                                key={index}
                                className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${attachment}")` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                                    <Eye className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
