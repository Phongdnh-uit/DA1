import ClientBanner from "@/components/client/ClientBanner";
import { PropertyList } from "./component/PropertyList";
import { MyChatRuntimeProvider } from "@/components/general/MyChatRuntimeProvider";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { FeaturesSection } from "./component/FeaturesSection";
import { CTASection } from "./component/CTASection";
import { TestimonialsSection } from "./component/TestimonialsSection";

export const MainPage = () => {
    return (
        <>
            <ClientBanner />
            <FeaturesSection />
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PropertyList />
            </div>
            <TestimonialsSection />
            <CTASection />
            <MyChatRuntimeProvider>
                <AssistantModal />
            </MyChatRuntimeProvider>
        </>
    );
};
