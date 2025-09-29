import { DataTable } from "@/components/general/DataTable";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useDatatable } from "@/hooks/useDatatable";
import {
  useDeleteBulkPermission,
  useFindAllPermission,
} from "@/services/permission/permission";
import type { PermissionResponseDTO } from "@/types";
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

const keys: (keyof PermissionResponseDTO)[] = [
  "id",
  "name",
  "resource",
  "action",
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt",
];

export const PermissionManage = () => {
  const columns = useMemo(
    () => [
      createSelectionColumn<PermissionResponseDTO>(),
      ...createColumnsFromType<PermissionResponseDTO>(keys),
      createActionColumn<PermissionResponseDTO>({
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
  const { table } = useDatatable<PermissionResponseDTO>({
    columns,
    data: list.data?.content || [],
    pageCount: 0,
  });

  const [openCreatePermission, setOpenCreatePermission] = useState(false);
  const [openUpdatePermission, setOpenUpdatePermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<
    PermissionResponseDTO | undefined
  >(undefined);

  const bulkDeleteMutation = useDeleteBulkPermission();

  const onBulkDelete = () => {
    const selectedRowIds = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.id)
      .filter((v) => v !== undefined);
    if (selectedRowIds.length === 0) {
      toast.info("Please choose one row to delete");
    }
    bulkDeleteMutation.mutate({
      params: {
        ids: selectedRowIds,
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
      <Filter onApply={onApplyFilter} />
      <DataTable
        className="h-[500px]"
        name="Permission"
        table={table}
        onBulkDelete={onBulkDelete}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalPages={list.data?.totalPages || 0}
        totalElements={list.data?.totalElements || 0}
        numberOfElements={list.data?.numberOfElements || 0}
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
    </div>
  );
};
