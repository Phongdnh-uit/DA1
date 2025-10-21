import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
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
}

export function FormInput<K>({
    title,
    name,
    placeholder,
    className,
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
                    <FormLabel className="text-xl text-blue-500">{title}</FormLabel>
                    <FormControl>
                        <div
                            className={cn(
                                "relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring error-display",
                                className,
                            )}
                        >
                            <Input
                                type={type}
                                placeholder={placeholder}
                                className="border-0 focus-visible:ring-0 shadow-none w-full rounded-[24px] h-16 placeholder:text-lg !text-lg"
                                {...field}
                                {...props}
                                onChange={(e) => {
                                    if (type === "number") {
                                        field.onChange(Number(e.target.value));
                                    } else {
                                        field.onChange(e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </FormControl>
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
}

export function FormCheckbox<K>({
    title,
    name,
    className,
    direction,
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
                    <FormLabel className="text-xl text-blue-500">{title}</FormLabel>
                    <FormControl>
                        <div>
                            <Checkbox
                                checked={field.value}
                                className={cn(
                                    "size-5 rounded-[6px] bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent",
                                    className,
                                )}
                                splashClassName="bg-blue-500"
                                onCheckedChange={field.onChange}
                                {...props}
                            />
                        </div>
                    </FormControl>
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
}

export function FormSelect<K>({
    title,
    name,
    className,
    keyType,
    options,
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
                    <FormLabel className="text-xl text-blue-500">{title}</FormLabel>
                    <FormControl>
                        <Select
                            disabled={disabled}
                            value={field.value ? String(field.value) : undefined}
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
                                className={cn("!h-16 w-full text-lg rounded-[24px]", className)}
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
    className?: string;
}

export function FormEditor<K>({
    title,
    name,
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
                    <FormLabel className="text-xl text-blue-500">{title}</FormLabel>
                    <FormControl>
                        <div className={cn("rounded-[24px]", className)}>
                            <RichTextEditor
                                value={field.value || ""}
                                placeholder={placeholder}
                                onChange={(v) => field.onChange(v)}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
