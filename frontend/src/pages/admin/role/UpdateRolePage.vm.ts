import { Route } from "@/routes/admin/role/update.$id";
import { useFindAllPermission } from "@/services/permission/permission";
import { useFindRoleById, useUpdateRole } from "@/services/role/role";
import { createRoleBody } from "@/services/role/role.zod";
import { type PermissionResponse, type RoleRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function useUpdateRoleVM() {
    const { id } = Route.useParams();

    const [search, setSearch] = useState("");

    const [expandedResource, setExpandedResource] = useState<
        Record<string, boolean>
    >({});

    const { data: role, refetch } = useFindRoleById(+id);

    const { data: permissions } = useFindAllPermission({
        all: true,
    });

    const permissionIds =
        useFindAllPermission({
            all: true,
            filter: `roles.id==${id}`,
        }).data?.data?.content?.map((p) => p.id) ?? [];

    const form = useForm<RoleRequest>({
        defaultValues: {
            name: role?.data?.name || "",
            description: role?.data?.description || "",
            permissionIds: permissionIds,
        },
        mode: "onSubmit",
        resolver: zodResolver(createRoleBody),
    });

    const mutation = useUpdateRole({
        mutation: {
            onSuccess: () => {
                refetch();
                toast.success("Cập nhật vai trò thành công");
            },
            onError: (error) => {
                toast.error("Cập nhật vai trò thất bại: " + error.message);
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
        mutation.mutate({ id: +id, data });
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
                ...new Set([...currentPermissionIds, ...resourcePermissionIds]),
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
