import { queryClient } from "@/lib/queryClient";
import { MainPage } from "@/pages/client/mainPage/MainPage";
import { getGetCarouselsQueryOptions } from "@/services/content-block/content-block";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/")({
    loader: async () => {
        const carousel = await queryClient.ensureQueryData(
            getGetCarouselsQueryOptions(),
        );
        return {
            carousel,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <MainPage />;
}
