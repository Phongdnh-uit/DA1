import { Form } from "@/components/ui/form";
import { useCreateUserVM } from "./CreateUser.vm";
import { FormCheckbox, FormInput, FormSelect } from "@/utils/formUtil";
import { UserRequestStatus, type UserRequest } from "@/types";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/general/BackButton";
import { MotionButton } from "@/components/general/MotionShadcn";

export const CreateUserPage = () => {
    const { form, roles, onSubmit } = useCreateUserVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Tạo Người Dùng Mới
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Vui lòng điền thông tin người dùng bên dưới để tạo tài khoản.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-6">
                            <FormInput<UserRequest>
                                title="Họ và tên"
                                placeholder="Nhập họ và tên"
                                name="fullName"
                            />
                            <FormInput<UserRequest>
                                title="Email"
                                placeholder="Nhập email"
                                name="email"
                            />
                            <FormInput<UserRequest>
                                title="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                name="phone"
                            />
                            <FormInput<UserRequest>
                                title="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                name="password"
                            />
                            <FormSelect<UserRequest>
                                keyType="number"
                                title="Vai trò"
                                options={roles.map((role) => ({
                                    render: role.name,
                                    key: "" + role.id,
                                }))}
                                name="roleId"
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-4">
                                <FormCheckbox<UserRequest>
                                    title="Xác nhận email"
                                    name="emailVerified"
                                    direction="row"
                                />
                                <FormCheckbox<UserRequest>
                                    title="Xác nhận số điện thoại"
                                    name="phoneVerified"
                                    direction="row"
                                />
                            </div>{" "}
                        </div>
                        <FormSelect<UserRequest>
                            keyType="string"
                            title="Trạng thái"
                            options={Object.entries(UserRequestStatus).map(
                                ([key, value]) => ({
                                    key: key,
                                    render: value,
                                }),
                            )}
                            name="status"
                        />
                        <div className="flex gap-3 pt-4">
                            <MotionButton
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                onClick={() => form.handleSubmit(onSubmit)()}
                                className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                size="lg"
                            >
                                Tạo Người Dùng
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
                    </Form>
                </Card>
            </div>
        </main>
    );
};
