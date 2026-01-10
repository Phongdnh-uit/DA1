import { queryClient } from "@/lib/queryClient";
import UpdateWardPage from "@/pages/admin/ward/UpdateWardPage";
import { getFindWardByIdQueryOptions } from "@/services/ward/ward";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ward/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const ward = await queryClient.ensureQueryData(
            getFindWardByIdQueryOptions(+params.id),
        );
        return { ward };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdateWardPage />;
}
