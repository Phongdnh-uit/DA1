import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkPropertyType,
    useDeletePropertyTypeById,
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
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import { useNavigate } from "@tanstack/react-router";
import PermissionGate from "@/components/general/PermissionGate";
import { PropertyTypeDetailSheet } from "./PropertyTypeDetailSheet";

const keys: (keyof PropertyTypeResponse)[] = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
];

export const PropertyTypeManage = () => {
    const [propertyTypeDetail, setPropertyTypeDetail] =
        useState<PropertyTypeResponse | null>(null);
    const [openedDetail, setOpenedDetail] = useState<boolean>(false);
    const navigate = useNavigate();
    const openDeleteDialog = useDeleteDialogStore((state) => state.openDialog);
    const deletePropertyType = useDeletePropertyTypeById({
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
            createSelectionColumn<PropertyTypeResponse>(),
            ...createColumnsFromType<PropertyTypeResponse>(keys, [
                {
                    key: "id",
                    header: "Mã loại bất động sản",
                },
                {
                    key: "name",
                    header: "Tên loại bất động sản",
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
            createActionColumn<PropertyTypeResponse>(
                {
                    onEdit: (row) => {
                        navigate({
                            to: `/admin/property-type/update/${row.id}`,
                        });
                    },
                    onDelete: (row) => {
                        openDeleteDialog({
                            onConfirm() {
                                if (!row.id) return;
                                deletePropertyType.mutate({ id: row.id });
                            },
                        });
                    },
                    onView: (row) => {
                        setPropertyTypeDetail(row);
                        setOpenedDetail(true);
                    },
                },
                {
                    deleteCode: "PROPERTY_TYPE_DELETE",
                    editCode: "PROPERTY_TYPE_UPDATE",
                    viewCode: "PROPERTY_TYPE_VIEW_DETAIL",
                },
            ),
        ],
        [deletePropertyType, navigate, openDeleteDialog],
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

    const bulkDeleteMutation = useDeleteBulkPropertyType({
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
                <PermissionGate permission="PROPERTY_TYPE_CREATE">
                    <RippleButton
                        onClick={() => navigate({ to: "/admin/property-type/create" })}
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" />
                        Thêm mới
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã loại bất động sản" },
                    { key: "name", label: "Tên loại bất động sản" },
                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã loại bất động sản", type: "number" },
                    { name: "name", label: "Tên loại bất động sản", type: "text" },

                    { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật (ID)", type: "number" },

                    { name: "createdAt", label: "Ngày tạo", type: "date" },
                    { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                ]}
                searchField={["name"]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="PROPERTY_TYPE_DELETE_BULK"
                className="h-[500px]"
                name="Loại bất động sản"
                table={table}
                onBulkDelete={onBulkDelete}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalPages={list.data?.data?.totalPages || 0}
                totalElements={list.data?.data?.totalElements || 0}
                numberOfElements={list.data?.data?.numberOfElements || 0}
            />
            <PropertyTypeDetailSheet
                open={openedDetail}
                onOpenChange={setOpenedDetail}
                propertyType={propertyTypeDetail}
            />
        </div>
    );
};
