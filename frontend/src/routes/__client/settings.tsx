import SettingsPage from "@/pages/client/setting/SettingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/settings")({
    component: RouteComponent,
});

function RouteComponent() {
    return <SettingsPage />;
}
