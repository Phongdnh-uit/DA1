import { WardManage } from "@/pages/admin/ward/WardManage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ward/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <WardManage />;
}
