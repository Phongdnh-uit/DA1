import { MainPage } from "@/pages/client/mainPage/MainPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <MainPage />;
}
