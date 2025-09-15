import AdminDashboard from "@/pages/admin/dashboard/AdminDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <AdminDashboard />;
}
