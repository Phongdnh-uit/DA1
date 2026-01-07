import { queryClient } from "@/lib/queryClient";
import UpdatePropertyTypePage from "@/pages/admin/propertyType/UpdatePropertyTypePage";
import { getFindPropertyTypeByIdQueryOptions } from "@/services/property-type/property-type";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property-type/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const propertyType = await queryClient.ensureQueryData(
            getFindPropertyTypeByIdQueryOptions(+params.id),
        );
        return { propertyType };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdatePropertyTypePage />;
}
