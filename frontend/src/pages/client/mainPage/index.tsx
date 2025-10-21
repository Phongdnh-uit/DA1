import ClientBanner from "@/components/client/ClientBanner";
import { PropertyList } from "./component/PropertyList";

export const MainPage = (props: {}) => {
    return (
        <>
            <ClientBanner />
            <PropertyList />
        </>
    );
};
