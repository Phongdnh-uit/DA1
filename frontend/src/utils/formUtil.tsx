import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface FormInputProps<K> {
    title?: string;
    name: keyof K & string;
    placeholder?: string;
    type?: string;
    className?: string;
    description?: string;
    required?: boolean;
}

export function FormInput<K>({
    title,
    name,
    placeholder,
    className,
    description,
    required,
    type,
    ...props
}: FormInputProps<K> & React.InputHTMLAttributes<HTMLInputElement>) {
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
                            <Input
                                id={name}
                                type={type}
                                placeholder={placeholder}
                                className="border-0 focus-visible:ring-0 shadow-none w-full rounded-[24px] h-14 placeholder:text-lg !text-lg"
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
}: FormCheckboxProps<K>) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem
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
                                    "size-5 rounded-[6px] bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent",
                                    className,
                                )}
                                onCheckedChange={field.onChange}
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

interface FormSelectProps<K> {
    title?: string;
    name: keyof K & string;
    options: { key: string; render: React.ReactNode }[];
    keyType?: "string" | "number";
    className?: string;
    disabled?: boolean;
    description?: string;
    required?: boolean;
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
    ...props
}: FormSelectProps<K>) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-col gap-2")}>
                    <FormLabel
                        htmlFor={name}
                        className={"text-xl flex tems-center gap-1"}
                    >
                        {title}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Select
                            disabled={disabled}
                            value={field.value != null ? String(field.value) : ""}
                            onValueChange={(value) => {
                                if (keyType === "number") {
                                    field.onChange(Number(value));
                                } else {
                                    field.onChange(value);
                                }
                            }}
                            {...props}
                        >
                            <SelectTrigger
                                id={name}
                                className={cn(
                                    "!h-14 w-full text-lg rounded-2xl hover:border-primary",
                                    className,
                                )}
                                name={name}
                            >
                                <SelectValue
                                    className="!text-lg"
                                    placeholder={<span className="text-lg">Chọn một mục</span>}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option, id) => (
                                    <SelectItem key={id} value={option.key}>
                                        {option.render}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormDescription className="text-base">{description}</FormDescription>
                    <FormMessage />
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
}

export function FormEditor<K>({
    title,
    name,
    required,
    description,
    placeholder,
    className,
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
