import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Form,
} from "@/components/ui/form";
import { useCreatePermissionVM } from "./CreatePermission.vm";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { FormInput, FormSelect } from "@/utils/formUtil";
import type { PermissionRequest } from "@/types";

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
                    <FormInput<PermissionRequest>
                        name="name"
                        placeholder="Nhập tên quyền"
                        title="Tên quyền"
                    />
                    <FormInput<PermissionRequest>
                        name="resource"
                        placeholder="Nhập tên tài nguyên"
                        title="Tên tài nguyên"
                    />
                    <FormSelect<PermissionRequest>
                        name="action"
                        title="Hành động"
                        options={[
                            {key: 'READ', render: 'Xem'},
                            {key: 'CREATE', render: 'Thêm'},
                            {key: 'UPDATE', render: 'Cập nhật'},
                            {key: 'DELETE', render: 'Xóa'},
                        ]}
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
