import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Send, User, X, Download } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Client, type IMessage } from "@stomp/stompjs";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";
import {
    PresignedUploadRequestPurpose,
    type FileResponse,
    type MessageResponse,
    type PresignedUploadResponse,
} from "@/types";
import { useFileDownload, useFileUpload } from "@/hooks/useFileHook";
import { toast } from "react-toastify";
import { getFileIcon } from "@/utils/renderUtil";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import SpiralLoader from "../ui/SpiralLoader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ACCESS_TOKEN = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

interface ChatWindowProps {
    conversationId: number | null;
    messages: MessageResponse[];
}

export default function ChatWindow({
    conversationId,
    messages,
}: ChatWindowProps) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const clientRef = useRef<Client | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useAuthStore((state) => state.user);
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<PresignedUploadResponse[]>([]);
    const [uploading, setUploading] = useState(false);

    const [realTimeMessages, setRealTimeMessages] = useState<MessageResponse[]>(
        [],
    );

    useEffect(() => {
        if (!conversationId) return;

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            client.subscribe(
                `/topic/conversations/${conversationId}`,
                (message: IMessage) => {
                    const payload = JSON.parse(message.body);
                    setRealTimeMessages((prevMessages) => [...prevMessages, payload]);
                },
            );
        };

        client.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [accessToken, conversationId]);

    const { uploadFile } = useFileUpload();
    const { download } = useFileDownload();

    const sseControllersRef = useRef<Map<string, AbortController>>(new Map());

    const subscribeFileSSE = (objectKey: string) => {
        const controller = new AbortController();
        if (!objectKey) return;

        sseControllersRef.current.set(objectKey, controller);

        let isCancelled = false;

        fetchEventSource(
            `${BACKEND_URL}/sse/files/notifications/${objectKey}/subscribe`,
            {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
                onmessage(event) {
                    try {
                        const data = JSON.parse(event.data);
                        if (!isCancelled) {
                            setAttachments((prev) =>
                                prev.map((att) =>
                                    att.file?.objectName === objectKey
                                        ? {
                                            ...att,
                                            file: {
                                                ...att.file,
                                                status: data.status,
                                            },
                                        }
                                        : att,
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
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploading(true);

        const results = await Promise.allSettled(
            files.map((file) =>
                uploadFile(file, PresignedUploadRequestPurpose.CHAT_FILE),
            ),
        );
        const success = results
            .filter(
                (result): result is PromiseFulfilledResult<PresignedUploadResponse> =>
                    result.status === "fulfilled",
            )
            .map((result) => result.value);
        setAttachments((prev) => [...prev, ...success]);
        const failed = results.filter((r) => r.status === "rejected");
        failed.forEach((v) => {
            toast.error(
                `Tải lên tệp thất bại: ${(v as PromiseRejectedResult).reason}`,
            );
        });
        for (const att of success) {
            subscribeFileSSE(att.file?.objectName as string);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        const isAllUploaded = attachments.every(
            (att) => att.file?.status === "ACTIVE",
        );
        if (isAllUploaded) {
            setUploading(false);
        }
    }, [attachments]);

    const removeAttachment = (index: number) => {
        const att = attachments[index];
        const controller = sseControllersRef.current.get(
            att.file?.objectName as string,
        );
        if (controller) {
            controller.abort();
            sseControllersRef.current.delete(att.file?.objectName as string);
        }
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (
            (!message.trim() && attachments.length === 0) ||
            !clientRef.current ||
            !conversationId
        )
            return;

        let attachmentIds: number[] = [];
        if (attachments.length > 0) {
            attachmentIds = attachments.map((att) => att.file?.id as number);
        }

        const msg = {
            content: message,
            attachmentIds: attachmentIds,
        };

        clientRef.current.publish({
            destination: `/app/conversations/${conversationId}/send-message`,
            body: JSON.stringify(msg),
        });

        setMessage("");
        setAttachments([]);
    };

    // const formatFileSize = (bytes: number): string => {
    //     if (bytes === 0) return "0 Bytes";
    //     const k = 1024;
    //     const sizes = ["Bytes", "KB", "MB", "GB"];
    //     const i = Math.floor(Math.log(bytes) / Math.log(k));
    //     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    // };

    const renderAttachment = (attachment: FileResponse, isOwn: boolean) => {
        return (
            <div
                onClick={() => download(attachment.objectName as string)}
                className={`flex items-center gap-2 mt-2 p-2 rounded-lg border ${isOwn
                        ? "bg-blue-400 border-blue-300"
                        : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    } hover:opacity-80 transition-opacity`}
            >
                {getFileIcon(attachment.originalName || "")}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {attachment.originalName}
                    </p>
                    {/* {attachment.size && ( */}
                    {/*     <p className="text-xs opacity-75"> */}
                    {/*         {formatFileSize(attachment.size)} */}
                    {/*     </p> */}
                    {/* )} */}
                </div>
                <Download className="h-4 w-4 flex-shrink-0" />
            </div>
        );
    };

    const allMessages = [...messages.slice().reverse(), ...realTimeMessages];

    return (
        <div className="flex-1 flex flex-col bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Cuộc trò chuyện
                    </h2>
                    <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {allMessages?.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender?.id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                        {msg.sender?.id !== user?.id && (
                            <Avatar className="h-8 w-8 flex-shrink-0 mr-3">
                                <AvatarImage
                                    src={msg.sender?.avatar?.url || "/placeholder.svg"}
                                    alt={msg.sender?.fullName}
                                />
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={`max-w-sm px-4 py-2 rounded-lg ${msg.sender?.id !== user?.id
                                    ? "bg-gray-100 dark:bg-gray-800 text-foreground rounded-br-none"
                                    : "bg-blue-500 text-white rounded-bl-none"
                                }`}
                        >
                            {msg.content && <p className="text-sm">{msg.content}</p>}
                            {msg.attachments && msg.attachments.length > 0 && (
                                <div className="space-y-2">
                                    {msg.attachments.map((attachment, attIdx: number) => (
                                        <div key={attIdx}>
                                            {renderAttachment(
                                                attachment,
                                                msg.sender?.id === user?.id,
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
                <div className="px-4 py-2 border-t border-border bg-card">
                    <div className="flex flex-wrap gap-2">
                        {attachments.map((attachment, idx) => (
                            <div
                                key={idx}
                                className="relative group flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 pr-8"
                            >
                                {attachment.file?.status === "PENDING" ? (
                                    <SpiralLoader className="size-2" />
                                ) : (
                                    getFileIcon(attachment.file?.originalName || "")
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate max-w-[150px]">
                                        {attachment.file?.originalName}
                                    </p>
                                    {/* <p className="text-xs text-muted-foreground"> */}
                                    {/*     {formatFileSize(attachment.size)} */}
                                    {/* </p> */}
                                </div>
                                <button
                                    onClick={() => removeAttachment(idx)}
                                    className="absolute right-1 top-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2 items-end">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                        disabled={uploading}
                    >
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={uploading}
                    />
                    <Button
                        onClick={handleSend}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
