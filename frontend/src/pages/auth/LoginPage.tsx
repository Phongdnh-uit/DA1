import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getGetCurrentUserQueryKey, useLogin } from "@/services/auth/auth";
import { loginBody } from "@/services/auth/auth.zod";
import type { ApiResponseVoid, LoginRequest, LoginResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { KeyIcon, PhoneIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BannerImage from "@/assets/banner.jpg";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animation";
import {
    ACCESS_TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
} from "@/constant/SecurityConstant";
import { queryClient } from "@/lib/queryClient";

export default function LoginPage() {
    const navigate = useNavigate();
    const form = useForm<LoginRequest>({
        defaultValues: {
            credential: "",
            password: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(loginBody),
    });
    const login = useLogin({
        mutation: {
            onSuccess: (data) => {
                toast.success("Đăng nhập thành công");
                if (data.data?.refreshToken && data.data?.accessToken) {
                    localStorage.setItem(
                        REFRESH_TOKEN_STORAGE_KEY,
                        data.data?.refreshToken,
                    );
                    localStorage.setItem(
                        ACCESS_TOKEN_STORAGE_KEY,
                        data.data?.accessToken,
                    );
                    queryClient.invalidateQueries({
                        queryKey: getGetCurrentUserQueryKey(),
                    });
                    navigate({ to: "/" });
                }
            },
            onError: () => {
                toast.error("Đăng nhập thất bại. Thông tin đăng nhập không đúng");
            },
        },
    });
    const onSubmit = (data: LoginRequest) => {
        login.mutate({ data });
    };

    const loginWithGoogle = () => {
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open(
            `http://localhost:8080/oauth2/authorize/google`,
            "Login with Google",
            `width=${width},height=${height},top=${top},left=${left}`,
        );

        if (!popup) {
            toast.error("Không thể mở cửa sổ đăng nhập Google");
            return;
        }

        let intervalId: number | null = null;

        const messageListener = (event: MessageEvent) => {
            if (event.origin !== "http://localhost:8080") return;
            const data: ApiResponseVoid = event.data;
            console.log("Received message:", data);
            if (data.code === 1000) {
                const parseData = data.data as LoginResponse;
                const refreshToken = parseData.refreshToken;
                const accessToken = parseData.accessToken;
                if (refreshToken && accessToken) {
                    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
                    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
                    toast.success("Đăng nhập thành công bằng Google");
                    queryClient.invalidateQueries({
                        queryKey: getGetCurrentUserQueryKey(),
                    });
                    navigate({ to: "/" });
                    return;
                }
            } else {
                toast.error(
                    "Bạn chưa liên kết tài khoản Google với hệ thống. Vui lòng đăng ký tài khoản trước khi đăng nhập bằng Google.",
                );
            }

            popup.close();

            window.removeEventListener("message", messageListener);

            if (intervalId) {
                clearInterval(intervalId);
            }
        };

        intervalId = window.setInterval(() => {
            if (popup.closed) {
                clearInterval(intervalId!);
                window.removeEventListener("message", messageListener);
            }
        }, 500);

        window.addEventListener("message", messageListener);
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
                        className="text-xl font-bold mb-4"
                    >
                        Xin chào bạn
                    </motion.h2>
                    <motion.h1
                        variants={fadeInUp.item}
                        className="text-3xl font-bold mb-4"
                    >
                        Đăng nhập để tiếp tục
                    </motion.h1>
                    <motion.div variants={fadeInUp.item} className="w-full pr-10 mt-8">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="credential"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="text-xl text-blue-500">
                                            Số điện thoại hoặc email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center rounded-[24px] border focus-within:ring-1 focus-within:ring-ring pl-4 error-display">
                                                <PhoneIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="Nhập số điện thoại hoặc email"
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
                                                <KeyIcon className="h-7 w-7 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập mật khẩu"
                                                    className="border-0 focus-visible:ring-0 shadow-none h-16 placeholder:text-lg !text-xl"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Form>
                        <div className="w-full flex justify-between items-center mt-4">
                            <div>
                                <Checkbox
                                    className="size-5 rounded-[8px] bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent"
                                    splashClassName="bg-blue-500"
                                />
                                <span className="ml-2 text-lg">Ghi nhớ đăng nhập</span>
                            </div>
                            <Link
                                to="/auth/forgot-password"
                                className="text-lg text-blue-500"
                            >
                                Quên mật khẩu ?
                            </Link>
                        </div>
                        <motion.div
                            variants={fadeInUp.item}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Button
                                onClick={() => form.handleSubmit(onSubmit)()}
                                className="w-full mt-8 h-16 rounded-[24px] bg-blue-500 hover:bg-blue-600 text-lg"
                                name="login-button"
                            >
                                Tiếp tục
                            </Button>
                        </motion.div>
                        <div className="w-full overflow-hidden flex items-center justify-center my-4">
                            <Separator />
                            <span className="mx-4 text-lg text-muted-foreground">Hoặc</span>
                            <Separator />
                        </div>
                        <motion.div
                            variants={fadeInUp.item}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Button
                                variant="outline"
                                className="w-full h-16 rounded-[24px] text-lg"
                                name="login-with-google-button"
                                onClick={() => loginWithGoogle()}
                            >
                                <IconBrandGoogle className="h-6 w-6 mr-2" />
                                Đăng nhập với Google
                            </Button>
                        </motion.div>
                        <motion.p
                            variants={fadeInUp.item}
                            className="w-full text-center text-sm mt-4 px-6"
                        >
                            Bằng việc tiếp tục, bạn đồng ý với{" "}
                            <span className="text-blue-500">Điều khoản sử dụng</span>,{" "}
                            <span className="text-blue-500">Chính sách bảo mật</span>,{" "}
                            <span className="text-blue-500">Quy chế</span> và{" "}
                            <span className="text-blue-500">Chính sách</span> của chúng tôi.
                        </motion.p>
                    </motion.div>
                </motion.div>
                <div className="w-full flex justify-center items-center">
                    <div className="text-xl mb-4">
                        Chưa là thành viên ?{" "}
                        <Link to="/auth/sign-up" className="text-blue-500">
                            Đăng ký tại đây
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
