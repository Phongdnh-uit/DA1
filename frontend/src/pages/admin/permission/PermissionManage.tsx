import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkPermission,
    useDeletePermissionById,
    useFindAllPermission,
} from "@/services/permission/permission";
import type { PermissionResponse } from "@/types";
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
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";

const keys: (keyof PermissionResponse)[] = [
    "id",
    "name",
    "resource",
    "method",
    "urlPattern",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const PermissionManage = () => {
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const deletePermission = useDeletePermissionById({
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
            createSelectionColumn<PermissionResponse>(),
            ...createColumnsFromType<PermissionResponse>(keys, [
                {
                    key: "method",
                    cell: ({ row }) => {
                        const method = row.original.method;

                        const colorMap: Record<string, string> = {
                            GET: "bg-green-100 text-green-800 hover:bg-green-200",
                            POST: "bg-blue-100 text-blue-800 hover:bg-blue-200",
                            PUT: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                            DELETE: "bg-red-100 text-red-800 hover:bg-red-200",
                            PATCH: "bg-purple-100 text-purple-800 hover:bg-purple-200",
                        };

                        const badgeClass =
                            colorMap[method] ?? "bg-gray-100 text-gray-800 hover:bg-gray-200";

                        return <Badge className={badgeClass}>{method}</Badge>;
                    },
                },
            ]),
            createActionColumn<PermissionResponse>({
                onEdit: (permission) => {
                    navigate({ to: `/admin/permission/update/${permission.id}` });
                },
                onDelete: (row) => {
                    openDeleteDialog({
                        onConfirm() {
                            if (!row.id) return;
                            deletePermission.mutate({ id: row.id });
                        },
                    });
                },
            }),
        ],
        [deletePermission, navigate, openDeleteDialog],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllPermission({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<PermissionResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkPermission({
        mutation: {
            onSuccess: () => {
                toast.success("Delete successfully");
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
            toast.info("Please choose one row to delete");
            return;
        }
        openDeleteDialog({
            onConfirm() {
                bulkDeleteMutation.mutate({
                    params: {
                        ids,
                    },
                });
            },
        });
    };

    const onApplyFilter = (sort: string[], filter: string) => {
        setFilterParam({ sort, filter });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <RippleButton
                    className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    onClick={() => navigate({ to: "/admin/permission/create" })}
                >
                    <IconSparkles className="size-5" /> Thêm mới
                </RippleButton>
            </div>
            <Filter
                sortAttributes={[
                    { key: "name", label: "Name" },
                    { key: "resource", label: "Resource" },
                    { key: "action", label: "Action" },
                    { key: "createdAt", label: "Created At" },
                    { key: "updatedAt", label: "Updated At" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Id", type: "number" },
                    { name: "name", label: "Name", type: "text" },
                    { name: "resource", label: "Resource", type: "text" },
                    { name: "action", label: "Action", type: "text" },
                    { name: "createdAt", label: "Created At", type: "date" },
                    { name: "updatedAt", label: "Updated At", type: "date" },
                ]}
                onApply={onApplyFilter}
            />
            <DataTable
                className="h-[550px]"
                name="Quyền hạn"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
        </div>
    );
};
