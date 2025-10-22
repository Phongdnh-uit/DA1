import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
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
            ...createColumnsFromType<UserResponse>(keys),
            createActionColumn<UserResponse>({
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
            }),
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
                bulkDeleteMutation.mutate({ params: { ids } });
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
                    onClick={() => navigate({ to: "/admin/user/create" })}
                    className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                >
                    <IconSparkles className="size-5" /> Create new
                </RippleButton>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Id" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Phone" },
                    { key: "createdAt", label: "Created At" },
                    { key: "updatedAt", label: "Updated At" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Id", type: "number" },
                    { name: "email", label: "Email", type: "text" },
                    { name: "phone", label: "Phone", type: "text" },
                    { name: "fullName", label: "Full name", type: "text" },
                    { name: "createdBy", label: "Created By", type: "number" },
                    { name: "updatedBy", label: "Updated By", type: "number" },
                    { name: "createdAt", label: "Created At", type: "date" },
                    { name: "updatedAt", label: "Updated At", type: "date" },
                ]}
                onApply={onApplyFilter}
            />
            <DataTable
                className="h-[500px]"
                name="User"
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
