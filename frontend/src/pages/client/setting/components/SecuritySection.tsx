"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Monitor, Smartphone, Lock } from "lucide-react";
import { useChangePassword } from "@/services/auth/auth";
import { useForm } from "react-hook-form";
import type { ChangePasswordRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordBody } from "@/services/auth/auth.zod";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "motion/react";
import { FormInput } from "@/utils/formUtil";
import z from "zod";
import { omit } from "lodash";
import { cn } from "@/lib/utils";
import { MotionButton } from "@/components/customs/MotionButton";

export function SecuritySection() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
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
                setShowPasswordForm(false);
            },
        },
    });

    const onSubmit = (
        data: ChangePasswordRequest & {
            confirmPassword: string;
        },
    ) => {
        const sendDate = omit(data, ["confirmPassword"]);
        changePasswordMutation.mutate({
            data: sendDate,
        });
    };

    return (
        <Card id="security" className="p-6 border-none shadow-lg bg-card">
            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                </div>
                Bảo mật
            </h2>

            <div className="space-y-8">
                {/* Alert Thông báo đăng nhập */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <Monitor className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-blue-900 text-sm">
                            Đăng nhập gần đây
                        </p>
                        <p className="text-sm text-blue-700/80">
                            Hôm nay lúc 2:35 chiều từ Chrome trên macOS
                        </p>
                    </div>
                </div>

                {/* Mục Mật khẩu */}
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <Lock className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="font-semibold text-foreground">Mật khẩu</p>
                            <p className="text-sm text-muted-foreground">
                                Đổi lần gần nhất cách đây 3 tháng
                            </p>
                        </div>
                    </div>
                    <MotionButton
                        variant={showPasswordForm ? "ghost" : "outline"}
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className={cn(
                            "transition-all rounded-md px-4 h-10",
                            showPasswordForm
                                ? "text-red-500 hover:text-red-600"
                                : "border-blue-200 text-blue-600 hover:bg-blue-50",
                        )}
                    >
                        {showPasswordForm ? "Hủy" : "Đổi mật khẩu"}
                    </MotionButton>
                </div>

                {/* Form Đổi mật khẩu với hiệu ứng mượt */}
                <AnimatePresence>
                    {showPasswordForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <Form {...changePasswordForm}>
                                    <div className="grid grid-cols-1 gap-4">
                                        <FormInput<ChangePasswordRequest>
                                            name="oldPassword"
                                            title="Mật khẩu mới"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            type="password"
                                            passwordSeeIcon={true}
                                        />
                                        <FormInput<ChangePasswordRequest>
                                            name="newPassword"
                                            placeholder="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                                            title="Mật khẩu mới"
                                            type="password"
                                        />
                                        <FormInput<ChangePasswordRequest & { confirmPassword: string }>
                                            name="confirmPassword"
                                            title="Xác nhận mật khẩu mới"
                                            placeholder="Nhập lại mật khẩu mới"
                                            type="password"
                                        />
                                    </div>
                                    <MotionButton 
                                        onClick={changePasswordForm.handleSubmit(onSubmit)}
                                        className="rounded-md px-4 h-10 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                                        Cập nhật mật khẩu mới
                                    </MotionButton>
                                </Form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mục 2FA */}
                <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex gap-4">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">
                                    Xác thực hai bước (2FA)
                                </p>
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">
                                    Tắt
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Thêm một lớp bảo mật bổ sung cho tài khoản
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => alert("Comming soon")}
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                        Kích hoạt
                    </Button>
                </div>
            </div>
        </Card>
    );
}
