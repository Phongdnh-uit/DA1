"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Send, User } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Client, type IMessage } from "@stomp/stompjs";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";
import type { MessageResponse } from "@/types";

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
    const user = useAuthStore((state) => state.user);
    const [message, setMessage] = useState("");

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

    const handleSend = () => {
        if (!message.trim() || !clientRef.current || !conversationId) return;
        const msg = {
            content: message,
        };

        clientRef.current.publish({
            destination: `/app/conversations/${conversationId}/send-message`,
            body: JSON.stringify(msg),
        });

        setMessage("");
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
                                    src={msg.sender?.avatarUrl || "/placeholder.svg"}
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
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2 items-end">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                        onClick={handleSend}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
