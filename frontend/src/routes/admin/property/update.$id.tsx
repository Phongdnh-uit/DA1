import { queryClient } from "@/lib/queryClient";
import { UpdatePropertyPage } from "@/pages/admin/property/UpdatePropertyPage";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const property = await queryClient.ensureQueryData(
            getFindPropertyByIdQueryOptions(+params.id),
        );
        return {
            property,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdatePropertyPage />;
}
