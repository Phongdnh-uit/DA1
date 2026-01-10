import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";

export const Route = createFileRoute("/auth")({
    component: RouteComponent,
});

function RouteComponent() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Outlet key={location.pathname}/>
        </AnimatePresence>
    );
}
