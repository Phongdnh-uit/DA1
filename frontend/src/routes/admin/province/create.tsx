import CreateProvincePage from "@/pages/admin/province/CreateProvincePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/province/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreateProvincePage />;
}
