import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthSessionState {
    otpDestination: string | null;
    setOtpDestination: (destination: string) => void;
    verificationToken: string | null;
    setVerificationToken: (token: string) => void;
}

export const useAuthSessionStore = create(
    persist<AuthSessionState>(
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
