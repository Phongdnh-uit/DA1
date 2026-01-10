"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

interface DatePickerProps {
    id?: string;
    className?: string;
    date?: Date | undefined;
    onDateChange?: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
}

export function DatePicker({
    onDateChange,
    date,
    id,
    className,
    disabled,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id={id}
                        className={cn("w-48 justify-between font-normal", className)}
                    >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        locale={vi}
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        formatters={{
                            formatMonthDropdown: (date) =>
                                format(date, "LLLL", { locale: vi }),
                            formatCaption: (date) =>
                                format(date, "MMMM yyyy", { locale: vi }),
                        }}
                        onSelect={(date) => {
                            onDateChange?.(date);
                            setOpen(false);
                        }}
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
