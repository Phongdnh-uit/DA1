"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { ArrowRight, CalendarIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { MotionButton } from "@/components/customs/MotionButton";

type GroupBy = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

const groupByOptions = [
    { value: "DAILY", label: "Theo ngày (Daily)" },
    { value: "WEEKLY", label: "Theo tuần (Weekly)" },
    { value: "MONTHLY", label: "Theo tháng (Monthly)" },
    { value: "YEARLY", label: "Theo năm (Yearly)" },
];

interface DateRangeFilterProps {
    onApply?: (
        startDate: Date | undefined,
        endDate: Date | undefined,
        groupBy: GroupBy,
    ) => void;
}

export function DateRangeFilter({ onApply }: DateRangeFilterProps) {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [groupBy, setGroupBy] = useState<GroupBy>("DAILY");

    const handleApply = () => {
        if (onApply) {
            onApply(startDate, endDate, groupBy);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 shadow-lg">
                <div className="space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <span className="p-2 rounded-lg bg-primary/10">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                            </span>
                            Bộ lọc thống kê
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Chọn khoảng thời gian và nhóm dữ liệu theo yêu cầu
                        </p>
                    </motion.div>

                    {/* Filters Grid */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full flex-1 items-center"
                        >
                            {/* Start Date */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <Label
                                    htmlFor="start-date"
                                    className="text-sm font-semibold text-foreground flex items-center gap-1"
                                >
                                    Ngày bắt đầu
                                    <CalendarIcon className="size-4" />
                                </Label>
                                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                                    <DatePicker
                                        id="start-date"
                                        date={startDate}
                                        onDateChange={(date) => setStartDate(date)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* End Date */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <Label
                                    htmlFor="end-date"
                                    className="text-sm font-semibold text-foreground flex items-center gap-1"
                                >
                                    Ngày kết thúc
                                    <CalendarIcon className="w-4 h-4" />
                                </Label>
                                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                                    <DatePicker
                                        id="end-date"
                                        date={endDate}
                                        onDateChange={(date) => setEndDate(date)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Group By Select */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label
                                    htmlFor="group-by"
                                    className="text-sm font-semibold text-foreground block"
                                >
                                    Nhóm theo
                                </label>
                                <Select
                                    value={groupBy}
                                    onValueChange={(value) => setGroupBy(value as GroupBy)}
                                >
                                    <SelectTrigger
                                        id="group-by"
                                        className="w-full bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border border-border">
                                        {groupByOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="cursor-pointer"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </motion.div>

                        <div>
                            {/* Apply Button */}
                            <label
                                htmlFor="start-date"
                                className="text-sm font-semibold text-foreground block"
                            >
                                &nbsp;
                            </label>
                            <MotionButton 
                                onClick={handleApply}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg h-10 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                                <ArrowRight className="w-4 h-4" />
                                <span>Áp dụng</span>
                            </MotionButton>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
