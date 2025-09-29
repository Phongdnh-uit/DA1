import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { useCreatePermissionVM } from "./CreatePermission.vm";
import { Input } from "@/components/ui/input";
import { Select } from "@radix-ui/react-select";
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";

interface CreatePermissionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePermissionModal({
    open,
    onOpenChange,
}: CreatePermissionModalProps) {
    const { form, onSubmit } = useCreatePermissionVM();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!max-w-lg">
                <DialogHeader>Tạo quyền mới</DialogHeader>
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel>Tên quyền</FormLabel>
                                <FormControl className="col-span-3">
                                    <Input placeholder="Nhập tên quyền" {...field} />
                                </FormControl>
                                <FormDescription className="col-span-4" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="resource"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel>Tên tài nguyên</FormLabel>
                                <FormControl className="col-span-3">
                                    <Input placeholder="Nhập tài nguyên" {...field} />
                                </FormControl>
                                <FormDescription className="col-span-4" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="action"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel>Tên tài nguyên</FormLabel>
                                <FormControl className="col-span-3">
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Chọn hoạt động" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="READ">Xem</SelectItem>
                                            <SelectItem value="CREATE">Thêm</SelectItem>
                                            <SelectItem value="UPDATE">Cập nhật</SelectItem>
                                            <SelectItem value="DELETE">Xóa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className="col-span-4" />
                            </FormItem>
                        )}
                    />
                </Form>
                <DialogFooter>
                    <div className="flex w-full justify-end gap-2">
                        <RippleButton variant={"destructive"}>Thoát</RippleButton>
                        <RippleButton
                            onClick={() => {
                                form.handleSubmit(onSubmit)();
                                onOpenChange(false);
                            }}
                        >
                            Thêm
                        </RippleButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
