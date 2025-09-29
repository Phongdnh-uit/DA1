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
import { XIcon } from "lucide-react";

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
    { value: "==${value}", label: "Bằng" },
    { value: "!=${value}", label: "Không bằng" },
    { value: "==${value}*", label: "Bắt đầu với" },
    { value: "==*${value}", label: "Kết thúc với" },
    { value: "=like=${value}", label: "Chứa chuỗi" },
    { value: "=notlike=${value}", label: "Không chứa chuỗi" },
    { value: "=isnull=", label: "Là rỗng" },
    { value: "=isnotnull=", label: "Là không rỗng" },
  ],
};

interface Attribute {
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
  attributes: Attribute[];
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
      <div className="bg-zinc-100 dark:bg-zinc-700 w-full h-12 flex justify-center items-center mb-4 rounded-2xl font-medium">
        Bộ lọc nâng cao
      </div>

      <div className="space-y-4">
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
              className="grid grid-cols-[1fr_1fr_1fr_40px] gap-2 items-center"
            >
              {/* Field */}
              <Select
                value={rule.attribute}
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
                <SelectTrigger className="w-full">
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

              {/* Operator */}
              <Select
                value={rule.operator}
                onValueChange={(val) => updateRule(index, { operator: val })}
                disabled={!rule.attribute}
              >
                <SelectTrigger className="w-full">
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

              {/* Value */}
              <Input
                className="w-full min-w-0"
                type={selectedAttr?.type}
                value={rule.value || ""}
                disabled={!rule.operator || disableValue}
                onChange={(e) => updateRule(index, { value: e.target.value })}
                placeholder="Input value"
              />
              <Button
                variant="ghost"
                size="icon"
                className="w-full bg-transparent border border-rose-300 text-rose-500 hover:bg-rose-50"
                onClick={() => removeRule(index)}
              >
                <XIcon />
              </Button>
            </div>
          );
        })}

        <Button
          onClick={addRule}
          className="bg-transparent border-dashed border-blue-300 text-blue-500 hover:bg-blue-50 border w-full h-12 dark:border-blue-500 dark:hover:bg-blue-800"
        >
          + Thêm rule
        </Button>
        <Button
          onClick={() => setRules([])}
          className="bg-transparent border-dashed border-violet-300 text-violet-500 hover:bg-violet-50 border w-full h-12 dark:border-violet-500 dark:hover:bg-violet-800"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
