import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <AdminSidebar>
            <div className="flex flex-col size-full gap-4 pr-4 py-4">
                <AdminHeader />
                <Outlet />
            </div>
        </AdminSidebar>
    );
}
