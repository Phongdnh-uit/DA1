import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/lib/queryClient";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <Outlet />
                <ReactQueryDevtools initialIsOpen={false} />
                <TanStackRouterDevtools />
                <ToastContainer />
            </QueryClientProvider>
        </React.Fragment>
    );
}
