import { cn } from "@/lib/utils";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
    ThemeToggleButton,
    useThemeTransition,
} from "../ui/shadcn-io/theme-toggle-button";
import { Globe } from "lucide-react";

interface AdminHeaderProps {
    className?: string;
}

// export default function AdminHeader(props: AdminHeaderProps) {
//     const nav = useNavigate();
//     const { toggle, isDarkMode } = useDarkMode();
//
//     const { startTransition } = useThemeTransition();
//
//     return (
//         <div className={cn("flex justify-between items-center", props.className)}>
//             <div>
//                 <AdminBreadcrumb />
//             </div>
//             <div className="flex items-center justify-end">
//                 <div></div>
//                 <ThemeToggleButton
//                     theme={isDarkMode ? "dark" : "light"}
//                     onClick={() => startTransition(toggle)}
//                     variant="circle-blur"
//                     start="top-right"
//                 />
//                 <IconBell className="h-6 w-6 ml-4 text-gray-600" />
//                 <Button variant={"link"} onClick={() => nav({ to: "/" })}>
//                     Web
//                 </Button>
//             </div>
//         </div>
//     );
// }
//
export default function AdminHeader({ className }: AdminHeaderProps) {
    const nav = useNavigate();
    const { toggle, isDarkMode } = useDarkMode();

    const { startTransition } = useThemeTransition();
    return (
        <div
            className={cn(
                "flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b sticky top-0 z-50 rounded-lg",
                className,
            )}
        >
            {/* Cánh trái: Điều hướng */}
            <div className="flex items-center gap-4">
                <AdminBreadcrumb />
            </div>

            {/* Cánh phải: Hành động người dùng */}
            <div className="flex items-center gap-2">
                {/* Nút chuyển đổi giao diện */}
                <ThemeToggleButton
                    theme={isDarkMode ? "dark" : "light"}
                    onClick={() => startTransition(toggle)}
                    variant="circle-blur"
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                />

                {/* Thông báo với Badge */}
                {/* <div className="relative p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"> */}
                {/*     <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" /> */}
                {/*     <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" /> */}
                {/* </div> */}
                {/**/}
                {/* <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" /> */}

                {/* Nút điều hướng Web */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => nav({ to: "/" })}
                    className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300"
                >
                    <Globe className="h-4 w-4" />
                    Xem Website
                </Button>
            </div>
        </div>
    );
};
