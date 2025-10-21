import { Button } from "@/components/ui/button";
import BannerImage from "@/assets/banner.jpg";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "@tanstack/react-router";
import { useVerifyOtp } from "@/services/auth/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Route } from "@/routes/auth/otp-verification";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animation";
import { ArrowLeftIcon } from "lucide-react";
import {
    ACCESS_TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
} from "@/constant/SecurityConstant";
import type {
    ApiResponseVoid,
    LoginResponse,
} from "@/types";

export default function OTPVerificationPage() {
    const { purpose, isOAR } = Route.useSearch();
    const navigate = useNavigate();
    const { otpDestination, setVerificationToken } = useAuthStore();
    const [value, setValue] = useState("");
    const mutation = useVerifyOtp({
        mutation: {
            onSuccess: (data) => {
                toast.success("Xác minh OTP thành công!");
                if (data.data?.verificationToken) {
                    setVerificationToken(data.data?.verificationToken);
                }
                if (purpose === "REGISTRATION") {
                    if (isOAR) {
                        if (data.data?.verificationToken) {
                            registerWithGoogle(data.data?.verificationToken);
                        }
                        return;
                    }
                    navigate({ to: "/auth/sign-up-addition" });
                }
                if (purpose === "PASSWORD_RESET") {
                    navigate({ to: "/auth/reset-password" });
                }
            },
            onError: () => {
                toast.error("Xác minh OTP thất bại!");
            },
        },
    });

    const handleVerifyOtp = () => {
        if (value.length === 6 && otpDestination && purpose) {
            mutation.mutate({
                data: {
                    purpose: purpose,
                    destination: otpDestination,
                    otp: value,
                },
            });
        }
    };

    const registerWithGoogle = (verificationToken: string) => {
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open(
            `http://localhost:8080/oauth2/authorize/google?verificationToken=${verificationToken}`,
            "Login with Google",
            `width=${width},height=${height},top=${top},left=${left}`,
        );

        if (!popup) {
            toast.error("Không thể mở cửa sổ đăng ký với Google");
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
                    toast.success("Đăng ký thành công với Google");
                    navigate({ to: "/" });
                }
            } else {
                toast.error("Đăng ký thất bại với Google. Vui lòng thử lại.");
                navigate({ to: "/auth/sign-up" });
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
            <div className="hidden sm:block w-4/7 h-screen">
                <img
                    src={BannerImage}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
            </div>
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
                        Xác minh danh tính
                    </motion.h1>
                    <motion.div variants={fadeInUp.item} className="w-full pr-10 mt-8">
                        <div className="flex justify-center items-center">
                            <InputOTP maxLength={6} value={value} onChange={setValue}>
                                <InputOTPGroup className="space-x-2">
                                    <InputOTPSlot
                                        index={0}
                                        className="rounded-md border-l size-14 text-xl"
                                    />
                                    <InputOTPSlot
                                        index={1}
                                        className="rounded-md border-l size-14 text-xl"
                                    />
                                    <InputOTPSlot
                                        index={2}
                                        className="rounded-md border-l size-14 text-xl"
                                    />
                                    <InputOTPSlot
                                        index={3}
                                        className="rounded-md border-l size-14 text-xl"
                                    />
                                    <InputOTPSlot
                                        index={4}
                                        className="rounded-md border-l size-14 text-xl"
                                    />
                                    <InputOTPSlot
                                        index={5}
                                        className="rounded-md border-l size-14 text-xl"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <motion.div
                            variants={fadeInUp.item}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Button
                                onClick={() => handleVerifyOtp()}
                                className="w-full mt-8 h-16 rounded-[24px] bg-blue-500 hover:bg-blue-600 text-lg"
                            >
                                Tiếp tục
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
