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
import { useRegister } from "@/services/auth/auth";
import { registerBody } from "@/services/auth/auth.zod";
import type { ApiResponseVoid, RegisterRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { KeyRoundIcon, LockIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BannerImage from "@/assets/banner.jpg";
import { useAuthSessionStore } from "@/stores/useAuthSessionStore";
import z from "zod";

export default function RegisterPage() {
    const { verificationToken } = useAuthSessionStore();
    const form = useForm<RegisterRequest & { confirmPassword: string }>({
        defaultValues: {
            email: "",
            fullName: "",
            password: "",
            verificationToken: verificationToken || "",
        },
        mode: "onSubmit",
        resolver: zodResolver(
            z
                .object({
                    ...registerBody.shape,
                    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
                })
                .refine((data) => data.password === data.confirmPassword, {
                    message: "Mật khẩu xác nhận không khớp",
                }),
        ),
    });
    const navigate = useNavigate();
    const register = useRegister({
        mutation: {
            onSuccess: () => {
                toast.success("Đăng ký thành công");
                navigate({ to: "/auth/login" });
            },
            onError: (data) => {
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof RegisterRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
                toast.error("Đăng ký thất bại");
            },
        },
    });
    const onSubmit = (data: RegisterRequest) => {
        register.mutate({ data });
    };
    return (
        <div className="flex">
            <div className="w-full sm:w-3/7 flex flex-col items-center justify-between h-screen px-20">
                <div className="w-full mt-20">
                    <h2 className="text-xl font-bold mb-4">Xin chào bạn</h2>
                    <h1 className="text-3xl font-bold mb-4">Đăng ký tài khoản mới</h1>
                    <div className="w-full pr-10 mt-8">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="text-xl text-blue-500">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <PhoneIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="Nhập email"
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
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2 mt-4">
                                        <FormLabel className="text-xl text-blue-500">
                                            Họ và tên
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <UserIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập họ và tên"
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2 mt-4">
                                        <FormLabel className="text-xl text-blue-500">
                                            Mật khẩu
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <KeyRoundIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập mật khẩu"
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
                                            Xác nhận Mật khẩu
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <LockIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="Xác nhận mật khẩu"
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
                        <Button
                            onClick={() => form.handleSubmit(onSubmit)()}
                            className="w-full mt-8 h-16 rounded-[24px] bg-blue-500 hover:bg-blue-600 text-lg"
                        >
                            Tiếp tục
                        </Button>
                        <p className="w-full text-center text-sm mt-4 px-6">
                            Bằng việc tiếp tục, bạn đồng ý với{" "}
                            <span className="text-blue-500">Điều khoản sử dụng</span>,{" "}
                            <span className="text-blue-500">Chính sách bảo mật</span>,{" "}
                            <span className="text-blue-500">Quy chế</span> và{" "}
                            <span className="text-blue-500">Chính sách</span> của chúng tôi.
                        </p>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="text-xl mb-4">
                        Đã có tài khoản ?{" "}
                        <Link to="/auth/login" className="text-blue-500">
                            Đăng nhập ngay
                        </Link>{" "}
                        bạn nhé
                    </div>
                </div>
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
