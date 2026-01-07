import { Form } from "@/components/ui/form";
import { FormInput } from "@/utils/formUtil";
import type { WardRequest } from "@/types";
import { BackButton } from "@/components/general/BackButton";
import { Card } from "@/components/ui/card";
import useUpdateWardVM from "./UpdateWard.vm";
import { MotionButton } from "@/components/customs/MotionButton";

export default function UpdateWardPage() {
    const { form, onSubmit } = useUpdateWardVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Cập nhật phường/xã
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Vui lòng nhập đầy đủ thông tin bên dưới để cập nhật phường/xã mới.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-6">
                            <FormInput<WardRequest>
                                name="name"
                                placeholder="Nhập tên"
                                title="Tên phường xã"
                            />
                            <FormInput<WardRequest>
                                name="type"
                                placeholder="Nhập loại"
                                title="Loại"
                            />
                            <FormInput<WardRequest>
                                name="code"
                                placeholder="Nhập tên code"
                                title="Tên code"
                            />
                            <FormInput<WardRequest>
                                name="provinceId"
                                placeholder="Nhập mã tỉnh/thành phố"
                                title="Mã Tỉnh/Thành Phố"
                            />
                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                {" "}
                                <MotionButton
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                    className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                    size="lg"
                                    disabled={!form.formState.isDirty}
                                >
                                    Cập Nhật Phường/Xã
                                </MotionButton>
                                <MotionButton
                                    variant="outline"
                                    className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                    size="lg"
                                    onClick={() => form.reset()}
                                >
                                    Hủy Bỏ
                                </MotionButton>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </main>
    );
}
