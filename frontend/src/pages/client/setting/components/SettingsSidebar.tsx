"use client";

import { useState } from "react";
import { User, Bell, Lock, Eye, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animation";
import { useLogout } from "@/services/auth/auth";
import {
    ACCESS_TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
} from "@/constant/SecurityConstant";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

export function SettingsSidebar() {
    const [activeSection, setActiveSection] = useState("profile");

    const sections = [
        { id: "profile", label: "Hồ sơ", icon: User },
        { id: "preferences", label: "Tùy chỉnh", icon: Eye },
        { id: "notifications", label: "Thông báo", icon: Bell },
        { id: "security", label: "Bảo mật", icon: Lock },
    ];

    function navigationToSection(id: string) {
        const section = document.getElementById(id);
        if (section) {
            const offset = 80;
            const top = section.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                behavior: "smooth",
            });
        }
    }

    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const logoutMutation = useLogout({
        mutation: {
            onSuccess: () => {
                localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
                localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
                setUser(null);
                navigate({ to: "/auth/login" });
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

    return (
        <motion.aside
            className="w-full lg:w-48"
            variants={fadeInUp.container}
            initial="hidden"
            animate="show"
        >
            <nav className="space-y-2">
                {sections.map(({ id, label, icon: Icon }) => (
                    <motion.div variants={fadeInUp.item} key={id}>
                        <button
                            onClick={() => {
                                setActiveSection(id);
                                navigationToSection(id);
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                activeSection === id
                                    ? "bg-blue-500 text-primary-foreground"
                                    : "hover:bg-muted text-foreground",
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    </motion.div>
                ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-border">
                <motion.div variants={fadeInUp.item}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </motion.div>
            </div>
        </motion.aside>
    );
}
