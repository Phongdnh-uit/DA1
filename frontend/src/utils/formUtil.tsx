import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface FormInputProps<K> {
    title?: string;
    name: keyof K & string;
    placeholder?: string;
    type?: string;
    className?: string;
    description?: string;
    required?: boolean;
    passwordSeeIcon?: boolean;
}

export function FormInput<K>({
    title,
    name,
    placeholder,
    className,
    description,
    required,
    passwordSeeIcon,
    type,
    ...props
}: FormInputProps<K> & React.InputHTMLAttributes<HTMLInputElement>) {
    const form = useFormContext();

    // State để quản lý việc ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // Xác định type thực tế của input
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                    <FormLabel
                        htmlFor={name}
                        className={"text-xl flex items-center gap-1"}
                    >
                        {title}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div
                            className={cn(
                                "relative flex items-center rounded-2xl border backdrop-blur-sm",
                                "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30",
                                "focus-within:scale-[1.02] transition-all",
                                "hover:border-primary",
                                "aria-invalid:border-rose-500 aria-invalid:ring-rose-500/30",
                                className,
                            )}
                        >
                            <Input
                                id={name}
                                type={inputType}
                                placeholder={placeholder}
                                className={
                                    "disabled:opacity-70 border-0 focus-visible:ring-0 shadow-none w-full rounded-[24px] h-14 placeholder:text-lg !text-lg" +
                                    (isPassword && passwordSeeIcon ? " pr-12" : "")
                                }
                                {...field}
                                {...props}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(
                                        type === "number" && value !== ""
                                            ? Number(value)
                                            : value || undefined,
                                    );
                                }}
                            />

                            {/* Chỉ hiện con mắt nếu input này là dạng password */}
                            {isPassword && passwordSeeIcon && (
                                <button
                                    type="button" // Quan trọng: tránh submit form khi click
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </FormControl>
                    <FormDescription className="text-base">{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface FormCheckboxProps<K> {
    title?: string;
    name: keyof K & string;
    direction?: "row" | "column";
    className?: string;
    description?: string;
    required?: boolean;
}

export function FormCheckbox<K>({
    title,
    name,
    required,
    className,
    direction,
    description,
    ...props
}: FormCheckboxProps<K> & React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div
                        className={cn({
                            "flex flex-col gap-2": direction === "column",
                            "flex flex-row items-center gap-2": direction === "row",
                        })}
                    >
                        <FormLabel
                            htmlFor={name}
                            className={"text-xl flex tems-center gap-1"}
                        >
                            {title}
                            {required && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                            <div>
                                <Checkbox
                                    id={name}
                                    checked={field.value}
                                    className={cn(
                                        "size-5 rounded-[6px] bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent aria-invalid:border-rose-500 aria-invalid:ring-rose-500/30",
                                        className,
                                    )}
                                    onCheckedChange={field.onChange}
                                    {...props}
                                />
                            </div>
                        </FormControl>
                    </div>
                    <FormDescription className="text-base">{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface FormSelectProps<K> {
    title?: string;
    name: keyof K & string;
    options: { key: string; render: React.ReactNode; searchKey?: string }[];
    keyType?: "string" | "number";
    className?: string;
    disabled?: boolean;
    description?: string;
    required?: boolean;
    searchable?: boolean;
}

export function FormSelect<K>({
    title,
    name,
    className,
    keyType,
    options,
    required,
    description,
    disabled = false,
    searchable = false,
}: FormSelectProps<K>) {
    const form = useFormContext();
    const [open, setOpen] = useState(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xl flex items-center gap-1">
                        {title}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    name={name}
                                    disabled={disabled}
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "!h-14 w-full text-lg rounded-2xl justify-between px-4 bg-white border-slate-200 transition-all duration-200",
                                        "hover:border-blue-500 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-500/20",
                                        !field.value && "text-muted-foreground",
                                        className,
                                    )}
                                >
                                    <span className="truncate font-normal">
                                        {field.value != null
                                            ? options.find(
                                                (opt) => String(opt.key) === String(field.value),
                                            )?.render
                                            : "Chọn một mục"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-blue-500 opacity-70" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-[--radix-popover-trigger-width] p-0 rounded-xl overflow-hidden shadow-2xl border-blue-100"
                            align="start"
                        >
                            <Command className="bg-white">
                                {searchable && (
                                    <div className="flex items-center border-b border-blue-50 px-3 h-14">
                                        <CommandInput
                                            placeholder="Tìm kiếm..."
                                            className="w-full text-base focus:ring-0 border-none outline-none"
                                        />
                                    </div>
                                )}
                                <CommandList className="max-h-[300px] p-1">
                                    <CommandEmpty className="py-6 text-center text-sm text-slate-500">
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
                                                    const val =
                                                        keyType === "number"
                                                            ? Number(option.key)
                                                            : option.key;
                                                    field.onChange(val);
                                                    setOpen(false);
                                                }}
                                                className="flex items-center justify-between px-3 py-3 my-0.5 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 focus:bg-blue-50 group"
                                            >
                                                <div className="text-base text-slate-700 transition-colors">
                                                    {option.render}
                                                </div>
                                                <Check
                                                    className={cn(
                                                        "ml-2 h-5 w-5 text-blue-600 transition-opacity",
                                                        String(field.value) === String(option.key)
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

                    {description && (
                        <FormDescription className="text-base text-slate-500">
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage className="text-sm font-medium text-red-500" />
                </FormItem>
            )}
        />
    );
}

interface FormEditorProps<K> {
    title?: string;
    name: keyof K & string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    description?: string;
    className?: string;
    disabled?: boolean;
}

export function FormEditor<K>({
    title,
    name,
    required,
    description,
    placeholder,
    className,
    disabled,
}: FormEditorProps<K>) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-2 h-full">
                    <FormLabel className={"text-xl flex tems-center gap-1"}>
                        {title}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className={cn("rounded-2xl", className)}>
                            <RichTextEditor
                                key={form.formState.submitCount} // Reset editor on submit
                                disable={disabled}
                                className="h-full"
                                value={field.value || ""}
                                placeholder={placeholder}
                                onChange={(v) => field.onChange(v)}
                            />
                        </div>
                    </FormControl>
                    <FormDescription className="text-base">{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function FormTextArea<K>({
    title,
    name,
    placeholder,
    className,
    description,
    required,
    ...props
}: FormInputProps<K> & React.InputHTMLAttributes<HTMLTextAreaElement>) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                    <FormLabel
                        htmlFor={name}
                        className={"text-xl flex tems-center gap-1"}
                    >
                        {title}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div
                            className={cn(
                                "relative flex items-center rounded-2xl border backdrop-blur-sm",
                                "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30",
                                "focus-within:scale-102 transition-all",
                                "hover:border-primary",
                                "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed error-display",
                                className,
                            )}
                        >
                            <Textarea
                                id={name}
                                placeholder={placeholder}
                                className="border-0 focus-visible:ring-0 shadow-none w-full rounded-[24px] h-full placeholder:text-lg !text-lg resize-none"
                                {...field}
                                {...props}
                            />
                        </div>
                    </FormControl>
                    <FormDescription className="text-base">{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
