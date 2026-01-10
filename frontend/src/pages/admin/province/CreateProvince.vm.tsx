import { queryClient } from "@/lib/queryClient";
import { useCreateProvince } from "@/services/province/province";
import { createProvinceBody } from "@/services/province/province.zod";
import type { ApiResponseVoid, ProvinceRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useCreateProvinceVM() {
    const form = useForm<ProvinceRequest>({
        defaultValues: {
            code: "",
            name: "",
            type: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(createProvinceBody),
    });
    const mutation = useCreateProvince({
        mutation: {
            onSuccess: () => {
                toast.success("Tạo tỉnh/thành phố thành công");
                queryClient.invalidateQueries({
                    queryKey: ["/provinces/all"],
                    exact: false,
                });
                form.reset();
            },
            onError: (data) => {
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof ProvinceRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
            },
        },
    });
    const onSubmit = (data: ProvinceRequest) => {
        mutation.mutate({ data });
    };

    return { form, onSubmit };
}
