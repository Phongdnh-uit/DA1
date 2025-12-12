import { queryClient } from "@/lib/queryClient";
import { UpdatePropertyPage } from "@/pages/admin/property/UpdatePropertyPage";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
        queryClient.ensureQueryData(getFindPropertyByIdQueryOptions(+params.id));
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdatePropertyPage />;
}
