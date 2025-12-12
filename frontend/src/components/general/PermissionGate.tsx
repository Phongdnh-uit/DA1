import { usePermission } from "@/hooks/usePermission";
import type { ReactNode } from "react";

interface PermissionGateProps {
    children: ReactNode;
    permission: string;
    renderOtherwise?: ReactNode;
}

const PermissionGate = ({
    children,
    permission,
    renderOtherwise,
}: PermissionGateProps) => {
    const { hasPermission } = usePermission();

    if (hasPermission(permission)) {
        return <>{children}</>;
    }

    return renderOtherwise ? <>{renderOtherwise}</> : null;
};

export default PermissionGate;
