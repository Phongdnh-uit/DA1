import { Card, CardContent } from "@/components/ui/card";
import { Route } from "@/routes/auth/verify-email";
import { useVerifyEmail } from "@/services/auth/auth";
import { useEffect } from "react";
import Logo from "@/assets/logo.svg";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import FireWork from "@/assets/firework.png";

export default function VerifyEmailPage() {
    const { code } = Route.useSearch();
    const { mutate  } = useVerifyEmail();
    useEffect(() => {
        if (code) {
            mutate({ data: { code } });
        }
    }, [code, mutate]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            {/* Logo */}
            <div className="mb-6">
                <img
                    src={Logo}
                    alt="Logo"
                    width={150}
                    height={150}
                    className="shadow-sm"
                />
            </div>

            {/* Thẻ xác thực */}
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardContent className="p-6 pt-0">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">
                        Xác thực email
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Cảm ơn bạn đã xác thực email. Bây giờ bạn có thể đăng nhập và bắt
                        đầu sử dụng dịch vụ của chúng tôi.
                    </p>

                    {/* Hình minh họa */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={FireWork}
                            alt="Email Verification Illustration"
                            width={200}
                            height={200}
                            className="object-contain"
                        />
                    </div>

                    <div className="mb-4">
                        Bạn có thể đóng trang này và quay lại ứng dụng.
                    </div>

                    {/* Nút điều hướng */}
                    <Link to="/">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Quay về trang chủ
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
