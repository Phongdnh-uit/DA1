import { SupportDetail } from "@/pages/client/support/SupportDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/support/detail")({
    component: RouteComponent,
});

function RouteComponent() {
    return <SupportDetail onBack={() => { }} />;
}
