import { flexRender } from "@tanstack/react-table";

import type { Table as TanStackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  name: string;
  table: TanStackTable<TData>;
  density: "compact" | "normal" | "flexible";
}

export function DataTable<TData>({
  name,
  table,
  density,
}: DataTableProps<TData>) {
  return (
    <div className="w-full">
      <Card className="pb-0 pt-4 gap-1">
        <CardHeader className="font-semibold text-xl text-zinc-800">
          {name}
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-hidden border">
            <Table
              className={cn({
                "[&_td]:py-px [&_th]:py-px": density === "compact",
                "[&_td]:py-1 [&_th]:py-1": density === "normal",
                "[&_td]:py-2 [&_th]:py-1": density === "flexible",
              })}
            >
              <TableHeader className="bg-zinc-400 h-[50px]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    className="hover:bg-inherit h-[50px]"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-zinc-50 text-base font-bold"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="h-[50px] hover:bg-zinc-200/40 data-[state=selected]:bg-zinc-200/40 text-zinc-600 font-medium text-base"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="pointer-events-none">
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-50 text-center text-zinc-600 font-medium text-lg"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 select-none">
                        {/* no data img  */}
                      </div>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-md ml-4">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
