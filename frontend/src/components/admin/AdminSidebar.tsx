"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
    IconArrowLeft,
    IconChartPie2,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    children: React.ReactNode;
}

export function AdminSidebar(props: AdminSidebarProps) {
    const links = [
        {
            label: "Overview",
            href: "/admin/dashboard",
            icon: (
                <IconChartPie2 className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "#",
            icon: (
                <IconUserBolt className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    const [tabPosition, setTabPosition] = useState<{
        top: number;
        opacity: number;
    }>({ top: 0, opacity: 0 });
    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-screen",
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div
                            className="relative mt-8 flex flex-col gap-2"
                            onMouseLeave={() =>
                                setTabPosition({ ...tabPosition, opacity: 0 })
                            }
                        >
                            <motion.div
                                className="absolute left-0 w-full bg-zinc-200/80 rounded-lg"
                                style={{ height: 40 }}
                                animate={tabPosition}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />

                            {links.map((link, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={(e) => {
                                        const target = e.currentTarget;
                                        setTabPosition({ top: target.offsetTop, opacity: 1 });
                                    }}
                                    className={cn("relative h-[40px] flex items-center group/custom", open && "px-2")}
                                >
                                    <SidebarLink link={link} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
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
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                Acet Labs
            </motion.span>
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </a>
    );
};
