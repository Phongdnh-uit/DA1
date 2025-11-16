import { Form } from "@/components/ui/form";
import { useCreatePermissionVM } from "./CreatePermission.vm";
import { PermissionRequestMethod, type PermissionRequest } from "@/types";
import { Card } from "@/components/ui/card";
import { FormInput, FormSelect } from "@/utils/formUtil";
import { Info } from "lucide-react";
import { MotionButton } from "@/components/general/MotionShadcn";
import { BackButton } from "@/components/general/BackButton";

export default function CreatePermissionPage() {
    const { form, onSubmit } = useCreatePermissionVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Tạo Quyền Hạn Mới
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Định nghĩa quyền hạn mới cho ứng dụng của bạn
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-6">
                            <FormInput<PermissionRequest>
                                name="name"
                                title="Tên Quyền"
                                placeholder="Nhập tên quyền"
                                required={true}
                            />
                            <FormInput<PermissionRequest>
                                name="resource"
                                title="Tài Nguyên"
                                placeholder="Nhập tài nguyên"
                                required={true}
                            />
                            <FormInput<PermissionRequest>
                                name="urlPattern"
                                title="Mẫu URL"
                                placeholder="Nhập mẫu URL"
                                required={true}
                            />
                            <FormSelect<PermissionRequest>
                                name="method"
                                required={true}
                                title="Phương Thức"
                                options={Object.values(PermissionRequestMethod).map(
                                    (method) => ({
                                        key: method,
                                        render: method,
                                    }),
                                )}
                            />
                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <MotionButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                    className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                    size="lg"
                                >
                                    Tạo Quyền Mới
                                </MotionButton>
                                <MotionButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
                <div className="space-y-6 max-w-lg">
                    {/* Info Card */}
                    <Card className="p-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                    Mẹo Nhanh
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200">
                                    Tên quyền hạn nên mô tả hành động. Ví dụ: "Xem Người Dùng",
                                    "Tạo Bài Viết"
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-border/50">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-foreground mb-2">
                                    Ví dụ Quyền Hạn
                                </h4>
                                <div className="space-y-3">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">Tên:</span> Xem Người
                                            Dùng
                                        </p>
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">Resource:</span> users
                                        </p>
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">URL:</span> /api/users
                                        </p>
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">Method:</span> GET
                                        </p>
                                    </div>

                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">Tên:</span> Tạo Bài Viết
                                        </p>
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">Resource:</span> posts
                                        </p>
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">URL:</span> /api/posts
                                        </p>
                                        <p className="font-mono text-muted-foreground">
                                            <span className="text-foreground">Method:</span> POST
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
