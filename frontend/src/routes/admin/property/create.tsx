import { CreatePropertyPage } from "@/pages/admin/property/CreatePropertyPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreatePropertyPage />;
}
