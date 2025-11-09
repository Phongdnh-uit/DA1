import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { FormInput } from "@/utils/formUtil";
import type { ProvinceRequest } from "@/types";
import useCreateProvinceVM from "./CreateProvince.vm";

interface CreateProvinceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateProvinceModal({
    open,
    onOpenChange,
}: CreateProvinceModalProps) {
    const { form, onSubmit } = useCreateProvinceVM();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!max-w-lg">
                <DialogHeader>Tạo quyền mới</DialogHeader>
                <Form {...form}>
                    <FormInput<ProvinceRequest>
                        name="name"
                        placeholder="Nhập tên"
                        title="Tên tỉnh/thành phố"
                    />
                    <FormInput<ProvinceRequest>
                        name="code"
                        placeholder="Nhập tên code"
                        title="Tên code"
                    />
                    <FormInput<ProvinceRequest>
                        name="type"
                        placeholder="Nhập loại phân vùng"
                        title="Loại phân vùng"
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
