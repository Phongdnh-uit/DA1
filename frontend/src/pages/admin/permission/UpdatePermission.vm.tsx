import { queryClient } from "@/lib/queryClient";
import { Route } from "@/routes/admin/permission/update.$id";
import { useUpdatePermission } from "@/services/permission/permission";
import { updatePermissionBody } from "@/services/permission/permission.zod";
import type { ApiResponseVoid, PermissionRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useUpdatePermissionVM() {
    const { permission } = Route.useLoaderData();
    const form = useForm<PermissionRequest>({
        defaultValues: permission.data,
        mode: "onSubmit",
        resolver: zodResolver(updatePermissionBody),
    });

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
            onError: (data) => {
                toast.error("Cập nhật quyền hạn thất bại");
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof PermissionRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
            },
        },
    });
    const onSubmit = (request: PermissionRequest) => {
        if (!permission?.data?.id) return;
        mutation.mutate({ id: permission.data.id, data: request });
    };
    return { form, onSubmit };
}
