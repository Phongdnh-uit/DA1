import { Route } from "@/routes/admin/booking/update.$id";
import { useUpdateBooking } from "@/services/booking/booking";
import { updateBookingBody } from "@/services/booking/booking.zod";
import type { BookingRequest, BookingRequestType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2Icon, FileTextIcon, HomeIcon, InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useUpdateBookingVM = () => {
    const booking = Route.useLoaderData();
    const consultationTypes = [
        {
            value: "BUY_ADVICE",
            label: "Tư vấn mua nhà",
            icon: HomeIcon,
            color:
                "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
        },
        {
            value: "SELL_ADVICE",
            label: "Tư vấn bán bất động sản",
            icon: Building2Icon,
            color:
                "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
        },
        {
            value: "LEGAL_ADVICE",
            label: "Tư vấn pháp lý",
            icon: FileTextIcon,
            color:
                "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
        },
        {
            value: "OTHER",
            label: "Khác",
            icon: InfoIcon,
            color:
                "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
        },
    ] as {
        value: BookingRequestType;
        label: string;
        icon: React.ComponentType<unknown>;
        color: string;
    }[];

    const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    const createBooking = useUpdateBooking({
        mutation: {
            onSuccess: () => {
                toast.success("Cập nhật lịch tư vấn thành công!");
                form.reset();
            },
            onError: (error) => {
                console.log("Error creating booking:", error);
                toast.error(`Cập nhật lịch tư vấn thất bại.Vui lòng thử lại sau.`);
            },
        },
    });

    const form = useForm<BookingRequest>({
        defaultValues: {
            name: booking.data?.name,
            phone: booking.data?.phone,
            email: booking.data?.email,
            type: booking.data?.type,
            note: booking.data?.note,
            date: booking.data?.date,
            time: booking.data?.time,
            status: booking.data?.status,
        },
        mode: "onSubmit",
        resolver: zodResolver(updateBookingBody),
    });

    const onSubmit = (data: BookingRequest) => {
        createBooking.mutate({ id: booking?.data?.id as number, data: data });
    };

    return {
        form,
        onSubmit,
        createBooking,
        timeSlots,
        consultationTypes,
    };
};
