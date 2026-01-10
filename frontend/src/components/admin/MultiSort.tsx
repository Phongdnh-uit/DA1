import { Plus, RotateCcw, X } from "lucide-react";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export interface SortOption {
    key: string;
    label: string;
}

export type SortRule = {
    key: string;
    direction: "asc" | "desc";
};

interface MultiSortSelectProps {
    options: SortOption[];
    value: SortRule[];
    onChange: (rules: SortRule[]) => void;
}

export function MultiSortInline({
    options,
    value,
    onChange,
}: MultiSortSelectProps) {
    const handleAdd = () => {
        if (options.length > 0) {
            const usedKeys = value.map((r) => r.key);
            const available = options.find((opt) => !usedKeys.includes(opt.key));
            if (!available) return;

            onChange([...value, { key: available.key, direction: "asc" }]);
        }
    };

    const handleUpdate = (idx: number, rule: Partial<SortRule>) => {
        onChange(value.map((r, i) => (i === idx ? { ...r, ...rule } : r)));
    };

    const handleRemove = (idx: number) => {
        onChange(value.filter((_, i) => i !== idx));
    };

    return (
        <div>
            <div className="bg-slate-200 dark:bg-slate-700 w-full h-12 flex justify-center items-center mb-4 rounded-2xl font-medium">
                Sắp xếp nâng cao
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                {/* Sort Rules */}
                <div className={"space-y-3 " + (value.length === 0 ? "hidden" : "")}>
                    {value.length > 0 && (
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">
                            Quy tắc ({value.length})
                        </div>
                    )}

                    {value.map((rule, idx) => (
                        <div
                            key={idx}
                            className="group flex gap-3 items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                        >
                            {/* Index Badge */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                                    {idx + 1}
                                </span>
                            </div>

                            {/* Column Select */}
                            <div className="flex-1 min-w-0">
                                <Select
                                    value={rule.key}
                                    onValueChange={(v) => handleUpdate(idx, { key: v })}
                                >
                                    <SelectTrigger className="w-full h-10 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-50">
                                        <SelectValue placeholder="Chọn cột" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt) => {
                                            const selected = value.some(
                                                (r, i) => r.key === opt.key && i !== idx,
                                            );
                                            if (selected && rule.key !== opt.key) return null;

                                            return (
                                                <SelectItem key={opt.key} value={opt.key}>
                                                    {opt.label}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Direction Select */}
                            <div className="flex-1 min-w-0">
                                <Select
                                    value={rule.direction}
                                    onValueChange={(v: "asc" | "desc") =>
                                        handleUpdate(idx, { direction: v })
                                    }
                                >
                                    <SelectTrigger className="w-full h-10 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-50">
                                        <SelectValue placeholder="Chiều" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Tăng dần</SelectItem>
                                        <SelectItem value="desc">Giảm dần</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Delete Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 h-10 w-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(idx)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-slate-200 dark:border-slate-700">
                    {options.find(
                        (opt) => !value.map((r) => r.key).includes(opt.key),
                    ) && (
                            <Button
                                onClick={handleAdd}
                                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm quy tắc
                            </Button>
                        )}

                    <Button
                        onClick={() => onChange([])}
                        className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                </div>

                {/* Stats */}
                {value.length > 0 && (
                    <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 px-1">
                        {value.length} quy tắc sắp xếp đang áp dụng
                    </div>
                )}
            </div>
        </div>
    );
}
