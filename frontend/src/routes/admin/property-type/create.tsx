import CreatePropertyTypePage from "@/pages/admin/propertyType/CreatePropertyTypePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property-type/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreatePropertyTypePage />;
}
