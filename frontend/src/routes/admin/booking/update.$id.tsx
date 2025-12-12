import { queryClient } from "@/lib/queryClient";
import UpdateBookingPage from "@/pages/admin/booking/UpdateBookingPage";
import { getFindBookingByIdQueryOptions } from "@/services/booking/booking";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/booking/update/$id")({
    beforeLoad: ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw new Error("Invalid booking ID");
        }
    },
    loader: async ({ params }) => {
        const bookingId = Number(params.id);
        return await queryClient.ensureQueryData(
            getFindBookingByIdQueryOptions(bookingId),
        );
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdateBookingPage />;
}
