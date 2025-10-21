import { queryClient } from "@/lib/queryClient";
import { useCreateWard } from "@/services/ward/ward";
import { createWardBody } from "@/services/ward/ward.zod";
import type { WardRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useCreateWardVM() {
    const form = useForm<WardRequest>({
        defaultValues: {
            codeName: "",
            name: "",
            provinceId: undefined,
        },
        mode: "onSubmit",
        resolver: zodResolver(createWardBody),
    });
    const mutation = useCreateWard({
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
        mutation.mutate({ data });
    };

    return { form, onSubmit };
}
