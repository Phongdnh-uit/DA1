import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { FormInput } from "@/utils/formUtil";
import type { ProvinceRequest, WardRequest } from "@/types";
import useCreateWardVM from "./CreateWard.vm";

interface CreateWardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateWardModal({
    open,
    onOpenChange,
}: CreateWardModalProps) {
    const { form, onSubmit } = useCreateWardVM();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!max-w-lg">
                <DialogHeader>Tạo quyền mới</DialogHeader>
                <Form {...form}>
                    <FormInput<WardRequest>
                        name="name"
                        placeholder="Nhập tên"
                        title="Tên phường xã"
                    />
                    <FormInput<WardRequest>
                        name="codeName"
                        placeholder="Nhập tên code"
                        title="Tên code"
                    />
                    <FormInput<WardRequest>
                        name="provinceId"
                        placeholder="Nhập mã điện thoại"
                        title="Mã điện thoại"
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
