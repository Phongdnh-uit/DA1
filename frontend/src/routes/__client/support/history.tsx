import { SupportHistoryPage } from "@/pages/client/support/SupportHistoryPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/support/history")({
    component: RouteComponent,
});

function RouteComponent() {
    return <SupportHistoryPage />;
}
