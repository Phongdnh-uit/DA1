import { ReportPage } from "@/pages/client/report/ReportPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/report")({
    component: RouteComponent,
});

function RouteComponent() {
    return <ReportPage />;
}
