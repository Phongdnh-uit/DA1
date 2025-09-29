import { Button } from "../ui/button";
import SearchBar from "./SearchBar";
import { MultiSortInline, type SortRule } from "./MultiSort";
import { useState } from "react";
import FilterInline, { type FilterRule } from "./FilterInline";
import { FilterIcon } from "lucide-react";

interface FilterProps {
  onApply: (sort: string[], filter: string) => void;
}

export default function Filter({ onApply }: FilterProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [sortRules, setSortRules] = useState<SortRule[]>([]);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const onHandleApply = () => {
    // sort order
    const sort = sortRules
      .filter((r) => r.key !== undefined && r.direction !== undefined)
      .map((r) => `${r.key},${r.direction}`);
    // filter order
    const filterStrings = filterRules
      .filter(
        (r) =>
          r.attribute !== undefined &&
          r.operator !== undefined &&
          r.value !== undefined,
      )
      .map((r) => {
        let value = "";
        if (r.type !== "text") {
          value = `${r.attribute}${r.operator}${r.value}`;
        } else {
          value = `${r.attribute}${r.operator}`;
          value = value.replaceAll("${value}", r.value as string);
        }
        return value;
      });
    const filter = filterStrings.join(";");
    onApply(sort, filter);
  };
  return (
    <div className="bg-white dark:bg-zinc-900 w-full rounded-2xl px-4">
      <div className="w-full h-26 flex items-center justify-between">
        <div className="flex items-center gap-4 justify-start">
          <div className="w-fit sm:w-md">
            <SearchBar className="h-10" onSearch={() => {}} />
          </div>
          <Button
            className="sm:flex-none min-w-[80px] h-[40px] bg-transparent border border-blue-300 text-blue-500 hover:bg-blue-50"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FilterIcon className="size-5 mr-1" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
        <Button onClick={() => onHandleApply()}>Apply</Button>
      </div>
      <div
        className={
          showFilter
            ? "grid grid-cols-1 gap-4 sm:grid-cols-[1.5fr_1fr]"
            : "hidden"
        }
      >
        <FilterInline
          rules={filterRules}
          setRules={setFilterRules}
          attributes={[
            { name: "id", label: "Id", type: "number" },
            { name: "name", label: "Name", type: "text" },
            { name: "resource", label: "Resource", type: "text" },
            { name: "action", label: "Action", type: "text" },
            { name: "createdAt", label: "Created At", type: "date" },
            { name: "updatedAt", label: "Updated At", type: "date" },
          ]}
        />
        <MultiSortInline
          options={[
            { key: "name", label: "Name" },
            { key: "resource", label: "Resource" },
            { key: "action", label: "Action" },
            { key: "createdAt", label: "Created At" },
            { key: "updatedAt", label: "Updated At" },
          ]}
          value={sortRules}
          onChange={setSortRules}
        />
      </div>
    </div>
  );
}
