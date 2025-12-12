import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { PropertyTypeRequest } from "@/types";
import { createPropertyTypeBody } from "@/services/property-type/property-type.zod";
import { Route } from "@/routes/admin/property-type/update.$id";
import {
    useFindPropertyTypeById,
    useUpdatePropertyType,
} from "@/services/property-type/property-type";

export function useUpdatePropertyTypeVM() {
    const { id } = Route.useParams();
    const queryClient = useQueryClient();
    const propertyType = useFindPropertyTypeById(+id);
    const form = useForm<PropertyTypeRequest>({
        defaultValues: {
            name: propertyType.data?.data?.name,
        },
        mode: "onSubmit",
        resolver: zodResolver(createPropertyTypeBody),
    });
    const mutation = useUpdatePropertyType({
        mutation: {
            onSuccess: () => {
                form.reset();
                toast.success("Cập nhật loại bất động sản thành công");
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey: ["/property-types/all"],
                    exact: false,
                });
            },
            onError: (error) => {
                toast.error("Cập nhật loại bất động sản thất bại");
                console.error(error);
            },
        },
    });
    const onSubmit = (data: PropertyTypeRequest) => {
        mutation.mutate({ id: +id, data: data });
    };
    return { form, onSubmit };
}
