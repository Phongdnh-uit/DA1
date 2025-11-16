import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkProperty,
    useDeletePropertyById,
    useFindAllProperty,
} from "@/services/property/property";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import type { PropertyResponse } from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const keys: (keyof PropertyResponse)[] = [
    "id",
    "title",
    "price",
    "purpose",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const PropertyManage = () => {
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const deleteProperty = useDeletePropertyById({
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
            createSelectionColumn<PropertyResponse>(),
            ...createColumnsFromType<PropertyResponse>(keys),
            createActionColumn<PropertyResponse>({
                onEdit: (row) => {
                    navigate({ to: `/admin/property/update/${row.id}` });
                },
                onDelete: (row) => {
                    openDeleteDialog({
                        onConfirm() {
                            if (!row.id) {
                                return;
                            }
                            deleteProperty.mutate({
                                id: row.id,
                            });
                        },
                    });
                },
            }),
        ],
        [deleteProperty, navigate, openDeleteDialog],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllProperty({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<PropertyResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkProperty({
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

    const getSelectedRowIds = () => {
        return table
            .getSelectedRowModel()
            .rows.flatMap((r) => (r.original.id ? [r.original.id] : []));
    };

    const onBulkDelete = () => {
        const ids = getSelectedRowIds();
        if (ids.length === 0) {
            toast.info("Hãy chọn ít nhất một mục để xóa.");
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
                    onClick={() => navigate({ to: "/admin/property/create" })}
                    className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                >
                    <IconSparkles className="size-5" /> Create new
                </RippleButton>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Id" },
                    { key: "name", label: "Name" },
                    { key: "code", label: "Code" },
                    { key: "province.id", label: "Province Id" },
                    { key: "createdBy", label: "Created By" },
                    { key: "updatedBy", label: "Updated By" },
                    { key: "createdAt", label: "Created At" },
                    { key: "updatedAt", label: "Updated At" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Id", type: "number" },
                    { name: "name", label: "Name", type: "text" },
                    { name: "ward.province.id", label: "Province Id", type: "number" },
                    { name: "ward.province.name", label: "Province Name", type: "text" },
                    { name: "ward.name", label: "Ward Name", type: "text" },
                    { name: "ward.id", label: "Ward Id", type: "text" },
                    { name: "createdBy", label: "Created By", type: "number" },
                    { name: "updatedBy", label: "Updated By", type: "number" },
                    { name: "createdAt", label: "Created At", type: "date" },
                    { name: "updatedAt", label: "Updated At", type: "date" },
                ]}
                onApply={onApplyFilter}
            />
            <DataTable
                className="h-[550px]"
                name="Bất động sản"
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
