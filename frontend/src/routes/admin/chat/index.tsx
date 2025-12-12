import ChatPage from "@/pages/admin/chat/ChatPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/chat/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <ChatPage />;
}
