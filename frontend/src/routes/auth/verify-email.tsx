import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify-email")({
    validateSearch: (search: { code?: string }) => ({
        code: search.code,
    }),
    beforeLoad: ({ search }) => {
        if (!search.code) {
            throw notFound();
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <VerifyEmailPage />;
}
