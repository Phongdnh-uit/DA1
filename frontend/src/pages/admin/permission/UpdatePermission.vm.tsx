import { useUpdatePermission } from "@/services/permission/permission";
import { updatePermissionBody } from "@/services/permission/permission.zod";
import type { PermissionRequest, PermissionResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function useUpdatePermissionVM(data?: PermissionResponse) {
    const queryClient = useQueryClient();
    const form = useForm<PermissionRequest>({
        defaultValues: {
            name: "",
            resource: "",
            action: "READ",
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
                toast.success("Create successfully");
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey: ["/permissions/all"],
                    exact: false,
                });
            },
            onError: (error) => {
                toast.error("Create failed");
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
