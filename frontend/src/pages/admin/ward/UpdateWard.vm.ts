import { queryClient } from "@/lib/queryClient";
import { Route } from "@/routes/admin/ward/update.$id";
import { useUpdateWard } from "@/services/ward/ward";
import { updateWardBody } from "@/services/ward/ward.zod";
import type { ApiResponseVoid, WardRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useUpdateWardVM() {
    const { ward } = Route.useLoaderData();
    const form = useForm<WardRequest>({
        defaultValues: {
            ...ward.data,
            provinceId: ward.data?.province?.id,
        },
        mode: "onSubmit",
        resolver: zodResolver(updateWardBody),
    });
    const mutation = useUpdateWard({
        mutation: {
            onSuccess: (data) => {
                toast.success("Cập nhật phường/xã thành công");
                queryClient.invalidateQueries({
                    queryKey: ["/provinces/all"],
                    exact: false,
                });
                form.reset({
                    ...data.data,
                    provinceId: data.data?.province?.id,
                });
            },
            onError: (data) => {
                toast.error("Cập nhật phường/xã thất bại");
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof WardRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
            },
        },
    });
    const onSubmit = (data: WardRequest) => {
        if (!ward.data?.id) return;
        mutation.mutate({ id: ward.data?.id, data: data });
    };

    return { form, onSubmit };
}
