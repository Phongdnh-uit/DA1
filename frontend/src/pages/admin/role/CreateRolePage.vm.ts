import { useFindAllPermission } from "@/services/permission/permission";
import { useCreateRole } from "@/services/role/role";
import { createRoleBody } from "@/services/role/role.zod";
import { type ApiResponseVoid, type PermissionResponse, type RoleRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function useCreateRoleVM() {
    const [search, setSearch] = useState("");

    const [expandedResource, setExpandedResource] = useState<
        Record<string, boolean>
    >({});

    const { data: permissions } = useFindAllPermission({ all: true });

    const form = useForm<RoleRequest>({
        defaultValues: {
            name: "",
            description: "",
            permissionIds: [],
            canManage: false,
            default: false,
            accessibleModules: [],
        },
        mode: "onSubmit",
        resolver: zodResolver(createRoleBody),
    });

    const mutation = useCreateRole({
        mutation: {
            onSuccess: () => {
                form.reset();
                toast.success("Tạo vai trò thành công");
            },
            onError: (data) => {
                const errorResponse = data.response?.data as ApiResponseVoid;
                if (errorResponse.errors) {
                    Object.entries(errorResponse.errors).forEach(([key, value]) => {
                        form.setError(key as keyof RoleRequest, {
                            type: "server",
                            message: value as string,
                        });
                    });
                }
                if (errorResponse?.errors?.["isDefault"]) {
                    form.setError("default", {
                        type: "server",
                        message: errorResponse.errors["isDefault"] as string,
                    });
                }
                toast.error("Tạo vai trò thất bại");
            },
        },
    });

    const groupedPermissions: Record<string, PermissionResponse[]> =
        permissions?.data?.content
            ?.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
            .reduce<Record<string, PermissionResponse[]>>((acc, permission) => {
                const key = permission.resource as string;
                if (!acc[key]) acc[key] = [];
                acc[key].push(permission);
                return acc;
            }, {}) ?? {};

    const onSubmit = (data: RoleRequest) => {
        mutation.mutate({ data });
    };

    const togglePermission = (permissionId: number) => {
        const current = form.getValues("permissionIds") || [];
        const updated = current.includes(permissionId)
            ? current.filter((id) => id !== permissionId)
            : [...current, permissionId];
        form.setValue("permissionIds", updated);
    };

    const toggleResourcePermission = (
        resource: string,
        allCategorySelected: boolean,
    ) => {
        const currentPermissionIds = form.getValues("permissionIds") || [];
        const resourcePermissionIds =
            groupedPermissions[resource]?.map((p) => p.id) ?? [];

        let updatedPermissionIds: number[];
        if (!allCategorySelected) {
            updatedPermissionIds = [
                ...new Set([...currentPermissionIds, ...resourcePermissionIds] as number[]),
            ];
        } else {
            updatedPermissionIds = currentPermissionIds.filter(
                (id) => !resourcePermissionIds.includes(id),
            );
        }

        form.setValue("permissionIds", updatedPermissionIds);
    };

    const searchDebounced = useMemo(
        () =>
            debounce((value: string) => {
                setSearch(value);
            }, 500),
        [],
    );

    useEffect(() => {
        return () => {
            searchDebounced.cancel();
        };
    }, [searchDebounced]);
    return {
        searchDebounced,
        expandedResource,
        setExpandedResource,
        flattenedPermissions: permissions?.data?.content ?? [],
        togglePermission,
        toggleResourcePermission,
        onSubmit,
        form,
        groupedPermissions,
    };
}
