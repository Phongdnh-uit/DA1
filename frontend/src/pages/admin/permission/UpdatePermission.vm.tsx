import { queryClient } from "@/lib/queryClient";
import { Route } from "@/routes/admin/permission/update.$id";
import {
    useFindPermissionById,
    useUpdatePermission,
} from "@/services/permission/permission";
import { updatePermissionBody } from "@/services/permission/permission.zod";
import type { PermissionRequest, PermissionResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useUpdatePermissionVM(data?: PermissionResponse) {
    const { id } = Route.useParams();
    const permission = useFindPermissionById(+id);
    const form = useForm<PermissionRequest>({
        defaultValues: {
            name: permission.data?.data?.name,
            resource: permission.data?.data?.resource,
            urlPattern: permission.data?.data?.urlPattern,
            method: permission.data?.data?.method,
        },
        mode: "onSubmit",
        resolver: zodResolver(updatePermissionBody),
    });

    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    const mutation = useUpdatePermission({
        mutation: {
            onSuccess: () => {
                form.reset();
                toast.success("Cập nhật quyền hạn thành công");
                queryClient.invalidateQueries({
                    queryKey: ["/permissions/all"],
                    exact: false,
                });
            },
            onError: (error) => {
                toast.error("Cập nhật quyền hạn thất bại");
                console.error(error);
            },
        },
    });
    const onSubmit = (request: PermissionRequest) => {
        if (!data || !data.id) return;
        mutation.mutate({ id: data.id, data: request });
    };
    return { form, onSubmit };
}
