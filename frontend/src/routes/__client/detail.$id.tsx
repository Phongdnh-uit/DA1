import { queryClient } from "@/lib/queryClient";
import PropertyDetailPage from "@/pages/client/property/DetailPage";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/detail/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(+params.id)) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const id = +params.id;
        return queryClient.fetchQuery(getFindPropertyByIdQueryOptions(id));
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <PropertyDetailPage />;
}
