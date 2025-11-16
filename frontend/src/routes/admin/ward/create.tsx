import CreateWardPage from "@/pages/admin/ward/CreateWardPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ward/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreateWardPage />;
}
