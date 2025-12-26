import { queryClient } from "@/lib/queryClient";
import { SupportDetail } from "@/pages/client/support/SupportDetail";
import { getGetClientSupportTicketByIdQueryOptions } from "@/services/support-controller/support-controller";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/support/detail/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const supportDetail = await queryClient.ensureQueryData(
            getGetClientSupportTicketByIdQueryOptions(+params.id),
        );
        return { supportDetail };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <SupportDetail />;
}
