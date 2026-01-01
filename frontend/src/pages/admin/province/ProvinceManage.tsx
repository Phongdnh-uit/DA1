import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkProvince,
    useDeleteProvinceById,
    useFindAllProvince,
} from "@/services/province/province";
import type { ProvinceResponse } from "@/types";
import {
    createActionColumn,
    createColumnsFromType,
    createSelectionColumn,
} from "@/utils/createColumn";
import { IconSparkles } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import PermissionGate from "@/components/general/PermissionGate";
import { ProvinceDetailSheet } from "./DetailProvinceSheet";

const keys: (keyof ProvinceResponse)[] = [
    "id",
    "name",
    "type",
    "code",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const ProvinceManage = () => {
    const [provinceDetail, setProvinceDetail] = useState<ProvinceResponse | null>(
        null,
    );
    const [openedDetail, setOpenedDetail] = useState<boolean>(false);
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const deleteProvince = useDeleteProvinceById({
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
            createSelectionColumn<ProvinceResponse>(),
            ...createColumnsFromType<ProvinceResponse>(keys, [
                {
                    key: "id",
                    header: "Mã tỉnh / thành",
                },
                {
                    key: "name",
                    header: "Tên tỉnh / thành",
                },
                {
                    key: "type",
                    header: "Loại đơn vị hành chính",
                },
                {
                    key: "code",
                    header: "Mã hành chính",
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
            createActionColumn<ProvinceResponse>(
                {
                    onEdit: (row) => {
                        navigate({ to: `/admin/province/update/${row.id}` });
                    },
                    onDelete: (row) => {
                        if (!row.id) return;
                        openDeleteDialog({
                            onConfirm() {
                                deleteProvince.mutate({
                                    id: row.id!,
                                });
                            },
                        });
                    },
                    onView: (row) => {
                        setProvinceDetail(row);
                        setOpenedDetail(true);
                    },
                },
                {
                    deleteCode: "PROVINCE_DELETE",
                    editCode: "PROVINCE_UPDATE",
                    viewCode: "PROVINCE_VIEW_DETAIL",
                },
            ),
        ],
        [deleteProvince, navigate, openDeleteDialog],
    );
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
    }>({ page: 0, size: 10 });
    const [filterParam, setFilterParam] = useState<{
        filter: string;
        sort: string[];
    }>({ filter: "", sort: [] });
    const list = useFindAllProvince({
        page: pagination.page,
        size: pagination.size,
        sort: filterParam.sort,
        filter: filterParam.filter,
    });
    const { table } = useDatatable<ProvinceResponse>({
        columns,
        data: list.data?.data?.content || [],
        pageCount: 0,
    });

    const bulkDeleteMutation = useDeleteBulkProvince({
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
                <PermissionGate permission="PROVINCE_CREATE">
                    <RippleButton
                        onClick={() =>
                            navigate({
                                to: "/admin/province/create",
                            })
                        }
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" /> Create new
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã tỉnh / thành" },
                    { key: "name", label: "Tên tỉnh / thành" },
                    { key: "code", label: "Mã hành chính" },
                    { key: "type", label: "Loại đơn vị hành chính" },
                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã tỉnh / thành", type: "number" },
                    { name: "name", label: "Tên tỉnh / thành", type: "text" },
                    { name: "code", label: "Mã hành chính", type: "text" },
                    { name: "type", label: "Loại đơn vị hành chính", type: "text" },

                    { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật (ID)", type: "number" },

                    { name: "createdAt", label: "Ngày tạo", type: "date" },
                    { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                ]}
                searchField={["name"]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="PROVINCE_DELETE_BULK"
                className="h-[500px]"
                name="Tỉnh/Thành phố"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <ProvinceDetailSheet
                province={provinceDetail}
                open={openedDetail}
                onOpenChange={setOpenedDetail}
            />
        </div>
    );
};
