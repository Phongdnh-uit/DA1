import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
} from "@/components/ui/form";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import useUpdatePermissionVM from "./UpdatePermission.vm";
import type { PermissionRequest, PermissionResponseDTO } from "@/types";
import { FormInput, FormSelect } from "@/utils/formUtil";

interface CreatePermissionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: PermissionResponseDTO;
}

export default function UpdatePermissionModal({
    open,
    onOpenChange,
    data,
}: CreatePermissionModalProps) {
    const { form, onSubmit } = useUpdatePermissionVM(data);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!max-w-lg">
                <DialogTitle>Update permission</DialogTitle>
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
                            { key: "READ", render: "Xem" },
                            { key: "CREATE", render: "Thêm" },
                            { key: "UPDATE", render: "Cập nhật" },
                            { key: "DELETE", render: "Xóa" },
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
