import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { queryClient } from "@/lib/queryClient";
import SettingsPage from "@/pages/client/setting/SettingPage";
import { getGetCurrentUserQueryOptions } from "@/services/auth/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/settings")({
    loader: async () => {
        await queryClient.ensureQueryData(getGetCurrentUserQueryOptions());
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <ProtectedRoute>
            <SettingsPage />
        </ProtectedRoute>
    );
}
