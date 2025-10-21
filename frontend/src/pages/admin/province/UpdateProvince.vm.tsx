import { useUpdateProvince } from "@/services/province/province";
import { createProvinceBody } from "@/services/province/province.zod";
import type { ProvinceRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateProvinceVM() {
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
    const mutation = useUpdateProvince();
    const onSubmit = (data: ProvinceRequest) => {
        mutation.mutate({ data });
    };

    return { form, onSubmit };
}
