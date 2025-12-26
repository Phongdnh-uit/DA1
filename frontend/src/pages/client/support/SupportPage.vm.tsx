import { useFileDownload, useFileUpload } from "@/hooks/useFileHook";
import { config } from "@/lib/config";
import { useCreateSupportTicket } from "@/services/support-controller/support-controller";
import { createSupportTicketBody } from "@/services/support-controller/support-controller.zod";
import { useAuthStore } from "@/stores/useAuthStore";
import type { FileResponse, SupportRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useSupportVM = () => {
    const sseControllersRef = useRef<Map<string, AbortController>>(new Map());
    const user = useAuthStore((state) => state.user);
    const form = useForm<SupportRequest>({
        defaultValues: {
            type: undefined,
            title: "",
            description: "",
            severity: undefined,
        },
        mode: "onSubmit",
        resolver: zodResolver(createSupportTicketBody),
    });

    const [attachments, setAttachments] = useState<FileResponse[]>([]);

    const createSupportTicket = useCreateSupportTicket({
        mutation: {
            onSuccess: () => {
                form.reset();
                toast.success("Khiếu nại của bạn đã được gửi thành công!");
                setAttachments([]);
            },
            onError: () => {
                toast.error("Đã xảy ra lỗi khi gửi khiếu nại. Vui lòng thử lại.");
            },
        },
    });

    const onSubmit = (data: SupportRequest) => {
        createSupportTicket.mutate({
            data: {
                ...data,
                attachmentIds: attachments.map((file) => file.id as number),
            },
        });
    };

    const { uploadFile } = useFileUpload();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        await Promise.all(
            Array.from(files || []).map(async (file) => {
                const response = await uploadFile(file, "SUPPORT_TICKET_ATTACHMENT");
                setAttachments((prev) => [...prev, { ...response.file }]);
                subscribeFileSSE(response.file?.objectName as string);
                return response;
            }),
        );
    };

    const onAttachmentRemove = (index: number) => {
        const toRemove = attachments[index];
        const controller = sseControllersRef.current.get(
            toRemove.objectName as string,
        );
        if (controller) {
            controller.abort();
            sseControllersRef.current.delete(toRemove.objectName as string);
        }
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const subscribeFileSSE = useCallback((objectKey: string) => {
        const controller = new AbortController();
        if (!objectKey) return;

        sseControllersRef.current.set(objectKey, controller);

        let isCancelled = false;

        fetchEventSource(
            `${config.backendUrl}/sse/files/notifications/${objectKey}/subscribe`,
            {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${config.accessToken}`,
                },
                onmessage(event) {
                    try {
                        if (event.event !== "file-process") return;
                        console.log("SSE message received:", event);
                        const data = JSON.parse(event.data);
                        if (!isCancelled) {
                            setAttachments((prev) =>
                                prev.map((file) =>
                                    file.objectName === objectKey
                                        ? { ...file, status: data.status }
                                        : file,
                                ),
                            );
                        }
                    } catch (err) {
                        console.error("Invalid JSON from SSE", err);
                    }
                },
                onerror(err) {
                    console.error("SSE error", err);
                    if (!isCancelled) throw err;
                },
                signal: controller.signal,
            },
        );

        return () => {
            isCancelled = true;
        };
    }, []);

    const { download } = useFileDownload();

    return {
        download,
        attachments,
        onAttachmentRemove,
        form,
        onSubmit,
        userName: user?.fullName,
        userEmail: user?.email,
        handleUpload,
    };
};
