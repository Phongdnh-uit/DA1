import { queryClient } from "@/lib/queryClient";
import UpdateProvincePage from "@/pages/admin/province/UpdateProvincePage";
import { getFindProvinceByIdQueryOptions } from "@/services/province/province";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/province/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
        await queryClient.ensureQueryData(
            getFindProvinceByIdQueryOptions(Number(params.id)),
        );
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdateProvincePage />;
}
