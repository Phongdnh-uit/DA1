import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import ClientFooter from "@/components/client/ClientFooter";
import ClientHeader from "@/components/client/ClientHeader";
import { FloatingCompareBar } from "@/components/general/FloatingCompareBar";
import { MyChatRuntimeProvider } from "@/components/general/MyChatRuntimeProvider";
import { SupportButton } from "@/components/general/SupportButton";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/__client")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <main>
            <ClientHeader />
            <div className="bg-neutral-100 dark:bg-neutral-900">
                <Outlet />
            </div>
            <FloatingCompareBar />
            <ClientFooter />
            <MyChatRuntimeProvider>
                <AssistantModal />
            </MyChatRuntimeProvider>
            <SupportButton />
        </main>
    );
}
