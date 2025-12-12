import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import type {
    BookingRequestStatus,
    BookingResponse,
} from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import Filter from "@/components/admin/Filter";
import { toast } from "react-toastify";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import { useNavigate } from "@tanstack/react-router";
import PermissionGate from "@/components/general/PermissionGate";
import {
    useDeleteBookingById,
    useDeleteBulkBooking,
    useFindAllBooking,
} from "@/services/booking/booking";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import React from "react";
import { BookingDetailSheet } from "./BookingDetailSheet";

const keys: (keyof BookingResponse)[] = [
    "id",
    "name",
    "phone",
    "type",
    "status",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

const statusConfig = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertCircle },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle2 },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
};

export const BookingManage = () => {
    const [detailBooking, setDetailBooking] = useState<BookingResponse | null>(null);
    const [openedDetail, setOpenedDetail] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<
        BookingRequestStatus | "all"
    >("all");
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const useDeleteBooking = useDeleteBookingById({
        mutation: {
            onSuccess: () => {
                toast.success("Xoá thành công");
                list.refetch();
            },
            onError: () => {
                toast.error("Xoá thất bại");
            },
        },
    });
    const columns = useMemo(
        () => [
            createSelectionColumn<BookingResponse>(),
            ...createColumnsFromType<BookingResponse>(keys, [
                {
                    key: "status",
                    cell: ({ row }) => {
                        return (
                            <span
                                className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md border ${statusConfig[row.original.status as BookingRequestStatus].color}`}
                            >
                                {React.createElement(statusConfig[row.original.status as BookingRequestStatus].icon, { className: "size-4 mr-1" })}
                                {statusConfig[row.original.status as BookingRequestStatus].label}
                            </span>
                        );
                    }
                }
            ]),
            createActionColumn<BookingResponse>(
                {
                    onEdit: (row) => {
                        navigate({ to: `/admin/booking/update/${row.id}` });
                    },
                    onDelete: (row) => {
                        openDeleteDialog({
                            onConfirm() {
                                if (!row.id) return;
                                useDeleteBooking.mutate({ id: row.id });
                            },
                        });
                    },
                    onView: (row) => {
                        setDetailBooking(row);
                        setOpenedDetail(true);
                    }
                },
                {
                    viewCode: "BOOKING_VIEW_DETAIL",
                    editCode: "BOOKING_UPDATE",
                    deleteCode: "BOOKING_DELETE",
                },
            ),
        ],
        [navigate, openDeleteDialog, useDeleteBooking],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllBooking({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: selectedStatus === "all" ? filterParam.filter : (
            filterParam.filter
                ? `status==${selectedStatus};${filterParam.filter}`
                : `status==${selectedStatus}`
        ) ,
    });
    const { table } = useDatatable<BookingResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkBooking({
        mutation: {
            onSuccess: () => {
                toast.success("Xoá thành công");
                list.refetch();
            },
        },
    });

    const getSelectedRowIds = () => {
        return table
            .getSelectedRowModel()
            .rows.flatMap((r) => (r.original.id ? [r.original.id] : []));
    };

    const onBulkDelete = () => {
        const ids = getSelectedRowIds();
        if (ids.length === 0) {
            toast.info("Vui lòng chọn ít nhất một vai trò để xoá.");
            return;
        }
        openDeleteDialog({
            onConfirm() {
                bulkDeleteMutation.mutate({ params: { ids } });
            },
        });
    };

    const onApplyFilter = (sort: string[], filter: string) => {
        setFilterParam({ sort, filter });
    };

    const StatusButton = ({
        status,
        label,
    }: {
        status: BookingRequestStatus | "all";
        label: string;
    }) => (
        <Button
            variant={selectedStatus === status ? "default" : "outline"}
            onClick={() => setSelectedStatus(status)}
            className={`${selectedStatus === status
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-blue-200 text-blue-700 hover:bg-blue-50"
                }`}
        >
            {label}
        </Button>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end p-2">
                <PermissionGate permission="BOOKING_CREATE">
                    <RippleButton
                        onClick={() => navigate({ to: "/admin/booking/create" })}
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" />
                        Thêm mới
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Tên" },
                    { key: "phone", label: "Tên" },
                    { key: "email", label: "Tên" },
                    { key: "type", label: "Ngày tạo" },
                    { key: "date", label: "Ngày cập nhật" },
                    { key: "time", label: "Ngày cập nhật" },
                    { key: "status", label: "Ngày cập nhật" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Id", type: "number" },
                    { name: "name", label: "Name", type: "text" },
                    { name: "phone", label: "Created By", type: "text" },
                    { name: "email", label: "Updated By", type: "text" },
                    { name: "type", label: "Created At", type: "text" },
                    { name: "date", label: "Updated At", type: "text" },
                    { name: "time", label: "Status", type: "text" },
                    { name: "status", label: "Type", type: "text" },
                ]}
                onApply={onApplyFilter}
                additionalChildren={
                    <div className="flex space-x-2 flex-wrap">
                        <StatusButton status="all" label="Tất cả" />
                        <StatusButton status="PENDING" label="Chờ xác nhận" />
                        <StatusButton status="CONFIRMED" label="Đã xác nhận" />
                        <StatusButton status="COMPLETED" label="Hoàn thành" />
                        <StatusButton status="CANCELLED" label="Đã hủy" />
                    </div>
                }
            />
            {/* Status Filter Buttons */}
            <DataTable
                deleteCode="BOOKING_DELETE_BULK"
                className="h-[500px]"
                name="Vai trò"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <BookingDetailSheet
                onOpenChange={setOpenedDetail}
                open={openedDetail}
                booking={detailBooking}
            />
        </div>
    );
};
