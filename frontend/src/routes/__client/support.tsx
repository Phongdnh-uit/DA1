import { SupportPage } from "@/pages/client/support/SupportPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/support")({
    component: RouteComponent,
});

function RouteComponent() {
    return <SupportPage />;
}
