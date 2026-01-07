import { queryClient } from "@/lib/queryClient";
import { useCreateWard } from "@/services/ward/ward";
import { createWardBody } from "@/services/ward/ward.zod";
import type { ApiResponseVoid, WardRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useCreateWardVM() {
    const form = useForm<WardRequest>({
        defaultValues: {
            code: "",
            type: "",
            name: "",
            provinceId: undefined,
        },
        mode: "onSubmit",
        resolver: zodResolver(createWardBody),
    });
    const mutation = useCreateWard({
        mutation: {
            onSuccess: () => {
                toast.success("Tạo phường/xã thành công");
                queryClient.invalidateQueries({
                    queryKey: ["/provinces/all"],
                    exact: false,
                });
                form.reset();
            },
            onError: (data) => {
                toast.error("Tạo phường/xã thất bại");
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof WardRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
            }
        },
    });
    const onSubmit = (data: WardRequest) => {
        mutation.mutate({ data });
    };

    return { form, onSubmit };
}
