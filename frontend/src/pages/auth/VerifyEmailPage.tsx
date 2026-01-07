import { useState, useEffect, useRef } from "react";
import {
    CheckCircle,
    XCircle,
    Loader2,
    LogIn,
    Home,
    AlertCircle,
} from "lucide-react";
import { Route } from "@/routes/auth/verify-email";
import { useSendOtp, useVerifyEmail } from "@/services/auth/auth";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerificationStatus = "loading" | "success" | "error";

export default function EmailVerification() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<VerificationStatus>("loading");
    const [countdown, setCountdown] = useState(5);
    const [mail, setMail] = useState("");
    const mailRef = useRef<HTMLInputElement>(null);

    const { code } = Route.useSearch();
    const { mutate } = useVerifyEmail({
        mutation: {
            onSuccess: () => {
                setStatus("success");
                setCountdown(5);
            },
            onError: () => {
                setStatus("error");
            }
        },
    });
    useEffect(() => {
        if (code) {
            mutate({ data: { code } });
        }
    }, [code, mutate]);

    const sendOtp = useSendOtp({});

    useEffect(() => {
        if (status === "success" && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [status, countdown]);

    const handleLogin = () => {
        navigate({ to: "/auth/login" });
    };

    const handleHome = () => {
        navigate({ to: "/" });
    };

    const handleRetry = () => {
        if (mail === "") {
            if (mailRef.current) {
                mailRef.current.focus();
                mailRef.current.ariaInvalid = "true";
            }
            return;
        }
        sendOtp.mutate({
            data: {
                destination: mail,
                purpose: "EMAIL_VERIFICATION",
            },
        });
        setStatus("loading");
        setCountdown(5);
        setTimeout(() => setStatus("error"), 2000);
    };

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center opacity-5 dark:opacity-10"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200')",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-[520px] bg-white dark:bg-slate-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden border border-slate-100 dark:border-slate-800">
                {status === "loading" && (
                    <>
                        <div className="h-2 bg-blue-500 w-full animate-pulse" />
                        <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-12">
                            <div className="mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 p-4 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
                                <Loader2 className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin" />
                            </div>

                            <h1 className="text-[#0d141b] dark:text-white tracking-tight text-[28px] sm:text-[32px] font-bold leading-tight text-center mb-4">
                                Đang Xác Minh Email
                            </h1>

                            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed text-center mb-8 max-w-sm">
                                Vui lòng đợi trong giây lát. Chúng tôi đang xác minh địa chỉ
                                email của bạn.
                            </p>

                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                />
                                <div
                                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                />
                                <div
                                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="h-2 bg-blue-500 w-full" />
                        <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-12 animate-[fadeIn_0.5s_ease-in]">
                            <div className="mb-6 rounded-full bg-green-50 dark:bg-green-900/20 p-4 ring-8 ring-green-50/50 dark:ring-green-900/10 animate-[scaleIn_0.5s_ease-out]">
                                <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
                            </div>

                            <h1 className="text-[#0d141b] dark:text-white tracking-tight text-[28px] sm:text-[32px] font-bold leading-tight text-center mb-4">
                                Xác Minh Email Thành Công
                            </h1>

                            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed text-center mb-8 max-w-sm">
                                Chúc mừng! Tài khoản của bạn đã được kích hoạt. Bạn có thể bắt
                                đầu đăng tin và tìm kiếm bất động sản ngay bây giờ.
                            </p>

                            <button
                                onClick={handleLogin}
                                className="w-full sm:w-auto min-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#137fec] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20 hover:bg-blue-600 hover:shadow-blue-500/30 transition-all transform active:scale-95 flex gap-2"
                            >
                                <span className="truncate">Đăng Nhập Ngay</span>
                                <LogIn className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleHome}
                                className="group mt-6 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors"
                            >
                                <Home className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                <span>Về Trang Chủ</span>
                            </button>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 text-center border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Bạn sẽ được tự động chuyển hướng trong {countdown} giây...
                            </p>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="h-2 bg-red-500 w-full" />
                        <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-12 animate-[fadeIn_0.5s_ease-in]">
                            <div className="mb-6 rounded-full bg-red-50 dark:bg-red-900/20 p-4 ring-8 ring-red-50/50 dark:ring-red-900/10 animate-[scaleIn_0.5s_ease-out]">
                                <XCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
                            </div>

                            <h1 className="text-[#0d141b] dark:text-white tracking-tight text-[28px] sm:text-[32px] font-bold leading-tight text-center mb-4">
                                Xác Minh Thất Bại
                            </h1>

                            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed text-center mb-8 max-w-sm">
                                Rất tiếc, liên kết xác minh không hợp lệ hoặc đã hết hạn. Vui
                                lòng thử lại hoặc yêu cầu gửi lại email xác minh.
                            </p>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 w-full">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold mb-1">
                                            Các nguyên nhân có thể:
                                        </p>
                                        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                                            <li>• Liên kết đã hết hạn (quá 24 giờ)</li>
                                            <li>• Email đã được xác minh trước đó</li>
                                            <li>• Liên kết không chính xác</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mb-4 flex flex-col gap-2">
                                <Label>Email Đã Đăng Ký</Label>
                                <Input
                                    type="email"
                                    value={mail}
                                    onChange={(e) => setMail(e.target.value)}
                                    ref={mailRef}
                                    placeholder="Nhập email của bạn"
                                    className="relative flex items-center border backdrop-blur-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all hover:border-primary has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed h-12 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary has-[aria-invalid='true']:border-red-500 has-[aria-invalid='true']:ring-2 has-[aria-invalid='true']:ring-red-500/30"
                                />
                            </div>

                            <button
                                onClick={handleRetry}
                                className="w-full sm:w-auto min-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#137fec] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20 hover:bg-blue-600 hover:shadow-blue-500/30 transition-all transform active:scale-95 flex gap-2 mb-3"
                            >
                                <span className="truncate">Gửi Lại Email Xác Minh</span>
                            </button>

                            <button
                                onClick={handleHome}
                                className="group flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors"
                            >
                                <Home className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                <span>Về Trang Chủ</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="relative z-10 mt-8 flex justify-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        Bảo mật
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        Uy tín
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        Hỗ trợ 24/7
                    </span>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
