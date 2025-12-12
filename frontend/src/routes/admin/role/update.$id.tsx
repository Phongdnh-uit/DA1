import { queryClient } from "@/lib/queryClient";
import { UpdateRolePage } from "@/pages/admin/role/UpdateRolePage";
import { getFindAllPermissionQueryOptions } from "@/services/permission/permission";
import { getFindRoleByIdQueryOptions } from "@/services/role/role";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/role/update/$id")({
    loader: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
        await queryClient.ensureQueryData(
            getFindAllPermissionQueryOptions({
                all: true,
                filter: `roles.id==${params.id}`,
            }),
        );
        return await queryClient.ensureQueryData(
            getFindRoleByIdQueryOptions(Number(params.id)),
        );
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdateRolePage />;
}
