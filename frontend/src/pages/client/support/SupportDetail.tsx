import { FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/__client/support/detail.$id";
import {
    supportTypeConverter,
} from "@/utils/converter";
import { formatDate } from "@/utils/formatDate";
import { useFileDownload } from "@/hooks/useFileHook";
import { Badge } from "@/components/ui/badge";
import type { SupportResponseSeverity, SupportResponseStatus } from "@/types";

const getStatusBadge = (status: SupportResponseStatus) => {
    switch (status) {
        case "OPEN":
            return (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-base">
                    Đang chờ xử lý
                </Badge>
            );
        case "RESOLVED":
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-base">
                    Đã giải quyết
                </Badge>
            );
        case "CLOSED":
            return (
                <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 text-base">
                    Đã đóng
                </Badge>
            );
    }
};

const getSeverityBadge = (severity: SupportResponseSeverity) => {
    switch (severity) {
        case "LOW":
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-base">
                    Thấp
                </Badge>
            );
        case "MEDIUM":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 text-base">
                    Trung bình
                </Badge>
            );
        case "HIGH":
            return (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-base">
                    Cao
                </Badge>
            );
        case "URGENT":
            return (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-base">
                    Khẩn cấp
                </Badge>
            );
    }
};

export const SupportDetail = () => {
    const { supportDetail } = Route.useLoaderData();
    const navigate = useNavigate();
    const { download } = useFileDownload();
    return (
        <main className="flex-1 px-4 md:px-10 py-6 max-w-[1440px] mx-auto w-full">
            <div className="flex flex-wrap gap-2 pb-4">
                <button className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-[#137fec] hover:underline">
                    Trang chủ
                </button>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">
                    /
                </span>
                <button className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-[#137fec] hover:underline">
                    Phản ánh
                </button>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">
                    /
                </span>
                <span className="text-sm font-medium leading-normal">
                    Chi tiết phản ánh {supportDetail.data?.id}
                </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                        Chi Tiết Phản Ánh
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">
                        Mã hồ sơ: {supportDetail.data?.id}
                    </p>
                </div>
            </div>

            <div className="w-full max-w-4xl mx-auto">
                <Card className="border border-gray-200 dark:border-[#2a3b4d] shadow-sm">
                    <CardContent className="p-6 md:p-8">
                        <div className="mb-8">
                            <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                Tiêu đề
                            </label>
                            <div className="text-xl md:text-2xl font-bold">
                                {supportDetail.data?.title}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                    Loại
                                </label>
                                <div className="font-medium text-base">
                                    {supportTypeConverter(supportDetail.data?.type as string)}
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                    Mức độ
                                </label>
                                <div className="text-red-600 font-bold text-base">
                                    {getSeverityBadge(
                                        supportDetail.data?.severity as SupportResponseSeverity,
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                Trạng thái
                            </label>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(
                                    supportDetail.data?.status as SupportResponseStatus,
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                Nội dung phản ánh
                            </label>
                            <div className="text-sm md:text-base leading-relaxed bg-gray-50 dark:bg-[#25323d] p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p>{supportDetail.data?.description}</p>
                            </div>
                        </div>

                        {supportDetail.data?.attachments &&
                            supportDetail.data?.attachments.length > 0 ? (
                            <div className="mb-8">
                                <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                    Hình ảnh đính kèm
                                </label>
                                <div className="flex flex-col gap-3">
                                    {supportDetail.data?.attachments?.map((attachment) => (
                                        <div
                                            onClick={() => download(attachment.objectName as string)}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#25323d] border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2a3642] transition-colors cursor-pointer justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-[#137fec] flex-shrink-0" />
                                                <span className="font-medium text-sm">
                                                    {attachment.originalName}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {supportDetail.data?.reply && (
                            <div className="mb-8">
                                <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                    Phản hồi từ hệ thống
                                </label>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm md:text-base leading-relaxed">
                                        {supportDetail.data?.reply}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-[#2a3b4d] mb-8">
                            <div>
                                <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                    Ngày gửi
                                </label>
                                <div className="font-medium text-base">
                                    {formatDate(
                                        new Date(supportDetail.data?.createdAt as string),
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">
                                    Ngày xử lý
                                </label>
                                <div className="font-medium text-base">
                                    {formatDate(
                                        new Date(supportDetail.data?.updatedAt as string),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate({ to: "/support/history" })}
                                className="gap-2 w-full sm:w-auto"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                QUAY LẠI
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};
