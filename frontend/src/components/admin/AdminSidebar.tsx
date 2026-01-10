"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import logo from "@/assets/logo.svg";
import { useNavigate } from "@tanstack/react-router";
import { ACCESSIBLE_MODULES } from "@/constant/AccessibleModule";

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

interface AdminSidebarProps {
    children: React.ReactNode;
}

export function AdminSidebar(props: AdminSidebarProps) {
    const user = useAuthStore((state) => state.user);
    const links = ACCESSIBLE_MODULES.filter(
        // hash cứng do trễ deadline
        (module) => user?.roleId === 1 || user?.role?.accessibleModules?.includes(module.code)
    ).map((module) => ({
        label: module.title,
        href: module.href,
        icon: module.icon,
        accessibleCode: module.code,
    }))
    const [open, setOpen] = useState(false);
    const [tabPosition, setTabPosition] = useState<{
        top: number;
        opacity: number;
    }>({ top: 0, opacity: 0 });
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-screen",
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 bg-white dark:bg-neutral-900 mr-0 md:mr-4">
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-shrink-0">
                            {open ? <Logo /> : <LogoIcon />}
                        </div>
                        <div
                            className="relative mt-4 flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin"
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
                                    onClick={() => {
                                        navigate({ to: link.href });
                                    }}
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
                    {/* <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-700 pt-4"> */}
                    {/*     <DropdownMenu> */}
                    {/*         <DropdownMenuTrigger asChild> */}
                    {/*             <motion.button */}
                    {/*                 whileHover={{ scale: 1.02 }} */}
                    {/*                 whileTap={{ scale: 0.98 }} */}
                    {/*                 className={cn( */}
                    {/*                     "w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400", */}
                    {/*                     !open && "justify-center", */}
                    {/*                 )} */}
                    {/*             > */}
                    {/*                 <div className="relative"> */}
                    {/*                     <img */}
                    {/*                         src="https://assets.aceternity.com/manu.png" */}
                    {/*                         className="h-9 w-9 rounded-full ring-2 ring-blue-500 dark:ring-blue-400" */}
                    {/*                         alt="Avatar" */}
                    {/*                     /> */}
                    {/*                     <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" /> */}
                    {/*                 </div> */}
                    {/*                 {open && ( */}
                    {/*                     <motion.div */}
                    {/*                         initial={{ opacity: 0, x: -10 }} */}
                    {/*                         animate={{ opacity: 1, x: 0 }} */}
                    {/*                         className="flex flex-col items-start flex-1 min-w-0" */}
                    {/*                     > */}
                    {/*                         <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate w-full"> */}
                    {/*                             {user?.fullName || "Admin"} */}
                    {/*                         </span> */}
                    {/*                         <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate w-full"> */}
                    {/*                             {user?.email || "admin@example.com"} */}
                    {/*                         </span> */}
                    {/*                     </motion.div> */}
                    {/*                 )} */}
                    {/*             </motion.button> */}
                    {/*         </DropdownMenuTrigger> */}
                    {/*         <DropdownMenuContent */}
                    {/*             align="end" */}
                    {/*             side="right" */}
                    {/*             className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" */}
                    {/*         > */}
                    {/*             <DropdownMenuLabel className="font-normal"> */}
                    {/*                 <div className="flex flex-col space-y-1"> */}
                    {/*                     <p className="text-sm font-medium leading-none"> */}
                    {/*                         {user?.fullName || "Admin User"} */}
                    {/*                     </p> */}
                    {/*                     <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400"> */}
                    {/*                         {user?.email || "admin@example.com"} */}
                    {/*                     </p> */}
                    {/*                 </div> */}
                    {/*             </DropdownMenuLabel> */}
                    {/*             <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" /> */}
                    {/*             <DropdownMenuItem className="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"> */}
                    {/*                 <IconUser className="mr-2 h-4 w-4" /> */}
                    {/*                 <span>Hồ sơ</span> */}
                    {/*             </DropdownMenuItem> */}
                    {/*             <DropdownMenuItem className="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"> */}
                    {/*                 <IconSettings className="mr-2 h-4 w-4" /> */}
                    {/*                 <span>Cài đặt</span> */}
                    {/*             </DropdownMenuItem> */}
                    {/*             <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" /> */}
                    {/*             <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-700 dark:focus:text-red-400"> */}
                    {/*                 <IconLogout className="mr-2 h-4 w-4" /> */}
                    {/*                 <span>Đăng xuất</span> */}
                    {/*             </DropdownMenuItem> */}
                    {/*         </DropdownMenuContent> */}
                    {/*     </DropdownMenu> */}
                    {/* </div> */}
                </SidebarBody>
            </Sidebar>
            {props.children}
        </div>
    );
}
