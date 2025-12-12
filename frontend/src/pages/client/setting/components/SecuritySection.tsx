"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle } from "lucide-react";
import { useChangePassword } from "@/services/auth/auth";
import { useForm } from "react-hook-form";
import type { ChangePasswordRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordBody } from "@/services/auth/auth.zod";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { FormInput } from "@/utils/formUtil";
import z from "zod";

export function SecuritySection() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");

    const changePasswordForm = useForm<
        ChangePasswordRequest & {
            confirmPassword: string;
        }
    >({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(
            z
                .object({
                    ...changePasswordBody.shape,
                    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
                })
                .refine((data) => data.newPassword === data.confirmPassword, {
                    message: "Mật khẩu xác nhận không khớp",
                }),
        ),
    });

    const changePasswordMutation = useChangePassword({
        mutation: {
            onSuccess: () => {
                toast.success("Đổi mật khẩu thành công!");
                changePasswordForm.reset();
                setConfirmPassword("");
                setShowPasswordForm(false);
            },
        },
    });

    const onSubmit = (data: ChangePasswordRequest) => {
        console.log(data);
        console.log(confirmPassword);
        console.log(data.newPassword);
        if (data.newPassword !== data.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        changePasswordMutation.mutate({
            data,
        });
    };

    return (
        <Card id="security" className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Bảo mật
            </h2>

            <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-foreground text-sm">
                            Đăng nhập gần đây
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Hôm nay lúc 2:35 chiều từ Chrome trên macOS
                        </p>
                    </div>
                </div>

                <div className="border-t border-border pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            {" "}
                            <p className="font-medium text-foreground">Mật khẩu</p>
                            <p className="text-sm text-muted-foreground">
                                Đổi lần gần nhất cách đây 3 tháng
                            </p>
                        </div>
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Button
                                variant="outline"
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="border-border hover:bg-muted"
                            >
                                {showPasswordForm ? "Hủy" : "Đổi mật khẩu"}
                            </Button>
                        </motion.div>
                    </div>

                    {showPasswordForm && (
                        <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
                            <Form {...changePasswordForm}>
                                <FormInput<ChangePasswordRequest>
                                    className="bg-white"
                                    name="oldPassword"
                                    title="Mật khẩu hiện tại"
                                    placeholder="Nhập mật khẩu hiện tại"
                                    type="password"
                                />
                                <FormInput<ChangePasswordRequest>
                                    name="newPassword"
                                    className="bg-white"
                                    title="Mật khẩu mới"
                                    placeholder="Nhập mật khẩu mới"
                                    type="password"
                                />
                                <FormInput<ChangePasswordRequest & { confirmPassword: string }>
                                    name="confirmPassword"
                                    className="bg-white"
                                    title="Xác nhận mật khẩu mới"
                                    placeholder="Xác nhận mật khẩu mới"
                                    type="password"
                                />
                                <Button
                                    onClick={() => changePasswordForm.handleSubmit(onSubmit)()}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    Cập nhật mật khẩu
                                </Button>
                            </Form>
                        </div>
                    )}
                </div>

                <div className="border-t border-border pt-6">
                    <div>
                        <p className="font-medium text-foreground">
                            Xác thực hai bước (2FA)
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Thêm một lớp bảo mật bổ sung cho tài khoản của bạn
                        </p>

                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="w-fit"
                        >
                            <Button
                                variant="outline"
                                className="border-border hover:bg-muted bg-transparent"
                            >
                                Kích hoạt 2FA
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <div className="border-t border-border pt-6">
                    <div>
                        <p className="font-medium text-foreground">
                            Phiên đăng nhập đang hoạt động
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Quản lý các thiết bị bạn đang đăng nhập
                        </p>

                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="w-fit"
                        >
                            <Button
                                variant="outline"
                                className="border-border hover:bg-muted bg-transparent"
                            >
                                Xem tất cả phiên
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
