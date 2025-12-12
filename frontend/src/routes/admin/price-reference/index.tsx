import { queryClient } from "@/lib/queryClient";
import { PriceReferencePage } from "@/pages/admin/price-reference/PriceReferencePage";
import { getFindAllProvinceQueryOptions } from "@/services/province/province";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/price-reference/")({
    beforeLoad: async () => {
        await queryClient.ensureQueryData(getFindAllProvinceQueryOptions());
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <PriceReferencePage />;
}
