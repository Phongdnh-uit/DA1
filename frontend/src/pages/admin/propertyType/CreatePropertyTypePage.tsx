import { Form } from "@/components/ui/form";
import { useCreatePropertyTypeVM } from "./CreatePropertyType.vm";
import { FormInput } from "@/utils/formUtil";
import type { PropertyTypeRequest } from "@/types";
import { BackButton } from "@/components/general/BackButton";
import { Card } from "@/components/ui/card";
import { MotionButton } from "@/components/customs/MotionButton";

export default function CreatePropertyTypePage() {
    const { form, onSubmit } = useCreatePropertyTypeVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Tạo Loại Hình Mới
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Vui lòng điền thông tin dưới đây để tạo loại hình mới.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-6">
                            <FormInput<PropertyTypeRequest>
                                name="name"
                                title="Tên loại hình"
                                placeholder="Nhập tên loại hình"
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
                                    Tạo Loại Hình Mới
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
