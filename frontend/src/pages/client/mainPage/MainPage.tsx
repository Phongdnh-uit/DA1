import ClientBanner from "@/components/client/ClientBanner";
import { PropertyList } from "./component/PropertyList";
import { FeaturesSection } from "./component/FeaturesSection";
import { CTASection } from "./component/CTASection";
import { TestimonialsSection } from "./component/TestimonialsSection";

export const MainPage = () => {
    return (
        <>
            <ClientBanner />
            <FeaturesSection />
            <PropertyList />
            <TestimonialsSection />
            <CTASection />
        </>
    );
};
