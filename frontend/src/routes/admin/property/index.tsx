import { PropertyManage } from "@/pages/admin/property/PropertyManage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <PropertyManage />;
}
