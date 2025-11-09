import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";
import { useGetCurrentUser } from "@/services/auth/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export const AuthInitializer = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const { data, isSuccess, isError } = useGetCurrentUser({
        query: {
            refetchOnWindowFocus: false,
            enabled: !!accessToken,
        },
    });
    useEffect(() => {
        if (isSuccess && data.data) {
            setUser(data.data);
        }
        if (isError) {
            setUser(null);
        }
    }, [data, isSuccess, isError, setUser]);
    return null;
};
