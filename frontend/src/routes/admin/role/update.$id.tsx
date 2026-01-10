import { queryClient } from "@/lib/queryClient";
import { UpdateRolePage } from "@/pages/admin/role/UpdateRolePage";
import { getFindRoleByIdQueryOptions } from "@/services/role/role";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/role/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const role = await queryClient.ensureQueryData(
            getFindRoleByIdQueryOptions(Number(params.id)),
        );
        return { role };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdateRolePage />;
}
