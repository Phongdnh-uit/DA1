import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, FolderOpen, Clock, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createColumnsFromType } from "@/utils/createColumn";
import type { AdminSupportResponse, AdminSupportResponseStatus } from "@/types";
import { useDatatable } from "@/hooks/useDatatable";
import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import { useNavigate } from "@tanstack/react-router";
import { fadeInUp } from "@/lib/animation";
import {
    useGetAdminSupportTickets,
    useGetSupportTicketStatsByStatus,
} from "@/services/support/support";

const statusConfig = {
    OPEN: {
        label: "Mở",
        className:
            "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    CLOSED: {
        label: "Đóng",
        className:
            "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    },
    RESOLVED: {
        label: "Đã xong",
        className:
            "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
} as Record<AdminSupportResponseStatus, { label: string; className: string }>;

const keys: (keyof AdminSupportResponse)[] = [
    "id",
    "type",
    "title",
    "status",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const SupportManage = () => {
    const navigate = useNavigate();
    const columns = useMemo(
        () => [
            ...createColumnsFromType<AdminSupportResponse>(keys, [
                {
                    key: "id",
                    header: "Mã yêu cầu",
                },
                {
                    key: "type",
                    header: "Loại yêu cầu",
                },
                {
                    key: "title",
                    header: "Tiêu đề yêu cầu",
                },
                {
                    key: "status",
                    header: "Trạng thái",
                    cell: (info) => {
                        const status = info.getValue() as AdminSupportResponseStatus;
                        const config = statusConfig[status];
                        return (
                            <Badge
                                variant="secondary"
                                className={`${config.className} border-0 px-3 py-1`}
                            >
                                {config.label}
                            </Badge>
                        );
                    },
                },
                {
                    key: "createdAt",
                    header: "Ngày tạo",
                },
                {
                    key: "updatedAt",
                    header: "Ngày cập nhật",
                },
                {
                    key: "createdBy",
                    header: "Người tạo (ID)",
                },
                {
                    key: "updatedBy",
                    header: "Người cập nhật (ID)",
                },
            ]),
            {
                key: "actions",
                header: "Hành động",
                cell: ({ row }) => {
                    return (
                        <Button
                            onClick={() =>
                                navigate({
                                    to: `/admin/support/process/${row.original.id}`,
                                })
                            }
                            variant="ghost"
                            size="icon"
                        >
                            <Eye className="size-5 text-blue-500" />
                        </Button>
                    );
                },
            },
        ],
        [navigate],
    );

    const statistic = useGetSupportTicketStatsByStatus();

    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const list = useGetAdminSupportTickets({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<AdminSupportResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const onApplyFilter = (sort: string[], filter: string) => {
        setFilterParam({ sort, filter });
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap justify-between gap-4 mb-8"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            Quản lý Khiếu Nại & Yêu Cầu
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Theo dõi, phân loại và xử lý các yêu cầu hỗ trợ từ người dùng.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeInUp.container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                >
                    <motion.div variants={fadeInUp.item} className="">
                        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Chưa giải quyết
                                    </p>
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {statistic.data?.data?.numberOfOpenTickets || 0}
                                    </p>

                                    <Badge
                                        variant="secondary"
                                        className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0"
                                    >
                                        Còn lại
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp.item}>
                        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Đã giải quyết
                                    </p>
                                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                        <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {statistic.data?.data?.numberOfResolvedTickets || 0}
                                    </p>

                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0"
                                    >
                                        Đã giải quyết
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp.item}>
                        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Đã đóng
                                    </p>
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {statistic.data?.data?.numberOfClosedTickets || 0}
                                    </p>
                                    <Badge
                                        variant="secondary"
                                        className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-0"
                                    >
                                        Đã đóng
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                <motion.div
                    variants={fadeInUp.container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={fadeInUp.item}>
                        <Filter
                            sortAttributes={[
                                { key: "id", label: "Mã báo cáo" },
                                { key: "title", label: "Tiêu đề yêu cầu" },
                                { key: "type", label: "Loại yêu cầu" },
                                { key: "status", label: "Trạng thái" },
                                { key: "createdBy", label: "Người tạo (ID)" },
                                { key: "updatedBy", label: "Người cập nhật (ID)" },

                                { key: "createdAt", label: "Ngày tạo" },
                                { key: "updatedAt", label: "Ngày cập nhật" },
                            ]}
                            filterAttributes={[
                                { name: "id", label: "Mã quyền", type: "number" },
                                { name: "title", label: "Tiêu đề yêu cầu", type: "text" },
                                { name: "type", label: "Loại yêu cầu", type: "text" },
                                { name: "status", label: "Trạng thái", type: "text" },
                                { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                                {
                                    name: "updatedBy",
                                    label: "Người cập nhật (ID)",
                                    type: "number",
                                },
                                { name: "createdAt", label: "Ngày tạo", type: "date" },
                                { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                            ]}
                            searchField={["name", "code"]}
                            onApply={onApplyFilter}
                        />
                    </motion.div>
                    <motion.div variants={fadeInUp.item} className="mt-6">
                        <DataTable
                            className="h-[500px]"
                            name="Yêu cầu hỗ trợ"
                            table={table}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                            totalPages={list.data?.data?.totalPages || 0}
                            totalElements={list.data?.data?.totalElements || 0}
                            numberOfElements={list.data?.data?.numberOfElements || 0}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
