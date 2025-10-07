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
import { ArrowLeftIcon, PhoneIcon } from "lucide-react";
import { motion } from "motion/react";
import BannerImage from "@/assets/banner.jpg";
import { useForm } from "react-hook-form";
import type { SendOtpRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOtpBody } from "@/services/auth/auth.zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSendOtp } from "@/services/auth/auth";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
    const form = useForm<SendOtpRequest>({
        defaultValues: {
            destination: "",
            purpose: "PASSWORD_RESET",
        },
        mode: "onSubmit",
        resolver: zodResolver(sendOtpBody),
    });
    const navigate = useNavigate();
    const { setOtpDestination } = useAuthStore();
    const mutation = useSendOtp({
        mutation: {
            onSuccess: () => {
                toast.success("Yêu cầu thành công");
                setOtpDestination(form.getValues("destination"));
                navigate({
                    to: `/auth/otp-verification?purpose=${form.getValues("purpose")}`,
                });
            },
            onError: () => {
                toast.error("Yêu cầu không thành công");
            },
        },
    });
    const onSubmit = (data: SendOtpRequest) => {
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
                        Khôi phục mật khẩu
                    </motion.h1>
                    <motion.div variants={fadeInUp.item} className="w-full pr-10 mt-8">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="destination"
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
