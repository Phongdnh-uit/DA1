import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import type { RoleResponse } from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import Filter from "@/components/admin/Filter";
import { toast } from "react-toastify";
import {
    useDeleteBulkRole,
    useDeleteRoleById,
    useFindAllRole,
} from "@/services/role/role";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import { useNavigate } from "@tanstack/react-router";
import PermissionGate from "@/components/general/PermissionGate";
import { RoleDetailSheet } from "./DetailRoleSheet";

const keys: (keyof RoleResponse)[] = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const RoleManage = () => {
    const [detailRole, setDetailRole] = useState<RoleResponse | null>(null);
    const [openedDetail, setOpenedDetail] = useState<boolean>(false);
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const useDeleteRole = useDeleteRoleById({
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
            createSelectionColumn<RoleResponse>(),
            ...createColumnsFromType<RoleResponse>(keys, [
                {
                    key: "id",
                    header: "Mã vai trò",
                },
                {
                    key: "name",
                    header: "Tên vai trò",
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
            createActionColumn<RoleResponse>(
                {
                    onEdit: (row) => {
                        navigate({ to: `/admin/role/update/${row.id}` });
                    },
                    onDelete: (row) => {
                        openDeleteDialog({
                            onConfirm() {
                                if (!row.id) return;
                                useDeleteRole.mutate({ id: row.id });
                            },
                        });
                    },
                    onView: (row) => {
                        setDetailRole(row);
                        setOpenedDetail(true);
                    },
                },
                {
                    viewCode: "ROLE_VIEW_DETAIL",
                    editCode: "ROLE_UPDATE",
                    deleteCode: "ROLE_DELETE",
                },
            ),
        ],
        [navigate, openDeleteDialog, useDeleteRole],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllRole({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<RoleResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkRole({
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end p-2">
                <PermissionGate permission="ROLE_CREATE">
                    <RippleButton
                        onClick={() => navigate({ to: "/admin/role/create" })}
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" />
                        Thêm mới
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã vai trò" },
                    { key: "name", label: "Tên vai trò" },
                    { key: "createdBy", label: "Người tạo (ID)" },
                    { key: "updatedBy", label: "Người cập nhật (ID)" },
                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã vai trò", type: "number" },
                    { name: "name", label: "Tên vai trò", type: "text" },
                    { name: "description", label: "Mô tả", type: "text" },

                    { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật (ID)", type: "number" },

                    { name: "createdAt", label: "Ngày tạo", type: "date" },
                    { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                ]}
                searchField={["name"]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="ROLE_DELETE_BULK"
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
            <RoleDetailSheet
                open={openedDetail}
                onOpenChange={setOpenedDetail}
                role={detailRole}
            />
        </div>
    );
};
