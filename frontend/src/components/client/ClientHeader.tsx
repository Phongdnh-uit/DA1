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
import { HeartIcon, LogOut, Settings, User } from "lucide-react";

export default function ClientHeader() {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    return (
        <header className="bg-white h-20 shadow-sm border-b sticky top-0 z-50">
            <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={Logo} alt="Logo" className="h-12 w-auto" />
                </Link>

                <nav className="hidden md:flex space-x-8">
                    {[
                        "Nhà đất bán",
                        "Nhà đất cho thuê",
                        "Dự án",
                        "Tin tức",
                        "Wiki BĐS",
                    ].map((item) => (
                        <motion.div
                            className="relative inline-block cursor-pointer"
                            initial="rest"
                            whileHover="hover"
                        >
                            <Link to="/" key={item} className="text-gray-700 font-medium">
                                {item}
                            </Link>
                            <motion.div
                                variants={drawLineVariants}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="absolute bottom-0 left-0 h-[2px] bg-blue-500"
                            />
                        </motion.div>
                    ))}
                </nav>

                {authStore.isAuthenticated ? (
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/images/avatar.jpg" alt="User" />
                                        <AvatarFallback>
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Cài đặt</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigate({ to: "/wish-list" })}
                                >
                                    <HeartIcon className="mr-2 h-4 w-4" />
                                    <span>Yêu thích</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
                                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                                    <span className="text-destructive">Đăng xuất</span>
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
                                className="hidden sm:inline-block border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100"
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
        </header>
    );
}
