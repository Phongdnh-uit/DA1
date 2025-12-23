import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import ChatPage from "@/pages/client/chat/ChatPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/chat")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <ProtectedRoute>
            <ChatPage />
        </ProtectedRoute>
    );
}
