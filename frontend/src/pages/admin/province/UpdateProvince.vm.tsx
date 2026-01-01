import { Route } from "@/routes/admin/province/update.$id";
import { useUpdateProvince } from "@/services/province/province";
import { updateProvinceBody } from "@/services/province/province.zod";
import type { ApiResponseVoid, ProvinceRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useUpdateProvinceVM() {
    const { province } = Route.useLoaderData();
    const form = useForm<ProvinceRequest>({
        defaultValues: province.data,
        mode: "onSubmit",
        resolver: zodResolver(updateProvinceBody),
    });
    const mutation = useUpdateProvince({
        mutation: {
            onSuccess: (data) => {
                toast.success("Cập nhật tỉnh/thành công");
                form.reset(data.data);
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
        if (!province.data?.id) return;
        mutation.mutate({ id: province.data.id, data: data });
    };

    return { form, onSubmit };
}
