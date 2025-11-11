import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import WishListPage from "@/pages/client/wish/WishListPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/wish-list")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <ProtectedRoute>
            <WishListPage />
        </ProtectedRoute>
    );
}
