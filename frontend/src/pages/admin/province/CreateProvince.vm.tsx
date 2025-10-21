import { queryClient } from "@/lib/queryClient";
import { useCreateProvince } from "@/services/province/province";
import { createProvinceBody } from "@/services/province/province.zod";
import type { ProvinceRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useCreateProvinceVM() {
    const form = useForm<ProvinceRequest>({
        defaultValues: {
            codeName: "",
            name: "",
            divisionType: "",
            phoneCode: "",
        },
        mode: "onSubmit",
        resolver: zodResolver(createProvinceBody),
    });
    const mutation = useCreateProvince({
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
    const onSubmit = (data: ProvinceRequest) => {
        mutation.mutate({ data });
    };

    return { form, onSubmit };
}
