import ClientFooter from "@/components/client/ClientFooter";
import ClientHeader from "@/components/client/ClientHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/__client")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <ClientHeader />
            <main>
                <Outlet />
            </main>
            <ClientFooter />
        </>
    );
}
