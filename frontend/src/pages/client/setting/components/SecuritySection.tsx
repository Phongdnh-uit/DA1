"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertCircle } from "lucide-react";
import { useChangePassword } from "@/services/auth/auth";
import { useForm } from "react-hook-form";
import type { ChangePasswordRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordBody } from "@/services/auth/auth.zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import { motion } from "motion/react";

export function SecuritySection() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");

    const changePasswordForm = useForm<ChangePasswordRequest>({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(changePasswordBody),
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
        if (data.newPassword !== confirmPassword) {
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
                                <FormField
                                    control={changePasswordForm.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Mật khẩu hiện tại"
                                                    className="bg-background"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={changePasswordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Mật khẩu mới"
                                                    className="bg-background"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Input
                                    name="confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="bg-background"
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
