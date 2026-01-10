import { CreateUserPage } from "@/pages/admin/user/CreateUserPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/user/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreateUserPage />;
}
