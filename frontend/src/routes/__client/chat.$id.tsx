import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import ChatPage from "@/pages/client/chat/ChatPage";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/chat/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(+params.id)) {
            throw notFound();
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <ProtectedRoute>
            <ChatPage />
        </ProtectedRoute>
    );
}
