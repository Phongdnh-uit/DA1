import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Calendar, Link2 } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface SenderInfoProps {
    reporter: {
        name: string;
        email: string;
    };
    reportDate: string;
    reportedItem: {
        id: string;
        label: string;
    };
}

export function SenderInfoCard({
    reporter,
    reportDate,
    reportedItem,
}: SenderInfoProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
                    <h3 className="text-lg font-bold">Thông tin người báo cáo</h3>
                    <a
                        href="#"
                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        Xem hồ sơ
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                                Người báo cáo
                            </p>
                            <p className="font-semibold text-lg">{reporter.name}</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Email
                        </p>
                        <a
                            href={`mailto:${reporter.email}`}
                            className="text-primary hover:underline font-medium"
                        >
                            {reporter.email}
                        </a>
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Ngày báo cáo
                        </p>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{
                                formatDate(new Date(reportDate),true)
                            }</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Mục được báo cáo
                        </p>
                        <a
                            href="#"
                            className="text-primary hover:underline font-medium flex items-center gap-1"
                        >
                            Không
                            {/* {reportedItem.label} #{reportedItem.id} */}
                            <Link2 className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
