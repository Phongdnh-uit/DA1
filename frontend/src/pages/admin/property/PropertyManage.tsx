import Filter from "@/components/admin/Filter";
import { DataTable } from "@/components/general/DataTable";
import PermissionGate from "@/components/general/PermissionGate";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
    useDeleteBulkProperty,
    useDeletePropertyById,
    useFindAllProperty,
} from "@/services/property/property";
import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import type { PropertyResponse } from "@/types";
import { formatCurrency } from "@/utils/converter";
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
            ...createColumnsFromType<PropertyResponse>(keys, [
                {
                    key: "title",
                    header: "Tiêu đề",
                    cell: (info) => {
                        return (
                            <span className="font-medium max-w-lg truncate block">
                                {info.getValue()}
                            </span>
                        );
                    },
                },
                {
                    key: "id",
                    header: "Mã BĐS",
                },
                {
                    key: "price",
                    header: "Giá",
                    cell: (info) => {
                        return (
                            <span>
                                {formatCurrency(info.getValue() as number)}
                            </span>
                        );
                    }
                },
                {
                    key: "purpose",
                    header: "Mục đích",
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
            createActionColumn<PropertyResponse>(
                {
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
                    onView: (row) => {
                        navigate({ to: `/admin/property/detail/${row.id}` });
                    },
                },
                {
                    deleteCode: "PROPERTY_DELETE",
                    editCode: "PROPERTY_UPDATE",
                    viewCode: "PROPERTY_VIEW_DETAIL",
                },
            ),
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
            <div className="flex items-center justify-end p-2">
                <PermissionGate permission="PROPERTY_CREATE">
                    <RippleButton
                        onClick={() => navigate({ to: "/admin/property/create" })}
                        className="h-12 bg-blue-700 text-white hover:bg-blue-700"
                    >
                        <IconSparkles className="size-5" />
                        Thêm mới
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã BĐS" },

                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },

                    { key: "price", label: "Giá" },
                    { key: "landArea", label: "Diện tích đất (m²)" },
                    { key: "floorArea", label: "Diện tích sàn (m²)" },

                    { key: "bedrooms", label: "Số phòng ngủ" },
                    { key: "bathrooms", label: "Số phòng tắm" },
                    { key: "floors", label: "Số tầng" },

                    { key: "entranceRoadWidth", label: "Lộ giới (m)" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã BĐS", type: "number" },
                    { name: "title", label: "Tiêu đề", type: "text" },
                    { name: "description", label: "Mô tả", type: "text" },
                    { name: "purpose", label: "Mục đích", type: "text" },
                    { name: "status", label: "Trạng thái", type: "text" },
                    { name: "type.id", label: "Loại hình (ID)", type: "number" },
                    { name: "type.name", label: "Loại hình BĐS", type: "text" },
                    { name: "price", label: "Giá", type: "number" },

                    { name: "landArea", label: "Diện tích đất (m²)", type: "number" },
                    { name: "floorArea", label: "Diện tích sàn (m²)", type: "number" },
                    { name: "lineAddress", label: "Địa chỉ chi tiết", type: "text" },
                    { name: "ward.name", label: "Phường / xã", type: "text" },
                    { name: "ward.code", label: "Mã phường / xã", type: "text" },
                    { name: "ward.type", label: "Loại phường / xã", type: "text" },
                    { name: "ward.province.name", label: "Tỉnh / thành", type: "text" },
                    {
                        name: "ward.province.code",
                        label: "Mã tỉnh / thành",
                        type: "text",
                    },
                    {
                        name: "ward.province.type",
                        label: "Loại tỉnh / thành",
                        type: "text",
                    },
                    { name: "floors", label: "Tổng số tầng", type: "number" },
                    { name: "floorNumber", label: "Số tầng hiện hữu", type: "number" },
                    { name: "bedrooms", label: "Số phòng ngủ", type: "number" },
                    { name: "bathrooms", label: "Số phòng tắm", type: "number" },
                    { name: "direction", label: "Hướng nhà", type: "text" },
                    { name: "balconyDirection", label: "Hướng ban công", type: "text" },
                    { name: "entranceRoadWidth", label: "Lộ giới (m)", type: "number" },
                    { name: "hasMezzanine", label: "Có gác lửng", type: "text" },
                    { name: "hasBasement", label: "Có tầng hầm", type: "text" },
                    { name: "hasElevator", label: "Có thang máy", type: "text" },

                    { name: "interior", label: "Nội thất", type: "text" },
                    { name: "createdBy", label: "Người tạo (ID)", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật (ID)", type: "number" },
                    { name: "createdAt", label: "Ngày tạo", type: "date" },
                    { name: "updatedAt", label: "Ngày cập nhật", type: "date" },
                ]}
                onApply={onApplyFilter}
            />
            <DataTable
                deleteCode="PROPERTY_DELETE_BULK"
                className="h-[500px]"
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
