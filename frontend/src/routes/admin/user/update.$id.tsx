import { queryClient } from "@/lib/queryClient";
import { UpdateUserPage } from "@/pages/admin/user/UpdateUserPage";
import { getFindUserByIdQueryOptions } from "@/services/user/user";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/user/update/$id")({
    loader: async ({ params }) => {
        return await queryClient.ensureQueryData(
            getFindUserByIdQueryOptions(Number(params.id)),
        );
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdateUserPage />;
}
