import { useAuthStore } from "@/stores/useAuthStore";

export const usePermission = () => {
    const permissionCodes = useAuthStore((state) => state.permissionCodes);
    const user = useAuthStore((state) => state.user);

    const hasPermission = (code: string) => {
        if (!user) return false;
        // Admin has all permissions
        // Note: dirty code, should be improved later
        if (user.roleId === 1) return true;
        return permissionCodes.includes(code);
    };

    return { hasPermission };
};
