import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";
import {
    useGetCurrentUser,
    useGetCurrentUserPermissionCodes,
} from "@/services/auth/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export const AuthInitializer = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const setPermissionCodes = useAuthStore((state) => state.setPermissionCodes);
    const finishInitialization = useAuthStore(
        (state) => state.finishInitialization,
    );
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const {
        data: userData,
        isSuccess: loadUserSuccess,
        isError: loadUserError,
    } = useGetCurrentUser({
        query: {
            refetchOnWindowFocus: false,
            enabled: !!accessToken,
        },
    });

    const {
        data: permissionCodes,
        isSuccess: loadPermissionSuccess,
        isError: loadPermissionError,
    } = useGetCurrentUserPermissionCodes({
        query: {
            refetchOnWindowFocus: false,
            enabled: !!accessToken,
        },
    });

    useEffect(() => {
        if (!accessToken) {
            finishInitialization();
        }
    }, [accessToken, finishInitialization]);

    useEffect(() => {
        if (loadUserSuccess && userData.data) {
            setUser(userData.data);
        }
        if (loadUserError) {
            setUser(null);
        }
    }, [
        setUser,
        finishInitialization,
        loadUserSuccess,
        userData?.data,
        loadUserError,
    ]);

    useEffect(() => {
        if (loadPermissionSuccess && permissionCodes.data) {
            setPermissionCodes(permissionCodes.data);
        }
        if (loadPermissionError) {
            setPermissionCodes([]);
        }
    }, [
        loadPermissionSuccess,
        permissionCodes?.data,
        loadPermissionError,
        setPermissionCodes,
    ]);

    useEffect(() => {
        if (
            (loadUserSuccess || loadUserError) &&
            (loadPermissionSuccess || loadPermissionError)
        ) {
            finishInitialization();
        }
    }, [
        loadUserSuccess,
        loadUserError,
        loadPermissionSuccess,
        loadPermissionError,
        finishInitialization,
    ]);

    return null;
};
