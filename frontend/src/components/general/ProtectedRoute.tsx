import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitializing = useAuthStore((state) => state.isInitializing);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            navigate({
                to: "/auth/login",
                search: {
                    redirect: location.pathname + location.search + location.hash,
                },
            });
        }
    }, [isAuthenticated, navigate, isInitializing]);

    return <>{children}</>;
};
