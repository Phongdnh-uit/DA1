import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { PropertyTypeRequest } from "@/types";
import { createPropertyTypeBody } from "@/services/property-type/property-type.zod";
import { useCreatePropertyType } from "@/services/property-type/property-type";

export function useCreatePropertyTypeVM() {
    const queryClient = useQueryClient();
    const form = useForm<PropertyTypeRequest>({
        defaultValues: {
            name: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(createPropertyTypeBody),
    });
    const mutation = useCreatePropertyType({
        mutation: {
            onSuccess: () => {
                form.reset();
                toast.success("Tạo loại bất động sản thành công");
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey: ["/property-types/all"],
                    exact: false,
                });
            },
            onError: (error) => {
                toast.error("Tạo loại bất động sản thất bại");
                console.error(error);
            },
        },
    });
    const onSubmit = (data: PropertyTypeRequest) => {
        mutation.mutate({ data });
    };
    return { form, onSubmit };
}
