import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <ProtectedRoute>
            <AdminSidebar>
                <div className="bg-zinc-50 dark:bg-zinc-800 flex flex-col size-full gap-4 pr-4 py-4">
                    <AdminHeader className="sticky top-0 z-50" />
                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </AdminSidebar>
        </ProtectedRoute>
    );
}
