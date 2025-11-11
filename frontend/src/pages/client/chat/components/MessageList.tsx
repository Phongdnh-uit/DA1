import type React from "react";
export function Scroll({ children }: { children: React.ReactNode }) {
    return <div className="flex-1 overflow-y-auto">{children}</div>;
}
