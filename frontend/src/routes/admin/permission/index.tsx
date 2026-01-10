import { PermissionManage } from "@/pages/admin/permission/PermissionManage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/permission/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PermissionManage />;
}
