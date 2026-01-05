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
                <div className="relative flex flex-col min-h-screen w-full gap-4 pr-4 py-4 overflow-hidden">
                    <AdminHeader className="sticky top-0 z-50" />
                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </AdminSidebar>
        </ProtectedRoute>
    );
}
