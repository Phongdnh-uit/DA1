import { createFileRoute } from "@tanstack/react-router";
import reactLogo from "../assets/react.svg";
import viteLogo from "../../public/vite.svg";
import ClientHeader from "@/components/client/ClientHeader";
import ClientBanner from "@/components/client/ClientBanner";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <ClientHeader />
            <ClientBanner />
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
        </>
    );
}
