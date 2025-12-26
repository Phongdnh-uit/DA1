import { useState } from "react";
import {
    Home,
    ChevronRight,
    Plus,
    Search,
    HeadphonesIcon,
    AlertCircle,
    Wrench,
    Eye,
    HelpCircle,
    Phone,
    Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SupportRequestType, SupportResponseStatus } from "@/types";
import { formatDate } from "@/utils/formatDate";
import {
    supportStatusConverter,
    supportTypeConverter,
} from "@/utils/converter";
import { useNavigate } from "@tanstack/react-router";
import { useGetClientSupportTickets } from "@/services/support-controller/support-controller";

const getTypeIcon = (type: SupportRequestType) => {
    switch (type) {
        case "TECHNICAL_SUPPORT":
            return <HeadphonesIcon className="h-4 w-4" />;
        case "COMPLAINT":
            return <AlertCircle className="h-4 w-4" />;
        case "BUG_REPORT":
            return <Bug className="h-4 w-4" />;
        case "FEATURE_REQUEST":
            return <Wrench className="h-4 w-4" />;
        default:
            return <HeadphonesIcon className="h-4 w-4" />;
    }
};

const getTypeColor = (type: SupportRequestType) => {
    switch (type) {
        case "TECHNICAL_SUPPORT":
            return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
        case "BUG_REPORT":
            return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
        case "COMPLAINT":
            return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
        case "FEATURE_REQUEST":
            return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        default:
            return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    }
};

const getStatusBadge = (status: SupportResponseStatus) => {
    switch (status) {
        case "OPEN":
            return (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    Đang chờ xử lý
                </Badge>
            );
        case "RESOLVED":
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                    Đã giải quyết
                </Badge>
            );
        case "CLOSED":
            return (
                <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                    Đã đóng
                </Badge>
            );
    }
};

export const SupportHistoryPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const buildQuery = () => {
        if (searchQuery || typeFilter !== "all" || statusFilter !== "all") {
            const queryList = [];
            if (searchQuery) {
                queryList.push(`title=like='${searchQuery}'`);
            }
            if (typeFilter !== "all") {
                queryList.push(`type==${typeFilter}`);
            }
            if (statusFilter !== "all") {
                queryList.push(`status==${statusFilter}`);
            }
            return `${queryList.join(";")}`;
        }
        return "";
    };
    const clientTicket = useGetClientSupportTickets({ filter: buildQuery() });
    const navigate = useNavigate();

    const history = clientTicket.data;

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
            {/* Main Content */}
            <main className="flex-1 flex justify-center py-8 px-4 md:px-10">
                <div className="w-full max-w-[1200px] flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm">
                        <a
                            className="text-gray-600 dark:text-gray-400 font-medium hover:text-[#137fec] transition-colors flex items-center gap-1"
                            href="#"
                        >
                            <Home className="h-4 w-4" />
                            Trang chủ
                        </a>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <a
                            className="text-gray-600 dark:text-gray-400 font-medium hover:text-[#137fec] transition-colors"
                            href="#"
                        >
                            Hỗ trợ
                        </a>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Lịch sử yêu cầu</span>
                    </div>

                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                Lịch Sử Yêu Cầu/Khiếu Nại
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-base">
                                Theo dõi và quản lý các yêu cầu hỗ trợ hoặc khiếu nại của bạn
                                với đội ngũ CSKH.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate({ to: "/support" })}
                            className="bg-[#137fec] hover:bg-blue-600 gap-2 h-11 shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Tạo yêu cầu mới</span>
                        </Button>
                    </div>

                    {/* Filter & Search Bar */}
                    <Card className="border border-gray-200 dark:border-[#2a3b4d]">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    className="w-full h-11 pl-10 pr-4"
                                    placeholder="Tìm kiếm theo mã yêu cầu hoặc tiêu đề..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[160px] h-11">
                                        <SelectValue placeholder="Tất cả loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả loại</SelectItem>
                                        {Object.values(SupportRequestType).map((type, idx) => (
                                            <SelectItem key={idx} value={type}>
                                                {supportTypeConverter(type)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[160px] h-11">
                                        <SelectValue placeholder="Tất cả trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        {Object.values(SupportResponseStatus).map((status, idx) => (
                                            <SelectItem key={idx} value={status}>
                                                {supportStatusConverter(status)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card className="border border-gray-200 dark:border-[#2a3b4d] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-[#f8f9fa] dark:bg-[#212e3b] border-b border-gray-200 dark:border-[#374151]">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Mã yêu cầu
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Loại
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[30%]">
                                            Tiêu đề
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Ngày gửi
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Cập nhật cuối
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-[#374151]">
                                    {history?.data?.content?.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="group hover:bg-[#f8f9fa] dark:hover:bg-[#212e3b] transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a
                                                    className="text-[#137fec] font-medium hover:underline"
                                                    href="#"
                                                >
                                                    {request.id}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`size-8 rounded-full flex items-center justify-center ${getTypeColor(
                                                            request.type as SupportRequestType,
                                                        )}`}
                                                    >
                                                        {getTypeIcon(request.type as SupportRequestType)}
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {supportTypeConverter(
                                                            request.type as SupportRequestType,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {request.title}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(new Date(request.createdAt as string))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(new Date(request.updatedAt as string))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(
                                                    request.status as SupportResponseStatus,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-gray-500 hover:text-[#137fec] dark:text-gray-400 dark:hover:text-[#137fec] transition-colors">
                                                    <Eye
                                                        onClick={() =>
                                                            navigate({ to: `/support/detail/${request.id}` })
                                                        }
                                                        className="h-5 w-5"
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#374151] flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Hiển thị{" "}
                                <span className="font-medium text-gray-900 dark:text-white">
                                    1
                                </span>{" "}
                                đến{" "}
                                <span className="font-medium text-gray-900 dark:text-white">
                                    5
                                </span>{" "}
                                trong số{" "}
                                <span className="font-medium text-gray-900 dark:text-white">
                                    12
                                </span>{" "}
                                kết quả
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled>
                                    Trước
                                </Button>
                                <Button variant="outline" size="sm">
                                    Sau
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Help Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Card className="border border-gray-200 dark:border-[#2a3b4d]">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="size-12 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] shrink-0">
                                    <HelpCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Trung tâm trợ giúp</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        Tìm kiếm câu trả lời cho các câu hỏi thường gặp về mua bán,
                                        pháp lý và tài khoản.
                                    </p>
                                    <a
                                        className="text-[#137fec] text-sm font-bold hover:underline"
                                        href="#"
                                    >
                                        Xem câu hỏi thường gặp →
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200 dark:border-[#2a3b4d]">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Liên hệ trực tiếp</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        Cần hỗ trợ gấp? Gọi ngay cho tổng đài chăm sóc khách hàng
                                        của chúng tôi.
                                    </p>
                                    <p className="font-bold text-lg">1900 1234</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};
