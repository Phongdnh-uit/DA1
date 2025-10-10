import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import DeleteDialog from "@/components/general/DeleteDialog";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkPropertyType,
    useFindAllPropertyType,
} from "@/services/property-type/property-type";
import type { PropertyTypeResponse } from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CreatePropertyTypeModal from "./CreatePropertyTypeModal";
import UpdatePropertyTypeModal from "./UpdatePropertyTypeModal";

const keys: (keyof PropertyTypeResponse)[] = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const PropertyTypeManage = () => {
    const columns = useMemo(
        () => [
            createSelectionColumn<PropertyTypeResponse>(),
            ...createColumnsFromType<PropertyTypeResponse>(keys),
            createActionColumn<PropertyTypeResponse>({
                onEdit: () => {
                    setOpenUpdateModal(true);
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
    const list = useFindAllPropertyType({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<PropertyTypeResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const bulkDeleteMutation = useDeleteBulkPropertyType({
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
                    onClick={() => setOpenCreateModal(true)}
                    className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                >
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
                    { name: "id", label: "Id", type: "number" },
                    { name: "name", label: "Name", type: "text" },
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
            <DeleteDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                onConfirm={onConfirmBulkDelete}
            />
            <CreatePropertyTypeModal
                open={openCreateModal}
                onOpenChange={setOpenCreateModal}
            />
            <UpdatePropertyTypeModal
                open={openUpdateModal}
                onOpenChange={setOpenUpdateModal}
            />
        </div>
    );
};
