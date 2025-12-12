import { queryClient } from "@/lib/queryClient";
import UpdatePermissionPage from "@/pages/admin/permission/UpdatePermissionPage";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getFindPermissionByIdQueryOptions } from "@/services/permission/permission";

export const Route = createFileRoute("/admin/permission/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
        queryClient.ensureQueryData(
            getFindPermissionByIdQueryOptions(Number(params.id)),
        );
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdatePermissionPage />;
}
