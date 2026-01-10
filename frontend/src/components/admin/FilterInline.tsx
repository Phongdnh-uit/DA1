"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, RotateCcw, XIcon } from "lucide-react";

type AttributeType = "number" | "date" | "text";

const operators: Record<AttributeType, { value: string; label: string }[]> = {
    number: [
        { value: "==", label: "Bằng" },
        { value: "!=", label: "Không bằng" },
        { value: "<", label: "Nhỏ hơn" },
        { value: "<=", label: "Nhỏ hơn hoặc bằng" },
        { value: ">", label: "Lớn hơn" },
        { value: ">=", label: "Lớn hơn hoặc bằng" },
        { value: "=isnull=", label: "Là rỗng" },
        { value: "=isnotnull=", label: "Là không rỗng" },
    ],
    date: [
        { value: "==", label: "Bằng" },
        { value: "!=", label: "Không bằng" },
        { value: "<", label: "Trước ngày" },
        { value: ">", label: "Sau ngày" },
        { value: "=isnull=", label: "Là rỗng" },
        { value: "=isnotnull=", label: "Là không rỗng" },
    ],
    text: [
        { value: "=='${value}'", label: "Bằng" },
        { value: "!='${value}'", label: "Không bằng" },
        { value: "=='${value}*'", label: "Bắt đầu với" },
        { value: "=='*${value}'", label: "Kết thúc với" },
        { value: "=='*${value}*'", label: "Chứa chuỗi" },
        { value: "=notlike='${value}'", label: "Không chứa chuỗi" },
        { value: "=isnull=", label: "Là rỗng" },
        { value: "=isnotnull=", label: "Là không rỗng" },
    ],
};

export interface FilterAttribute {
    name: string;
    label: string;
    type: AttributeType;
}

export interface FilterRule {
    attribute?: string;
    type?: AttributeType;
    operator?: string;
    value?: string;
}

interface FilterInlineProps {
    attributes: FilterAttribute[];
    rules: FilterRule[];
    setRules: (rules: FilterRule[]) => void;
}

export default function FilterInline({
    attributes,
    rules,
    setRules,
}: FilterInlineProps) {
    const addRule = () => setRules([...rules, {}]);
    const updateRule = (index: number, partial: Partial<FilterRule>) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], ...partial };
        setRules(newRules);
    };
    const removeRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="bg-slate-200 dark:bg-slate-700 w-full h-12 flex justify-center items-center mb-4 rounded-2xl font-medium">
                Bộ lọc nâng cao
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                {/* Filter Rules */}
                <div className={`space-y-3 ` + (rules.length === 0 ? "hidden" : "")}>
                    {rules.length > 0 && (
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">
                            Quy tắc ({rules.length})
                        </div>
                    )}

                    {rules.map((rule, index) => {
                        const selectedAttr = attributes.find(
                            (a) => a.name === rule.attribute,
                        );
                        const ops = selectedAttr
                            ? operators[selectedAttr.type as AttributeType]
                            : [];
                        const disableValue =
                            rule.operator === "=isnull=" || rule.operator === "=isnot null=";

                        return (
                            <div
                                key={index}
                                className="group flex gap-3 items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                            >
                                {/* Index Badge */}
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {index + 1}
                                    </span>
                                </div>

                                {/* Attribute Select */}
                                <div className="flex-1 min-w-0">
                                    <Select
                                        value={rule.attribute || ""}
                                        onValueChange={(val) => {
                                            const attr = attributes.find((a) => a.name === val)!;
                                            updateRule(index, {
                                                attribute: val,
                                                type: attr.type as AttributeType,
                                                operator: undefined,
                                                value: "",
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="w-full h-10 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-50">
                                            <SelectValue placeholder="Chọn thuộc tính" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {attributes.map((attr) => (
                                                <SelectItem key={attr.name} value={attr.name}>
                                                    {attr.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Operator Select */}
                                <div className="flex-1 min-w-0">
                                    <Select
                                        value={rule.operator || ""}
                                        onValueChange={(val) =>
                                            updateRule(index, { operator: val })
                                        }
                                        disabled={!rule.attribute}
                                    >
                                        <SelectTrigger className="w-full h-10 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-50 disabled:opacity-50">
                                            <SelectValue placeholder="Chọn cách lọc" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ops.map((op) => (
                                                <SelectItem key={op.value} value={op.value}>
                                                    {op.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Value Input */}
                                <div className="flex-1 min-w-0">
                                    <Input
                                        className="h-10 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        type={selectedAttr?.type === "number" ? "number" : "text"}
                                        value={rule.value || ""}
                                        disabled={!rule.operator || disableValue}
                                        onChange={(e) =>
                                            updateRule(index, { value: e.target.value })
                                        }
                                        placeholder="Nhập giá trị"
                                    />
                                </div>

                                {/* Delete */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-shrink-0 h-10 w-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeRule(index)}
                                >
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 dark:border-slate-700">
                    <Button
                        onClick={addRule}
                        className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm quy tắc
                    </Button>

                    <Button
                        onClick={() => setRules([])}
                        className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Xóa tất cả
                    </Button>
                </div>

                {/* Stats Footer */}
                {rules.length > 0 && (
                    <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 px-1">
                        {rules.filter((r) => r.operator).length} quy tắc đang hoạt động
                    </div>
                )}
            </div>
        </div>
    );
}
