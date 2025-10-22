import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import { DeleteDialogGlobal } from "@/components/general/DeleteDialogGlobal";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <Outlet />
                <ReactQueryDevtools initialIsOpen={false} />
                <TanStackRouterDevtools />
                <ToastContainer />
                <DeleteDialogGlobal />
            </QueryClientProvider>
        </React.Fragment>
    );
}
