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
import DeleteDialog from "@/components/general/DeleteDialog";
import { useDeleteBulkRole, useFindAllRole } from "@/services/role/role";

const keys: (keyof RoleResponse)[] = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const RoleManage = () => {
    const columns = useMemo(
        () => [
            createSelectionColumn<RoleResponse>(),
            ...createColumnsFromType<RoleResponse>(keys),
            createActionColumn<RoleResponse>({
                onEdit: () => { },
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
    const list = useFindAllRole({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<RoleResponseDTO>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const bulkDeleteMutation = useDeleteBulkRole({
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
                <RippleButton className="h-12 bg-blue-700 text-white hover:bg-blue-700">
                    <IconSparkles className="size-5" /> Create new
                </RippleButton>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Id" },
                    { key: "name", label: "Name" },
                    { key: "createdAt", label: "Created At" },
                    { key: "updatedAt", label: "Updated At" },
                ]}
                filterAttributes={[
                    { name: "name", label: "Name", type: "text" },
                    { name: "id", label: "Id", type: "number" },
                    { name: "createdBy", label: "Created By", type: "number" },
                    { name: "updatedBy", label: "Updated By", type: "number" },
                    { name: "createdAt", label: "Created At", type: "date" },
                    { name: "updatedAt", label: "Updated At", type: "date" },
                ]}
                onApply={onApplyFilter}
            />
            <DataTable
                className="h-[500px]"
                name="Role"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <DeleteDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                onConfirm={onConfirmBulkDelete}
            />
        </div>
    );
};
