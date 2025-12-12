import { PriceReferenceDetail } from "@/pages/admin/price-reference/PriceReferenceDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/price-reference/detail/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    return <PriceReferenceDetail />;
}
