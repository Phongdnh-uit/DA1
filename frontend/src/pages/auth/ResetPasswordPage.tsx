import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fadeInUp } from "@/lib/animation";
import { useResetPassword } from "@/services/auth/auth";
import { resetPasswordBody } from "@/services/auth/auth.zod";
import type { ResetPasswordRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, LockIcon } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BannerImage from "@/assets/banner.jpg";
import { useAuthSessionStore } from "@/stores/useAuthSessionStore";
import z from "zod";

export default function ResetPasswordPage() {
    const { verificationToken } = useAuthSessionStore();
    const form = useForm<ResetPasswordRequest & { confirmPassword: string }>({
        defaultValues: {
            verificationCode: verificationToken || "",
            newPassword: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(
            z
                .object({
                    ...resetPasswordBody.shape,
                    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
                })
                .refine((data) => data.newPassword === data.confirmPassword, {
                    message: "Mật khẩu xác nhận không khớp",
                }),
        ),
    });
    const navigate = useNavigate();
    const mutation = useResetPassword({
        mutation: {
            onSuccess: () => {
                toast.success("Yêu cầu thành công");
                navigate({
                    to: "/auth/login",
                });
            },
            onError: () => {
                toast.error("Yêu cầu không thành công");
            },
        },
    });
    const onSubmit = (data: ResetPasswordRequest) => {
        mutation.mutate({ data });
    };

    return (
        <div className="flex">
            <div className="w-full sm:w-3/7 flex flex-col items-center justify-between h-screen px-20">
                <motion.div
                    variants={fadeInUp.container}
                    initial="hidden"
                    animate="show"
                    className="w-full mt-20"
                >
                    <motion.h2
                        variants={fadeInUp.item}
                        className="text-xl font-bold mb-4 flex items-center cursor-pointer w-fit"
                        onClick={() => navigate({ to: "/auth/login" })}
                    >
                        <ArrowLeftIcon /> Quay lại
                    </motion.h2>
                    <motion.h1
                        variants={fadeInUp.item}
                        className="text-3xl font-bold mb-4"
                    >
                        Tạo mật khẩu mới
                    </motion.h1>
                    <motion.div variants={fadeInUp.item} className="w-full pr-10 mt-8">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="text-xl text-blue-500">
                                            Mật khẩu mới
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <LockIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập mật khẩu mới"
                                                    className="border-0 focus-visible:ring-0 shadow-none w-full  h-16 placeholder:text-lg !text-lg"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2 mt-4">
                                        <FormLabel className="text-xl text-blue-500">
                                            Xác nhận mật khẩu mới
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <LockIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Xác nhận mật khẩu mới"
                                                    className="border-0 focus-visible:ring-0 shadow-none w-full  h-16 placeholder:text-lg !text-lg"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Form>
                        <motion.div
                            variants={fadeInUp.item}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Button
                                onClick={() => form.handleSubmit(onSubmit)()}
                                className="w-full mt-8 h-16 rounded-[24px] bg-blue-500 hover:bg-blue-600 text-lg"
                            >
                                Tiếp tục
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            <div className="hidden sm:block w-4/7 h-screen">
                <img
                    src={BannerImage}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
