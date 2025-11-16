import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PermissionRequest } from "@/types/permissionRequest";
import { createPermissionBody } from "@/services/permission/permission.zod";
import { useCreatePermission } from "@/services/permission/permission";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export function useCreatePermissionVM() {
    const queryClient = useQueryClient();
    const form = useForm<PermissionRequest>({
        defaultValues: {
            name: "",
            resource: "",
            method: "GET",
            urlPattern: "/",
        },
        mode: "onSubmit",
        resolver: zodResolver(createPermissionBody),
    });
    const mutation = useCreatePermission({
        mutation: {
            onSuccess: () => {
                form.reset();
                toast.success("Tạo quyền thành công");
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey: ["/permissions/all"],
                    exact: false,
                });
            },
            onError: (error) => {
                toast.error("Tạo quyền thất bại");
                console.error(error);
            },
        },
    });
    const onSubmit = (data: PermissionRequest) => {
        mutation.mutate({ data });
    };
    return { form, onSubmit };
}
