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
import PermissionGate from "@/components/general/PermissionGate";
import { PermissionDetailSheet } from "./DetailPermissionSheet";

const keys: (keyof PermissionResponse)[] = [
    "id",
    "name",
    "method",
    "code",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const PermissionManage = () => {
    const [viewDetailPermission, setViewDetailPermission] =
        useState<PermissionResponse | null>(null);
    const [openedPermissionDetail, setOpenedPermissionDetail] =
        useState<boolean>(false);
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
                    header: "Phương thức",
                    cell: ({ row }) => {
                        const method = row.original.method as string;

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
                {
                    key: "id",
                    header: "Mã quyền",
                },
                {
                    key: "name",
                    header: "Tên quyền",
                },
                {
                    key: "code",
                    header: "Mã quyền hệ thống",
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
            createActionColumn<PermissionResponse>(
                {
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
                    onView: (permission) => {
                        setViewDetailPermission(permission);
                        setOpenedPermissionDetail(true);
                    },
                },
                {
                    deleteCode: "PERMISSION_DELETE",
                    editCode: "PERMISSION_UPDATE",
                    viewCode: "PERMISSION_VIEW_DETAIL",
                },
            ),
        ],
        [deletePermission, navigate, openDeleteDialog],
    );
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
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
            toast.info("Vui lòng chọn ít nhất một mục để xoá");
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
            <div className="flex items-center justify-end p-2">
                <PermissionGate permission="PERMISSION_CREATE">
                    <RippleButton
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                        onClick={() => navigate({ to: "/admin/permission/create" })}
                    >
                        <IconSparkles className="size-5" /> Thêm mới
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã quyền" },
                    { key: "name", label: "Tên quyền" },
                    { key: "code", label: "Mã quyền hệ thống" },
                    { key: "resource", label: "Tài nguyên" },
                    { key: "method", label: "Phương thức" },
                    { key: "urlPattern", label: "Đường dẫn API" },

                    { key: "createdBy", label: "Người tạo (ID)" },
                    { key: "updatedBy", label: "Người cập nhật (ID)" },

                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã quyền", type: "number" },
                    { name: "name", label: "Tên quyền", type: "text" },
                    { name: "code", label: "Mã quyền hệ thống", type: "text" },
                    { name: "resource", label: "Tài nguyên", type: "text" },
                    { name: "urlPattern", label: "Đường dẫn API", type: "text" },
                    { name: "method", label: "Phương thức", type: "text" },

                    { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật (ID)", type: "number" },

                    { name: "createdAt", label: "Ngày tạo", type: "date" },
                    { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                ]}
                searchField={["name", "code"]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="PERMISSION_DELETE_BULK"
                className="h-[500px]"
                name="Quyền hạn"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <PermissionDetailSheet
                open={openedPermissionDetail}
                onOpenChange={setOpenedPermissionDetail}
                permission={viewDetailPermission}
            />
        </div>
    );
};
