import { PreferencesSection } from "./components/PreferenceSection";
import { ProfileSection } from "./components/ProfileSection";
import { SecuritySection } from "./components/SecuritySection";
import { SettingsSidebar } from "./components/SettingsSidebar";

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
                <SettingsSidebar />
                <div className="flex-1 space-y-8">
                    <ProfileSection />
                    <PreferencesSection />
                    <SecuritySection />
                </div>
            </div>
        </main>
    );
}
