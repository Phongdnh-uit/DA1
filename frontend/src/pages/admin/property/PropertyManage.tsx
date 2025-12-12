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
                        <IconSparkles className="size-5" />Thêm mới
                    </RippleButton>
                </PermissionGate>
            </div>
            <Filter
                sortAttributes={[
                    { key: "id", label: "Mã tin" },
                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
                    { key: "price", label: "Giá" },
                    { key: "landArea", label: "Diện tích đất" },
                    { key: "floorArea", label: "Diện tích sàn" },
                    { key: "bedrooms", label: "Số phòng ngủ" },
                    { key: "bathrooms", label: "Số phòng tắm" },
                    { key: "floors", label: "Số tầng" },
                    { key: "entranceRoadWidth", label: "Lộ giới" },
                ]}
                filterAttributes={[
                    { name: "id", label: "Mã tin", type: "number" },
                    { name: "title", label: "Tiêu đề", type: "text" },
                    {
                        name: "purpose",
                        label: "Mục đích",
                        type: "text",
                    },
                    { name: "type.name", label: "Loại hình", type: "text" },
                    { name: "price", label: "Giá", type: "number" },
                    { name: "lineAddress", label: "Địa chỉ", type: "text" },
                    { name: "ward.name", label: "Tên phường", type: "text" },
                    { name: "ward.code", label: "Mã phường", type: "text" },
                    { name: "ward.type", label: "Loại phường", type: "text" },
                    { name: "ward.province.name", label: "Tên tỉnh/thành", type: "text" },
                    { name: "ward.province.code", label: "Mã tỉnh/thành", type: "text" },
                    {
                        name: "ward.province.type",
                        label: "Loại tỉnh/thành",
                        type: "text",
                    },
                    { name: "landArea", label: "Diện tích đất (m²)", type: "number" },
                    { name: "floorArea", label: "Diện tích sàn (m²)", type: "number" },
                    { name: "floors", label: "Tổng số tầng", type: "number" },
                    { name: "floorNumber", label: "Số tầng hiện hữu", type: "number" },
                    { name: "bedrooms", label: "Số phòng ngủ", type: "number" },
                    { name: "bathrooms", label: "Số phòng tắm", type: "number" },
                    {
                        name: "direction",
                        label: "Hướng nhà",
                        type: "text",
                    },
                    {
                        name: "balconyDirection",
                        label: "Hướng ban công",
                        type: "text",
                    },
                    { name: "entranceRoadWidth", label: "Lộ giới (m)", type: "number" },
                    { name: "hasMezzanine", label: "Có gác lửng", type: "text" },
                    { name: "hasBasement", label: "Có hầm", type: "text" },
                    { name: "hasElevator", label: "Có thang máy", type: "text" },
                    {
                        name: "status",
                        label: "Trạng thái",
                        type: "text",
                    },
                    { name: "createdBy", label: "Người tạo", type: "number" },
                    { name: "updatedBy", label: "Người cập nhật", type: "number" },
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
