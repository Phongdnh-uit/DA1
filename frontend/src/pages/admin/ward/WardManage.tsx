import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import PermissionGate from "@/components/general/PermissionGate";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkWard,
    useDeleteWardById,
    useFindAllWard,
} from "@/services/ward/ward";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import type { WardResponse } from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { WardDetailSheet } from "./DetailWardSheet";

const keys: (keyof WardResponse)[] = [
    "id",
    "name",
    "type",
    "code",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const WardManage = () => {
    const [detailWard, setDetailWard] = useState<WardResponse | null>(null);
    const [openedDetail, setOpenedDetail] = useState<boolean>(false);
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const useDeleteWard = useDeleteWardById({
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
            createSelectionColumn<WardResponse>(),
            ...createColumnsFromType<WardResponse>(keys),
            createActionColumn<WardResponse>(
                {
                    onEdit: (row) => {
                        navigate({ to: `/admin/ward/update/${row.id}` });
                    },
                    onDelete: (row) => {
                        if (!row.id) return;
                        openDeleteDialog({
                            onConfirm() {
                                useDeleteWard.mutate({ id: row.id! });
                            },
                        });
                    },
                    onView: (row) => {
                        setDetailWard(row);
                        setOpenedDetail(true);
                    }
                },
                {
                    deleteCode: "WARD_DELETE",
                    editCode: "WARD_UPDATE",
                    viewCode: "WARD_VIEW_DETAIL",
                },
            ),
        ],
        [navigate, openDeleteDialog, useDeleteWard],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllWard({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<WardResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkWard({
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
                <PermissionGate permission="WARD_CREATE">
                    <RippleButton
                        onClick={() => navigate({ to: "/admin/ward/create" })}
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" /> Create new
                    </RippleButton>
                </PermissionGate>
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
                    { name: "codeName", label: "Code Name", type: "text" },
                    { name: "province.id", label: "Province Id", type: "number" },
                    { name: "createdBy", label: "Created By", type: "number" },
                    { name: "updatedBy", label: "Updated By", type: "number" },
                    { name: "createdAt", label: "Created At", type: "date" },
                    { name: "updatedAt", label: "Updated At", type: "date" },
                ]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="WARD_DELETE_BULK"
                className="h-[500px]"
                name="Xã/Phường"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <WardDetailSheet
                ward={detailWard}
                open={openedDetail}
                onOpenChange={setOpenedDetail}
            />
        </div>
    );
};
