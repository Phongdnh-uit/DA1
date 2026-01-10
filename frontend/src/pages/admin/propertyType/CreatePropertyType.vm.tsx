import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponseVoid, PropertyTypeRequest } from "@/types";
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
                toast.success("Tạo loại bất động sản thành công");
                queryClient.invalidateQueries({
                    queryKey: ["/property-types/all"],
                    exact: false,
                });
                form.reset();
            },
            onError: (data) => {
                toast.error("Tạo loại bất động sản thất bại");
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof PropertyTypeRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
            },
        },
    });
    const onSubmit = (data: PropertyTypeRequest) => {
        mutation.mutate({ data });
    };
    return { form, onSubmit };
}
