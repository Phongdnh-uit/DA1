import { Route } from "@/routes/admin/province/update.$id";
import {
    useFindProvinceById,
    useUpdateProvince,
} from "@/services/province/province";
import { updateProvinceBody } from "@/services/province/province.zod";
import type { ProvinceRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateProvinceVM() {
    const { id } = Route.useParams();
    const province = useFindProvinceById(+id);
    const form = useForm<ProvinceRequest>({
        defaultValues: {
            code: province.data?.data?.code,
            name: province.data?.data?.name,
            type: province.data?.data?.type,
        },
        mode: "onSubmit",
        resolver: zodResolver(updateProvinceBody),
    });
    const mutation = useUpdateProvince();
    const onSubmit = (data: ProvinceRequest) => {
        mutation.mutate({ id: +id, data: data });
    };

    return { form, onSubmit };
}
