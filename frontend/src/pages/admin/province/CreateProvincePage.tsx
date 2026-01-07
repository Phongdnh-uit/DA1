import type { ProvinceRequest } from "@/types";
import useCreateProvinceVM from "./CreateProvince.vm";
import { BackButton } from "@/components/general/BackButton";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/utils/formUtil";
import { MotionButton } from "@/components/customs/MotionButton";

export default function CreateProvincePage() {
    const { form, onSubmit } = useCreateProvinceVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Tạo Tỉnh/Thành Phố Mới
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Vui lòng điền thông tin dưới đây để tạo tỉnh/thành phố mới.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-6">
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
                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <MotionButton
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                    className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                    size="lg"
                                    disabled={!form.formState.isDirty}
                                >
                                    Tạo Tỉnh/Thành Phố Mới
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
