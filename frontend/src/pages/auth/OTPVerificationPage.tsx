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

export default function OTPVerificationPage() {
    const { purpose } = Route.useSearch();
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
    return (
        <div className="flex">
            <div className="w-full sm:w-3/7 flex flex-col items-center justify-between h-screen px-20">
                <div className="w-full mt-20">
                    <h2 className="text-xl font-bold mb-4">Xin chào bạn</h2>
                    <h1 className="text-3xl font-bold mb-4">Xác minh danh tính</h1>
                    <div className="w-full pr-10 mt-8">
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
                        <Button
                            onClick={() => handleVerifyOtp()}
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
