import { queryClient } from "@/lib/queryClient";
import { UserDetailPage } from "@/pages/admin/user/UserDetailPage";
import { getFindUserByIdQueryOptions } from "@/services/user/user";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/user/detail/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const userDetail = await queryClient.ensureQueryData(
            getFindUserByIdQueryOptions(+params.id),
        );
        return { userDetail };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UserDetailPage />;
}
