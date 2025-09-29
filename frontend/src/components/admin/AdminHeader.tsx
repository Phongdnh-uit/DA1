import { cn } from "@/lib/utils";
import { IconBell, IconSunHigh } from "@tabler/icons-react";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useDarkMode } from "@/hooks/use-dark-mode";

interface AdminHeaderProps {
  className?: string;
}

export default function AdminHeader(props: AdminHeaderProps) {
  const nav = useNavigate();
  const { toggle } = useDarkMode({
    localStorageKey: "dark-mode",
  });
  return (
    <div className={cn("flex justify-between items-center", props.className)}>
      <div>
        <AdminBreadcrumb />
      </div>
      <div className="flex items-center justify-end">
        <div></div>
        <IconSunHigh onClick={() => toggle()} className="h-6 w-6 text-yellow-400" />
        <IconBell className="h-6 w-6 ml-4 text-gray-600" />
        <Button variant={"link"} onClick={() => nav({ to: "/" })}>
          Web
        </Button>
      </div>
    </div>
  );
}
