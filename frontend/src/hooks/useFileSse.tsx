import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const ACCESS_TOKEN = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export function useFileSSE(objectKey: string | null) {
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        if (!objectKey) return;

        let isCancelled = false;

        const subscribe = async () => {
            try {
                await fetchEventSource(
                    `${BACKEND_URL}/sse/files/notifications/${objectKey}/subscribe`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "text/event-stream",
                            Authorization: `Bearer ${ACCESS_TOKEN}`,
                        },
                        onmessage(event) {
                            // fetch-event-source sẽ gọi tất cả sự kiện SSE
                            // nếu bạn muốn filter theo event type:
                            if (event.event === "file-process") {
                                try {
                                    const data = JSON.parse(event.data);
                                    if (!isCancelled) setEventData(data);
                                } catch (err) {
                                    console.error("Invalid JSON from SSE", err);
                                }
                            }
                        },
                        onerror(err) {
                            console.error("SSE error", err);
                            if (!isCancelled) throw err;
                        },
                    },
                );
            } catch (err) {
                console.error("SSE connection failed", err);
            }
        };

        subscribe();

        return () => {
            isCancelled = true;
        };
    }, [objectKey]);

    return eventData;
}
