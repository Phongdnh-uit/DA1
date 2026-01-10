import { PropertyTypeManage } from "@/pages/admin/propertyType/PropertyTypeManage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property-type/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <PropertyTypeManage />;
}
