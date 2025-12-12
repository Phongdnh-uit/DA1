import { ListingPage } from "@/pages/client/property/ListingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/properties")({
    component: RouteComponent,
});

function RouteComponent() {
    return <ListingPage />;
}
