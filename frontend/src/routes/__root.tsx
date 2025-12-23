import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import { DeleteDialogGlobal } from "@/components/general/DeleteDialogGlobal";
import { AuthInitializer } from "@/components/general/AuthInitializer";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { RouterProgressBar } from "@/components/general/RouterProgressBar";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const { isDarkMode } = useDarkMode();
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    useEffect(() => { }, [isDarkMode]);
    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <RouterProgressBar />
                <AuthInitializer />
                <Outlet />
                <ReactQueryDevtools initialIsOpen={false} />
                <TanStackRouterDevtools />
                <ToastContainer 
                    position="bottom-right"
                />
                <DeleteDialogGlobal />
            </QueryClientProvider>
        </React.Fragment>
    );
}
