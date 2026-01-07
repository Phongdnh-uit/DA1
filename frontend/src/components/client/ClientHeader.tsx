import { drawLineVariants } from "@/lib/animation";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import Logo from "@/assets/logo.svg";
import { useAuthStore } from "@/stores/useAuthStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    CircuitBoard,
    Flag,
    HeartIcon,
    LogOut,
    MessageCircleIcon,
    Settings,
    User,
} from "lucide-react";
import { useLogout } from "@/services/auth/auth";
import {
    ACCESS_TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
} from "@/constant/SecurityConstant";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useFilePreview } from "@/hooks/useFileHook";

const middleItems = [
    { name: "Tất cả bất động sản", href: "/properties" },
    { name: "Dự án", href: "/" },
    { name: "Tin tức", href: "/" },
    { name: "Wiki BĐS", href: "/" },
] as { name: string; href: string }[];
const MenuActionItem = ({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) => (
    <DropdownMenuItem
        onClick={onClick}
        className="
      flex items-center justify-between px-3 py-2.5 my-0.5 
      cursor-pointer rounded-md transition-all duration-200
      /* Hiệu ứng hover: nền xanh dương cực nhẹ, chữ xanh dương đậm */
      hover:bg-blue-50 focus:bg-blue-50 
      hover:text-blue-700 focus:text-blue-700
      group
    "
    >
        <div className="flex items-center">
            {/* Icon chỉ đổi màu khi hover, không còn box nền */}
            <div className="mr-3 text-slate-500 group-hover:text-blue-600 transition-colors duration-200">
                {icon}
            </div>
            <span className="font-medium text-sm tracking-tight transition-colors duration-200">
                {label}
            </span>
        </div>
    </DropdownMenuItem>
);

export default function ClientHeader() {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const logoutMutation = useLogout({
        mutation: {
            onSuccess: () => {
                localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
                localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
                authStore.setUser(null);
                navigate({ to: "/" });
            },
            onError: (error) => {
                console.error("Logout error:", error);
                toast.error("Đăng xuất thất bại.");
            },
        },
    });

    const handleLogout = () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || "";
        logoutMutation.mutate({
            data: {
                refreshToken,
            },
        });
    };
    const [hidden, setHidden] = useState(false);
    const [lastScroll, setLastScroll] = useState(0);

    const url = useFilePreview(authStore?.user?.avatar?.objectName);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setLastScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScroll]);
    return (
        <motion.header
            animate={{ y: hidden ? "-100%" : "0%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className={
                "bg-white h-20 shadow-sm border-b sticky top-0 z-50 dark:bg-slate-900"
            }
        >
            <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={Logo} alt="Logo" className="h-12 w-auto" />
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold tracking-tighter">
                            <span className="text-blue-900">UIT</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 ml-1">
                                LAND
                            </span>
                        </span>
                    </div>
                </Link>

                <nav className="hidden md:flex space-x-8">
                    {middleItems.map((item, idx) => (
                        <motion.div
                            className="relative inline-block cursor-pointer"
                            initial="rest"
                            whileHover="hover"
                            key={idx}
                        >
                            <Link to={item.href} key={item.name} className="font-medium">
                                {item.name}
                            </Link>
                            <motion.div
                                variants={drawLineVariants}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="absolute bottom-0 left-0 h-[2px] bg-blue-500"
                            />
                        </motion.div>
                    ))}
                </nav>

                {authStore.user ? (
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/50 transition-all">
                                            <AvatarImage src={url.url || undefined} alt="User" />
                                            <AvatarFallback className="bg-secondary">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-60 p-2 shadow-xl border-muted/40 bg-popover/95 backdrop-blur-md"
                            >
                                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Tài khoản của tôi
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="mx-1" />

                                <div className="space-y-1">
                                    <MenuActionItem
                                        icon={<Settings className="group-hover:text-blue-500" />}
                                        label="Cài đặt"
                                        onClick={() => navigate({ to: "/settings" })}
                                    />
                                    <MenuActionItem
                                        icon={<HeartIcon className="group-hover:text-blue-500" />}
                                        label="Yêu thích"
                                        onClick={() => navigate({ to: "/wish-list" })}
                                    />
                                    <MenuActionItem
                                        icon={
                                            <MessageCircleIcon className="group-hover:text-blue-500" />
                                        }
                                        label="Trò chuyện"
                                        onClick={() => navigate({ to: "/chat" })}
                                    />
                                    <MenuActionItem
                                        icon={<Flag className="group-hover:text-blue-500" />}
                                        label="Lịch sử hỗ trợ"
                                        onClick={() => navigate({ to: "/support/history" })}
                                    />
                                    {authStore.user?.role?.canManage && (
                                        <MenuActionItem
                                            icon={
                                                <CircuitBoard className="group-hover:text-blue-500" />
                                            }
                                            label="Trang quản trị"
                                            onClick={() => navigate({ to: "/admin/dashboard" })}
                                        />
                                    )}
                                </div>

                                <DropdownMenuSeparator className="mx-1" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer rounded-md transition-colors"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <span className="font-medium">Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Link
                                to="/auth/login"
                                className="hidden sm:inline-block border border-gray-300 px-3 py-1.5 rounded-md text-sm"
                            >
                                Đăng nhập
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Link
                                to="/auth/sign-up"
                                className="hidden sm:inline-block bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
                            >
                                Đăng ký
                            </Link>
                        </motion.div>
                        <button className="md:hidden p-2 rounded hover:bg-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </motion.header>
    );
}
