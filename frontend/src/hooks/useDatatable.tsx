import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

interface DatatableStateProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageCount?: number;
}
export function useDatatable<TData>({
  columns,
  data,
  pageCount,
}: DatatableStateProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [density, setDensity] = useState<"compact" | "normal" | "flexible">(
    "normal",
  );

  const table = useReactTable({
    columns,
    data,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount,
    state: {
      columnVisibility,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });
  return {
    table,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    density,
    setDensity,
  };
}
