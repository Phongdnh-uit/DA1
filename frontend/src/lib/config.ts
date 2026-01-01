import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const ACCESS_TOKEN = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
const WEBSOCKET_URL =
    import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080/ws";

export const config = {
    backendUrl: BACKEND_URL,
    accessToken: ACCESS_TOKEN,
    websocketUrl: WEBSOCKET_URL,
};
