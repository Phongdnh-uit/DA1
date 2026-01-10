import OTPVerificationPage from "@/pages/auth/OTPVerificationPage";
import { VerifyOtpRequestPurpose } from "@/types";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/otp-verification")({
    validateSearch: (search) => ({
        purpose: search.purpose as VerifyOtpRequestPurpose,
        isOAR: search.isOAR,
    }),
    beforeLoad: ({ search }) => {
        if (
            !search.purpose ||
            !Object.values(VerifyOtpRequestPurpose).includes(
                search.purpose as VerifyOtpRequestPurpose,
            )
        ) {
            throw notFound();
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <OTPVerificationPage />;
}
