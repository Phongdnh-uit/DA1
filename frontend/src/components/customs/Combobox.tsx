// import { useState } from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Button } from "../ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "../ui/command";
// import { cn } from "@/lib/utils";
//
// interface SelectOption {
//     key: string | number;
//     render: React.ReactNode;
//     searchKey?: string | number;
// }
//
// interface SelectProps {
//     options: SelectOption[];
//     disabled?: boolean;
//     className?: string;
//     searchable?: boolean;
//     value: string | null;
//     onChange: (value: string) => void;
// }
//
// export const Combobox = ({
//     options,
//     disabled = false,
//     className,
//     value,
//     onChange,
//     searchable = false,
// }:SelectProps) => {
//     const [open, setOpen] = useState(false);
//     return (
//         <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//                 <Button
//                     disabled={disabled}
//                     variant="outline"
//                     role="combobox"
//                     className={cn(
//                         "!h-14 w-full text-lg rounded-2xl justify-between px-4 bg-white border-slate-200 transition-all duration-200",
//                         "hover:border-blue-500 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-500/20",
//                         !value && "text-muted-foreground",
//                         className,
//                     )}
//                 >
//                     <span className="truncate font-normal">
//                         {value != null
//                             ? options.find((opt) => String(opt.key) === String(value))
//                                 ?.render
//                             : "Chọn một mục"}
//                     </span>
//                     <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-blue-500 opacity-70" />
//                 </Button>
//             </PopoverTrigger>
//
//             <PopoverContent
//                 className="w-[--radix-popover-trigger-width] p-0 rounded-xl overflow-hidden shadow-2xl border-blue-100"
//                 align="start"
//             >
//                 <Command className="bg-white">
//                     {searchable && (
//                         <div className="flex items-center border-b border-blue-50 px-3 h-14">
//                             <CommandInput
//                                 placeholder="Tìm kiếm..."
//                                 className="w-full text-base focus:ring-0 border-none outline-none"
//                             />
//                         </div>
//                     )}
//                     <CommandList className="max-h-[300px] p-1">
//                         <CommandEmpty className="py-6 text-center text-sm text-slate-500">
//                             Không tìm thấy kết quả.
//                         </CommandEmpty>
//                         <CommandGroup>
//                             {options.map((option) => (
//                                 <CommandItem
//                                     key={option.key}
//                                     value={
//                                         option.searchKey
//                                             ? String(option.searchKey)
//                                             : String(option.key)
//                                     }
//                                     onSelect={() => {
//                                         onChange(String(option.key));
//                                         setOpen(false);
//                                     }}
//                                     className="flex items-center justify-between px-3 py-3 my-0.5 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 focus:bg-blue-50 group"
//                                 >
//                                     <div className="text-base text-slate-700 transition-colors">
//                                         {option.render}
//                                     </div>
//                                     <Check
//                                         className={cn(
//                                             "ml-2 h-5 w-5 text-blue-600 transition-opacity",
//                                             String(value) === String(option.key)
//                                                 ? "opacity-100"
//                                                 : "opacity-0",
//                                         )}
//                                     />
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// };
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface SelectOption {
    key: string | number;
    render: React.ReactNode;
    searchKey?: string | number;
}

interface SelectProps {
    options: SelectOption[];
    disabled?: boolean;
    className?: string;
    searchable?: boolean;
    value: string | null;
    onChange: (value: string) => void;
}

export const Combobox = ({
    options,
    disabled = false,
    className,
    value,
    onChange,
    searchable = false,
}: SelectProps) => {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "!h-14 w-full text-lg rounded-2xl justify-between px-4 transition-all duration-200",
                        // Light mode
                        "bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50/30",
                        // Dark mode 
                        "dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-blue-900/20",
                        "focus:ring-2 focus:ring-blue-500/20",
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <span className="truncate font-normal">
                        {value != null
                            ? options.find((opt) => String(opt.key) === String(value))
                                ?.render
                            : "Chọn một mục"}
                    </span>
                    <ProjectIcon className="ml-2 h-5 w-5 shrink-0 text-blue-500 opacity-70 dark:text-blue-400" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0 rounded-xl overflow-hidden shadow-2xl border-blue-100 dark:border-slate-800 dark:bg-slate-950"
                align="start"
            >
                <Command className="bg-white dark:bg-slate-950">
                    {searchable && (
                        <div className="flex items-center border-b border-blue-50 dark:border-slate-800 px-3 h-14">
                            <CommandInput
                                placeholder="Tìm kiếm..."
                                className="w-full text-base focus:ring-0 border-none outline-none dark:text-slate-200"
                            />
                        </div>
                    )}
                    <CommandList className="max-h-[300px] p-1">
                        <CommandEmpty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Không tìm thấy kết quả.
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.key}
                                    value={
                                        option.searchKey
                                            ? String(option.searchKey)
                                            : String(option.key)
                                    }
                                    onSelect={() => {
                                        onChange(String(option.key));
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-3 my-0.5 rounded-lg cursor-pointer transition-colors",
                                        // Hover & Focus states
                                        "hover:bg-blue-50 focus:bg-blue-50 dark:hover:bg-slate-900 dark:focus:bg-slate-900 group"
                                    )}
                                >
                                    <div className="text-base text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {option.render}
                                    </div>
                                    <Check
                                        className={cn(
                                            "ml-2 h-5 w-5 text-blue-600 dark:text-blue-400 transition-opacity",
                                            String(value) === String(option.key)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

// Helper component for the icon
const ProjectIcon = ({ className }: { className?: string }) => (
    <ChevronsUpDown className={className} />
);
