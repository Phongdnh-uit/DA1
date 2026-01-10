import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponseVoid, PropertyTypeRequest } from "@/types";
import { createPropertyTypeBody } from "@/services/property-type/property-type.zod";
import { Route } from "@/routes/admin/property-type/update.$id";
import { useUpdatePropertyType } from "@/services/property-type/property-type";

export function useUpdatePropertyTypeVM() {
    const queryClient = useQueryClient();
    const { propertyType } = Route.useLoaderData();
    const form = useForm<PropertyTypeRequest>({
        defaultValues: propertyType.data,
        mode: "onSubmit",
        resolver: zodResolver(createPropertyTypeBody),
    });
    const mutation = useUpdatePropertyType({
        mutation: {
            onSuccess: (data) => {
                toast.success("Cập nhật loại bất động sản thành công");
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey: ["/property-types/all"],
                    exact: false,
                });
                form.reset(data.data);
            },
            onError: (data) => {
                toast.error("Cập nhật loại bất động sản thất bại");
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
        if (!propertyType.data?.id) return;
        mutation.mutate({ id: propertyType.data.id, data: data });
    };
    return { form, onSubmit };
}
