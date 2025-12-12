import type { UserResponse } from "@/types";
import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    isInitializing: boolean;
    user: UserResponse | null;
    setUser: (user: UserResponse | null) => void;
    clearUser: () => void;
    finishInitialization: () => void;
    permissionCodes: string[];
    setPermissionCodes: (codes: string[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isInitializing: true,
    user: null,
    setUser: (user) => set(() => ({ user, isAuthenticated: !!user })),
    clearUser: () =>
        set(() => ({
            user: null,
            isAuthenticated: false,
        })),
    finishInitialization: () => set(() => ({ isInitializing: false })),
    permissionCodes: [],
    setPermissionCodes: (codes) => set(() => ({ permissionCodes: codes })),
}));
