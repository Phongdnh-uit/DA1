import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ACCESS_TOKEN = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export const config = {
    backendUrl: BACKEND_URL,
    accessToken: ACCESS_TOKEN,
};
