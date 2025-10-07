import { Form } from "@/components/ui/form";
import { FormCheckbox, FormInput, FormSelect } from "@/utils/formUtil";
import { UserRequestStatus, type UserRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useUpdateUserVM } from "./UpdateUser.vm";

export const UpdateUserPage = () => {
    const { form, roles, onSubmit } = useUpdateUserVM();
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-7" />
                </Button>
                <h1 className="text-2xl font-semibold">Tạo mới người dùng</h1>
            </div>
            <Card className="max-w-2xl p-4 rounded-[24px]">
                <CardContent>
                    <Form {...form}>
                        <div className="flex flex-col gap-4">
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
                                disabled={true}
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
                            </div>
                            <FormSelect<UserRequest>
                                keyType="number"
                                title="Trạng thái"
                                options={Object.entries(UserRequestStatus).map(
                                    ([key, value]) => ({
                                        key: key,
                                        render: value,
                                    }),
                                )}
                                name="status"
                            />
                        </div>
                        <div className="mt-4 flex justify-end items-center">
                            <Button
                                onClick={() => form.handleSubmit(onSubmit)()}
                                className="h-14 bg-blue-500 rounded-xl text-lg hover:bg-blue-600"
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
