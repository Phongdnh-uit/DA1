import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AccessorColumnDef, ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { z } from "zod";
import { formatDate } from "./formatDate";

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
                if (value instanceof Date) {
                    return formatDate(value);
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
    const base = keys.map<AccessorColumnDef<TRow, unknown>>((key) => ({
        id: key as string,
        accessorKey: key as string,
        header: String(key),
    }));

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
                splashClassName="bg-blue-500"
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
                splashClassName="bg-blue-500"
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
): ColumnDef<TData> {
    return {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlers.onView?.(data)}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlers.onEdit?.(data)}>
                            <Edit className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handlers.onDelete?.(data)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(JSON.stringify(data))
                            }
                        >
                            <Copy className="mr-2 h-4 w-4" /> Copy
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };
}
