import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkPermission,
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
import CreatePermissionModal from "./CreatePermissionModal";
import UpdatePermissionModal from "./UpdatePermissionModal";
import Filter from "@/components/admin/Filter";
import { toast } from "react-toastify";
import DeleteDialog from "@/components/general/DeleteDialog";

const keys: (keyof PermissionResponse)[] = [
    "id",
    "name",
    "resource",
    "action",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const PermissionManage = () => {
    const columns = useMemo(
        () => [
            createSelectionColumn<PermissionResponse>(),
            ...createColumnsFromType<PermissionResponse>(keys),
            createActionColumn<PermissionResponse>({
                onEdit: (permission) => {
                    setSelectedPermission(permission);
                    setOpenUpdatePermission(true);
                },
            }),
        ],
        [],
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

    const [openCreatePermission, setOpenCreatePermission] = useState(false);
    const [openUpdatePermission, setOpenUpdatePermission] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<
        PermissionResponse | undefined
    >(undefined);

    const bulkDeleteMutation = useDeleteBulkPermission({
        mutation: {
            onSuccess: () => {
                toast.success("Delete successfully");
                setSelectedRows([]);
                list.refetch();
            },
        },
    });

    const [selectedRows, setSelectedRows] = useState<number[]>([]);

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
        setSelectedRows(ids);
        setOpenDeleteDialog(true);
    };

    const onConfirmBulkDelete = () => {
        if (selectedRows.length === 0) {
            return;
        }
        bulkDeleteMutation.mutate({
            params: {
                ids: selectedRows,
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
                    onClick={() => setOpenCreatePermission(true)}
                >
                    <IconSparkles className="size-5" /> Create new
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
                className="h-[500px]"
                name="Permission"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <CreatePermissionModal
                open={openCreatePermission}
                onOpenChange={setOpenCreatePermission}
            />
            <UpdatePermissionModal
                open={openUpdatePermission}
                onOpenChange={setOpenUpdatePermission}
                data={selectedPermission}
            />
            <DeleteDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                onConfirm={onConfirmBulkDelete}
            />
        </div>
    );
};
