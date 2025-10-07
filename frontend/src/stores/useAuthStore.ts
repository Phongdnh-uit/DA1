import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    otpDestination: string | null;
    setOtpDestination: (destination: string) => void;
    verificationToken: string | null;
    setVerificationToken: (token: string) => void;
}

export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            verificationToken: null,
            otpDestination: null,
            setOtpDestination: (destination: string) =>
                set({ otpDestination: destination }),
            setVerificationToken: (token: string) =>
                set({ verificationToken: token }),
        }),
        {
            name: "auth-session",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
