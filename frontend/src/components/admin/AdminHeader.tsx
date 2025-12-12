import { cn } from "@/lib/utils";
import { IconBell } from "@tabler/icons-react";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
    ThemeToggleButton,
    useThemeTransition,
} from "../ui/shadcn-io/theme-toggle-button";

interface AdminHeaderProps {
    className?: string;
}

export default function AdminHeader(props: AdminHeaderProps) {
    const nav = useNavigate();
    const { toggle, isDarkMode } = useDarkMode();

    const { startTransition } = useThemeTransition();

    return (
        <div className={cn("flex justify-between items-center", props.className)}>
            <div>
                <AdminBreadcrumb />
            </div>
            <div className="flex items-center justify-end">
                <div></div>
                <ThemeToggleButton
                    theme={isDarkMode ? "dark" : "light"}
                    onClick={() => startTransition(toggle)}
                    variant="circle-blur"
                    start="top-right"
                />
                <IconBell className="h-6 w-6 ml-4 text-gray-600" />
                <Button variant={"link"} onClick={() => nav({ to: "/" })}>
                    Web
                </Button>
            </div>
        </div>
    );
}
