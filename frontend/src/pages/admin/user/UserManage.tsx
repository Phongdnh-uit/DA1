import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import PermissionGate from "@/components/general/PermissionGate";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkUser,
    useDeleteUserById,
    useFindAllUser,
} from "@/services/user/user";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import type { UserResponse } from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const keys: (keyof UserResponse)[] = [
    "id",
    "fullName",
    "email",
    "phone",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const UserManage = () => {
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const deleteUser = useDeleteUserById({
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
            createSelectionColumn<UserResponse>(),
            ...createColumnsFromType<UserResponse>(keys, [
                {
                    key: "id",
                    header: "Mã người dùng",
                },
                {
                    key: "fullName",
                    header: "Họ và tên",
                },
                {
                    key: "email",
                    header: "Email",
                },
                {
                    key: "phone",
                    header: "Số điện thoại",
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
            createActionColumn<UserResponse>(
                {
                    onEdit: (row) => {
                        navigate({ to: `/admin/user/update/${row.id}` });
                    },
                    onDelete: (row) => {
                        if (!row.id) return;
                        openDeleteDialog({
                            onConfirm() {
                                deleteUser.mutate({ id: row.id! });
                            },
                        });
                    },
                },
                {
                    deleteCode: "USER_DELETE",
                    editCode: "USER_UPDATE",
                    viewCode: "USER_VIEW_DETAIL",
                },
            ),
        ],
        [deleteUser, navigate, openDeleteDialog],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllUser(
        {
            page: pagination.page,
            size: pagination.size,
            sort: filterParam.sort,
            filter: filterParam.filter,
        },
        {
            query: {
                staleTime: 0,
            },
        },
    );
    const { table } = useDatatable<UserResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkUser({
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
                <PermissionGate permission="USER_CREATE">
                    <RippleButton
                        onClick={() => navigate({ to: "/admin/user/create" })}
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" /> Create new
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã người dùng" },
                    { key: "fullName", label: "Họ và tên" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Số điện thoại" },
                    { key: "status", label: "Trạng thái" },
                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
                    { key: "createdBy", label: "Người tạo" },
                    { key: "updatedBy", label: "Người cập nhật" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã người dùng", type: "number" },
                    { name: "fullName", label: "Họ và tên", type: "text" },
                    { name: "email", label: "Email", type: "text" },
                    { name: "phone", label: "Số điện thoại", type: "text" },

                    { name: "status", label: "Trạng thái", type: "text" },
                    { name: "roleId", label: "Vai trò (ID)", type: "number" },

                    { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật (ID)", type: "number" },

                    { name: "createdAt", label: "Ngày tạo", type: "date" },
                    { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                ]}
                searchField={["fullName", "email", "phone"]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="USER_DELETE_BULK"
                className="h-[500px]"
                name="Người dùng"
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
