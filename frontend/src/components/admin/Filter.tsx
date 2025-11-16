import { Button } from "../ui/button";
import SearchBar from "./SearchBar";
import { MultiSortInline, type SortOption, type SortRule } from "./MultiSort";
import { useState } from "react";
import FilterInline, {
    type FilterAttribute,
    type FilterRule,
} from "./FilterInline";
import { ArrowRight, FilterIcon, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface FilterProps {
    onApply: (sort: string[], filter: string) => void;
    filterAttributes?: FilterAttribute[];
    sortAttributes?: SortOption[];
}

export default function Filter({
    onApply,
    filterAttributes,
    sortAttributes,
}: FilterProps) {
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
        <div className="mx-auto space-y-6">
            {/* Filter / Sort Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Top Bar */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between ">
                    <div className="flex gap-3 w-full sm:w-auto flex-1">
                        <div className="flex-1 sm:w-64">
                            <SearchBar className="h-10" onSearch={() => { }} />
                        </div>

                        <Button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`flex-shrink-0 h-10 px-4 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${showFilter
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50 dark:bg-slate-700 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-slate-600"
                                }`}
                        >
                            <FilterIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Lọc nâng cao</span>
                        </Button>
                    </div>

                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="w-full sm:w-auto"
                    >
                        <Button
                            onClick={onHandleApply}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg h-10 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            <span>Áp dụng</span>
                        </Button>
                    </motion.div>
                </div>

                {/* Filter / Sort Content */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: showFilter ? 1 : 0,
                        height: showFilter ? "auto" : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Filter Rules */}
                        <div className="lg:col-span-2 space-y-4">
                            <FilterInline
                                rules={filterRules}
                                setRules={setFilterRules}
                                attributes={filterAttributes || []}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <MultiSortInline
                                options={sortAttributes || []}
                                value={sortRules}
                                onChange={setSortRules}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
