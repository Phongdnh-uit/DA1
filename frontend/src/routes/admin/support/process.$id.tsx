import { queryClient } from "@/lib/queryClient";
import { SupportProcessPage } from "@/pages/admin/support/SupportProcessPage";
import { getGetAdminSupportTicketByIdQueryOptions } from "@/services/support/support";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/support/process/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const supportDetail = await queryClient.ensureQueryData(
            getGetAdminSupportTicketByIdQueryOptions(+params.id),
        );
        return { supportDetail };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <SupportProcessPage />;
}
