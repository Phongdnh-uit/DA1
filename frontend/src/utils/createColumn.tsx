import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AccessorColumnDef, ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Eye, Trash } from "lucide-react";
import { z } from "zod";
import { formatDate } from "./formatDate";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import PermissionGate from "@/components/general/PermissionGate";

type ColumnOptions<TData, TValue> = Partial<
    AccessorColumnDef<TData, TValue>
> & {
    key: keyof TData;
};

type ColumnOverride<TData> = Partial<
    Omit<AccessorColumnDef<TData, unknown>, "id" | "accessorKey" | "accessorFn">
> & {
    key: keyof TData;
};

export function createColumn<TData, TValue = unknown>(
    opts: ColumnOptions<TData, TValue>,
): AccessorColumnDef<TData, TValue> {
    const key = opts.key as string;
    return {
        id: key,
        accessorKey: key,
        header: opts.header ?? key.toUpperCase(),
        cell:
            opts.cell ??
            ((info) => {
                const value = info.getValue();
                if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                    return formatDate(new Date(value), true);
                }
                if (value === "" || value === null || value === undefined) {
                    return "N/A";
                }
                return String(value ?? "");
            }),
        ...opts,
    };
}

export function createColumnsFromSchema<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    overrides: ColumnOverride<z.infer<z.ZodObject<T>>>[] = [],
): ColumnDef<z.infer<z.ZodObject<T>>>[] {
    type TRow = z.infer<z.ZodObject<T>>;
    const shapeKeys = Object.keys(schema.shape) as (keyof TRow)[];
    const base: AccessorColumnDef<TRow, unknown>[] = shapeKeys.map((key) =>
        createColumn<TRow>({ key }),
    );
    const merged: AccessorColumnDef<TRow, unknown>[] = base.map((col) => {
        const o = overrides.find((o) => o.key === col.id);
        return o ? ({ ...col, ...o } as AccessorColumnDef<TRow, unknown>) : col;
    });
    return merged;
}

export function createColumnsFromType<TRow extends object>(
    keys: (keyof TRow)[],
    overrides: ColumnOverride<TRow>[] = [],
): ColumnDef<TRow>[] {
    // const base = keys.map<AccessorColumnDef<TRow, unknown>>((key) => ({
    //     id: key as string,
    //     accessorKey: key as string,
    //     header: String(key),
    //     cell: (info) => String(info.getValue() ?? ""),
    // }));
    //
    const base = keys.map<AccessorColumnDef<TRow, unknown>>((key) =>
        createColumn({ key }),
    );

    return base.map((col) => {
        const override = overrides.find((o) => o.key === col.id);
        return override ? { ...col, ...override, id: override.key as string } : col;
    });
}

export function createSelectionColumn<TData>(): ColumnDef<TData> {
    return {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                className="size-5 rounded-[6px] bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent"
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="size-5 rounded-[6px] bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    };
}

export function createActionColumn<TData>(
    handlers: {
        onView?: (row: TData) => void;
        onEdit?: (row: TData) => void;
        onDelete?: (row: TData) => void;
    } = {},
    permissions: {
        viewCode?: string;
        editCode?: string;
        deleteCode?: string;
    } = {},
): ColumnDef<TData> {
    return {
        id: "ACTIONS",
        enableSorting: false,
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center gap-2">
                    <TooltipProvider delayDuration={200}>
                        {handlers.onView && (
                            <PermissionGate permission={permissions.viewCode || ""}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 w-9 p-0 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 hover:shadow-md"
                                            onClick={() => handlers.onView?.(data)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p className="font-medium">
                                            Xem chi tiết
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </PermissionGate>
                        )}

                        {handlers.onEdit && (
                            <PermissionGate permission={permissions.editCode || ""}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 w-9 p-0 border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 hover:shadow-md"
                                            onClick={() => handlers.onEdit?.(data)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p className="font-medium">
                                            Cập nhật
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </PermissionGate>
                        )}

                        {handlers.onDelete && (
                            <PermissionGate permission={permissions.deleteCode || ""}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 w-9 p-0 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 hover:shadow-md"
                                            onClick={() => handlers.onDelete?.(data)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p className="font-medium">
                                            Xóa
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </PermissionGate>
                        )}

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 border-gray-200 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-all duration-200 hover:shadow-md"
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(data));
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="font-medium">
                                    Sao chép dữ liệu
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    };
}
