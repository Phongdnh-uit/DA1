import { X } from "lucide-react";
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
            <div className="bg-zinc-100 dark:bg-zinc-700 w-full h-12 flex justify-center items-center mb-4 rounded-2xl font-medium">
                Sắp xếp nâng cao
            </div>

            <div className="space-y-4">
                {value.map((rule, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center"
                    >
                        {/* Column */}
                        <Select
                            value={rule.key}
                            onValueChange={(v) => handleUpdate(idx, { key: v })}
                        >
                            <SelectTrigger className="w-full">
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

                        {/* Direction */}
                        <Select
                            value={rule.direction}
                            onValueChange={(v: "asc" | "desc") =>
                                handleUpdate(idx, { direction: v })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chiều" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Tăng dần</SelectItem>
                                <SelectItem value="desc">Giảm dần</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            size="icon"
                            className="w-full bg-transparent border border-rose-300 text-rose-500 hover:bg-rose-50"
                            onClick={() => handleRemove(idx)}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ))}

                {options.find((opt) => !value.map((r) => r.key).includes(opt.key)) && (
                    <Button
                        onClick={handleAdd}
                        className="bg-transparent border-dashed border-blue-300 text-blue-500 hover:bg-blue-50 border w-full h-12"
                    >
                        + Thêm rule
                    </Button>
                )}

                <Button
                    onClick={() => onChange([])}
                    className="bg-transparent border-dashed border-violet-300 text-violet-500 hover:bg-violet-50 border w-full h-12"
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}
