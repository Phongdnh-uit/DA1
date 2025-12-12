import { queryClient } from "@/lib/queryClient";
import { PropertyComparison } from "@/pages/client/comparison/PropertyComparison";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/compare/$id1/to/$id2")({
    beforeLoad: async ({ params }) => {
        if (params.id1 === params.id2) {
            throw new Response("Cannot compare the same property", { status: 400 });
        }
        if (isNaN(Number(params.id1)) || isNaN(Number(params.id2))) {
            throw new Response("Invalid property ID", { status: 400 });
        }
    },
    loader: async ({ params }) => {
        return {
            property1: await queryClient.ensureQueryData(
                getFindPropertyByIdQueryOptions(+params.id1),
            ),
            property2: await queryClient.ensureQueryData(
                getFindPropertyByIdQueryOptions(+params.id2),
            ),
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <PropertyComparison />;
}
