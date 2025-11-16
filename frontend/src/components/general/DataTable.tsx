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

import NoData from "@/assets/no_data.svg";
import {
    ChevronDown,
    Columns3,
    DownloadCloud,
    RefreshCcw,
    Rows2,
    Rows3,
    Rows4,
    Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import PaginationTabs from "./Pagination";

interface PaginationProps {
    page: number;
    size: number;
}

interface DataTableProps<TData> {
    name: string;
    table: TanStackTable<TData>;
    className?: string;
    onBulkDelete?: () => void;
    pagination: PaginationProps;
    onPaginationChange: (pagination: PaginationProps) => void;
    totalElements: number;
    numberOfElements: number;
    totalPages: number;
}

export function DataTable<TData>({
    name,
    className,
    table,
    onBulkDelete,
    pagination,
    onPaginationChange,
    totalPages,
    totalElements,
    numberOfElements,
}: DataTableProps<TData>) {
    const [densityState, setDensityState] = useState<
        "compact" | "normal" | "flexible"
    >("normal");
    return (
        <div className="w-full">
            <Card className="pb-0 pt-4 gap-1 rounded-3xl">
                <div className="flex items-center justify-between">
                    <CardHeader className="font-medium text-lg text-zinc-900 w-full">
                        {name}
                    </CardHeader>
                    <div className="flex items-center gap-4 justify-end pr-4">
                        <Button
                            onClick={onBulkDelete}
                            className="text-rose-500 bg-transparent hover:bg-rose-500 hover:text-white hover:border-rose-500"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                        <Button
                            variant={"outline"}
                            className="bg-transparen text-violet-500 border-violet-300 hover:bg-violet-500 hover:text-white hover:border-violet-500"
                        >
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Xuất CSV
                        </Button>
                        <DensitySelect
                            density={densityState}
                            setDensity={setDensityState}
                        />
                        <ColumnVisibilitySelect table={table} />
                    </div>
                </div>
                <CardContent className="px-0 my-2">
                    <div
                        className={cn(
                            "w-full [&>div]:h-full border-b rounded overflow-y-auto",
                            className,
                        )}
                    >
                        <Table
                            className={cn({
                                "[&_td]:py-2 [&_th]:py-2": densityState === "compact",
                                "[&_td]:py-3 [&_th]:py-3": densityState === "normal",
                                "[&_td]:py-4 [&_th]:py-4": densityState === "flexible",
                            })}
                        >
                            <TableHeader className="sticky z-10 top-0 h-[50px] bg-slate-200 dark:bg-slate-700">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                        className="hover:bg-inherit h-[50px] *:whitespace-nowrap sticky top-0 after:inset-x-0 after:absolute after:bottom-0 !border-0 select-none"
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="text-zinc-800 text-base font-bold dark:text-zinc-200"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="h-[50px] hover:bg-zinc-50 data-[state=selected]:bg-zinc-50 text-zinc-600 font-medium text-base dark:text-zinc-300 dark:data-[state=selected]:bg-zinc-800 dark:hover:bg-zinc-800"
                                        >
                                            {row.getVisibleCells().map((cell, id) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cn(
                                                        row.getIsSelected()
                                                            ? "bg-tremor-background-muted dark:bg-dark-tremor-background-muted"
                                                            : "",
                                                        "relative",
                                                    )}
                                                >
                                                    {id === 0 && row.getIsSelected() && (
                                                        <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600 dark:bg-blue-500" />
                                                    )}
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
                                            className="p-0"
                                        >
                                            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-2 select-none">
                                                <img src={NoData} className="h-24 w-24" />
                                                <p className="text-zinc-600 font-medium text-lg">
                                                    No results.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between space-x-2 py-2">
                        <div className="text-muted-foreground flex-1 text-md ml-4">
                            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                                <span>
                                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                    {table.getFilteredRowModel().rows.length} row(s) selected.
                                </span>
                            ) : (
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    {!totalElements ? 0 : pagination.page * pagination.size + 1}-
                                    {pagination.page * pagination.size + numberOfElements} trên{" "}
                                    {totalElements}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-4 px-4">
                            <div className="flex items-center gap-2">
                                <div className="whitespace-nowrap">Số hàng trên trang:</div>
                                <Select
                                    value={String(pagination.size)}
                                    onValueChange={(v) =>
                                        onPaginationChange({ page: 0, size: +v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <PaginationTabs
                                currentPage={pagination.page}
                                onPageChange={(page) =>
                                    onPaginationChange({ ...pagination, page })
                                }
                                totalPages={totalPages}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface DensitySelectProps {
    density: "compact" | "normal" | "flexible";
    setDensity: (density: "compact" | "normal" | "flexible") => void;
    className?: string;
}

export default function DensitySelect({
    density,
    setDensity,
    className,
}: DensitySelectProps) {
    return (
        <Select value={density} onValueChange={setDensity}>
            <SelectTrigger
                className={cn("w-40 text-zinc-500 border-zinc-300", className)}
            >
                <SelectValue placeholder={density} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Density</SelectLabel>
                    <SelectItem
                        value="compact"
                        className="flex items-center gap-2 cursor-pointer hover:bg-purple-200/40 data-[state=checked]:bg-purple-100/50"
                    >
                        <Rows4 className="h-4 w-4" /> Thu hẹp
                    </SelectItem>
                    <SelectItem
                        value="normal"
                        className="flex items-center gap-2 cursor-pointer hover:bg-purple-200/40 data-[state=checked]:bg-purple-100/50"
                    >
                        <Rows3 className="h-4 w-4" /> Bình thường
                    </SelectItem>
                    <SelectItem
                        value="flexible"
                        className="flex items-center gap-2 cursor-pointer hover:bg-purple-200/40 data-[state=checked]:bg-purple-100/50"
                    >
                        <Rows2 className="h-4 w-4" /> Mở rộng
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

interface ColumnVisibilitySelectProps<TData> {
    table: TanStackTable<TData>;
    className?: string;
}

export function ColumnVisibilitySelect<TData>({
    table,
    className,
}: ColumnVisibilitySelectProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "bg-transparent text-zinc-500 border-zinc-300 hover:bg-inherit",
                        className,
                    )}
                >
                    <Columns3 /> Cột hiển thị <ChevronDown className="ml-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Cột hiển thị</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                        <DropdownMenuItem
                            key={column.id}
                            className="capitalize h-8 hover:!bg-purple-200/40 pr-4"
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => column.toggleVisibility(!column.getIsVisible())}
                        >
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    className="text-white!"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                />
                                <div>{column.id}</div>
                            </div>
                        </DropdownMenuItem>
                    ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        table.resetColumnVisibility();
                    }}
                >
                    <RefreshCcw /> Reset
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
