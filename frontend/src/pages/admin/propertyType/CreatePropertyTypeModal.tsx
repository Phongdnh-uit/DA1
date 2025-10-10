import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Form,
} from "@/components/ui/form";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useCreatePropertyTypeVM } from "./CreatePropertyType.vm";
import { FormInput } from "@/utils/formUtil";
import type { PropertyTypeRequest } from "@/types";

interface CreatePropertyTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePropertyTypeModal({
    open,
    onOpenChange,
}: CreatePropertyTypeModalProps) {
    const { form, onSubmit } = useCreatePropertyTypeVM();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!max-w-lg">
                <DialogHeader>Tạo mới loại hình bất động sản</DialogHeader>
                <Form {...form}>
                    <FormInput<PropertyTypeRequest>
                        name="name"
                        title="Tên loại hình"
                        placeholder="Nhập tên loại hình"
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
