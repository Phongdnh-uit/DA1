import { queryClient } from "@/lib/queryClient";
import { Route } from "@/routes/admin/ward/update.$id";
import { useFindWardById, useUpdateWard } from "@/services/ward/ward";
import { updateWardBody } from "@/services/ward/ward.zod";
import type { WardRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useUpdateWardVM() {
    const { id } = Route.useParams();
    const ward = useFindWardById(+id);
    const form = useForm<WardRequest>({
        defaultValues: {
            code: ward.data?.data?.code,
            type: ward.data?.data?.type,
            name: ward.data?.data?.name,
            provinceId: ward.data?.data?.province?.id,
        },
        mode: "onSubmit",
        resolver: zodResolver(updateWardBody),
    });
    const mutation = useUpdateWard({
        mutation: {
            onSuccess: () => {
                toast.success("Create province successfully");
                queryClient.invalidateQueries({
                    queryKey: ["/provinces/all"],
                    exact: false,
                });
            },
        },
    });
    const onSubmit = (data: WardRequest) => {
        mutation.mutate({ id: +id, data: data });
    };

    return { form, onSubmit };
}
