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
import { Separator } from "@/components/ui/separator";
import { useSendOtp } from "@/services/auth/auth";
import { sendOtpBody } from "@/services/auth/auth.zod";
import type { SendOtpRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PhoneIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BannerImage from "@/assets/banner.jpg";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animation";

export default function RegisterFirstPage() {
    const form = useForm<SendOtpRequest>({
        defaultValues: {
            destination: "",
            purpose: "REGISTRATION",
        },
        mode: "onSubmit",
        resolver: zodResolver(sendOtpBody),
    });
    const navigate = useNavigate();
    const { setOtpDestination } = useAuthStore();
    const mutation = useSendOtp({
        mutation: {
            onError: () => {
                toast.error("Yêu cầu không thành công");
            },
        },
    });
    const onSubmit = (data: SendOtpRequest) => {
        mutation.mutate(
            { data },
            {
                onSuccess: () => {
                    toast.success("Yêu cầu thành công");
                    setOtpDestination(form.getValues("destination"));
                    navigate({
                        to: `/auth/otp-verification?purpose=${form.getValues("purpose")}`,
                    });
                },
            },
        );
    };

    const onLoginWithGoogle = (data: SendOtpRequest) => {
        mutation.mutate(
            { data },
            {
                onSuccess: () => {
                    toast.success("Yêu cầu thành công");
                    setOtpDestination(form.getValues("destination"));
                    navigate({
                        to: `/auth/otp-verification?purpose=${form.getValues("purpose")}&isOAR=true`,
                    });
                },
            },
        );
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
                        Đăng ký tài khoản mới
                    </motion.h1>
                    <motion.div variants={fadeInUp.item} className="w-full pr-10 mt-8">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="text-xl text-blue-500">
                                            Số điện thoại
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
                        </Form>
                        <motion.div
                            variants={fadeInUp.item}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            onClick={() => form.handleSubmit(onSubmit)()}
                        >
                            <Button className="w-full mt-8 h-16 rounded-[24px] bg-blue-500 hover:bg-blue-600 text-lg">
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
                            onClick={() => form.handleSubmit(onLoginWithGoogle)()}
                        >
                            <Button
                                variant="outline"
                                className="w-full h-16 rounded-[24px] text-lg"
                            >
                                <IconBrandGoogle className="h-6 w-6 mr-2" />
                                Đăng nhập với Google
                            </Button>
                        </motion.div>
                        <p className="w-full text-center text-sm mt-4 px-6">
                            Bằng việc tiếp tục, bạn đồng ý với{" "}
                            <span className="text-blue-500">Điều khoản sử dụng</span>,{" "}
                            <span className="text-blue-500">Chính sách bảo mật</span>,{" "}
                            <span className="text-blue-500">Quy chế</span> và{" "}
                            <span className="text-blue-500">Chính sách</span> của chúng tôi.
                        </p>
                    </motion.div>
                </motion.div>
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
