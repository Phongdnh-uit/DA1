"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { IconBrandWechat, IconChartPie2 } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import {
    Building2Icon,
    Calendar,
    CircleStarIcon,
    HouseIcon,
    MapIcon,
    MapPinnedIcon,
    SettingsIcon,
    ShieldUserIcon,
    TagIcon,
    UsersRoundIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdminSidebarProps {
    children: React.ReactNode;
}

export function AdminSidebar(props: AdminSidebarProps) {
    const links = [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: (
                <IconChartPie2
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
            permissionCode: "STATISTICS_VIEW",
        },
        {
            label: "Quyền hạn",
            href: "/admin/permission",
            icon: (
                <ShieldUserIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
            permissionCode: "PERMISSION_VIEW_LIST",
        },
        {
            label: "Vai trò",
            href: "/admin/role",
            icon: (
                <CircleStarIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
            permissionCode: "ROLE_VIEW_LIST",
        },
        {
            label: "Người dùng",
            href: "/admin/user",
            icon: (
                <UsersRoundIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Tỉnh thành",
            href: "/admin/province",
            icon: (
                <MapIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Xã phường",
            href: "/admin/ward",
            icon: (
                <MapPinnedIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Thống kê giá cả",
            href: "/admin/price-reference",
            icon: (
                <TagIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Loại bất động sản",
            href: "/admin/property-type",
            icon: (
                <HouseIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Bất động sản",
            href: "/admin/property",
            icon: (
                <Building2Icon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Trò chuyện",
            href: "/admin/chat",
            icon: (
                <IconBrandWechat
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Đặt lịch",
            href: "/admin/booking",
            icon: (
                <Calendar
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
        {
            label: "Cài đặt",
            href: "/admin/settings",
            icon: (
                <SettingsIcon
                    className={cn(
                        "h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-200 group-hover/custom:text-blue-500",
                    )}
                />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    const [tabPosition, setTabPosition] = useState<{
        top: number;
        opacity: number;
    }>({ top: 0, opacity: 0 });
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-screen",
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 bg-white dark:bg-neutral-900 mr-0 md:mr-4">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div
                            className="relative mt-4 flex flex-col gap-2"
                            onMouseLeave={() =>
                                setTabPosition({ ...tabPosition, opacity: 0 })
                            }
                        >
                            <motion.div
                                className="absolute left-0 w-full bg-blue-100 rounded-2xl dark:bg-blue-700"
                                style={{ height: 48 }}
                                animate={tabPosition}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />

                            {links.map((link, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={(e) => {
                                        const target = e.currentTarget;
                                        setTabPosition({ top: target.offsetTop, opacity: 1 });
                                    }}
                                    onClick={() => navigate({ to: link.href })}
                                    className={cn(
                                        "relative h-[48px] flex items-center group/custom hover:cursor-pointer",
                                        open && "px-4",
                                    )}
                                >
                                    <SidebarLink link={link} className="text-blue-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: user?.email ? user?.email : "",
                                href: "#",
                                icon: (
                                    <img
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            {props.children}
        </div>
    );
}
export const Logo = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center text-sm font-normal text-black py-1 space-x-2"
        >
            <img src={logo} className="h-20 w-30" />
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <img src={logo} className="h-7 w-7" />
        </a>
    );
};
