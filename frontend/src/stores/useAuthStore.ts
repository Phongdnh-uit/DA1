import type { UserResponse } from "@/types";
import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    user: UserResponse | null;
    setUser: (user: UserResponse | null) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    setUser: (user) => set(() => ({ isAuthenticated: user !== null, user })),
    clearUser: () => set(() => ({ isAuthenticated: false, user: null })),
}));
