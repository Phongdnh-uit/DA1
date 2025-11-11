"use client";

import { useState } from "react";
import { Send, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";
import { useGetCurrentUserConversations } from "@/services/chat/chat";

interface Message {
    id: string;
    sender: "customer" | "staff";
    content: string;
    timestamp: string;
    senderName: string;
    senderRole: string;
}

export default function MessagingInterface() {
    const listConversations = useGetCurrentUserConversations();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "staff",
            content:
                "Xin chào! Tôi là Minh, nhân viên tư vấn bất động sản. Tôi có thể giúp bạn tìm kiếm những bất động sản phù hợp với nhu cầu của mình.",
            timestamp: "10:30",
            senderName: "Minh Nguyễn",
            senderRole: "Chuyên viên tư vấn",
        },
        {
            id: "2",
            sender: "customer",
            content:
                "Chào Minh! Tôi đang tìm kiếm một căn hộ 2 phòng ngủ ở quận 1, giá khoảng 3-4 tỷ.",
            timestamp: "10:31",
            senderName: "Bạn",
            senderRole: "Khách hàng",
        },
        {
            id: "3",
            sender: "staff",
            content:
                'Hoàn hảo! Tôi có một số dự án rất tốt phù hợp với yêu cầu của bạn. Bạn có thể xem chi tiết các bất động sản này ở mục "Dự án gợi ý" hoặc tôi có thể gửi hình ảnh cho bạn.',
            timestamp: "10:32",
            senderName: "Minh Nguyễn",
            senderRole: "Chuyên viên tư vấn",
        },
        {
            id: "4",
            sender: "customer",
            content:
                "Vâng, tôi muốn xem hình ảnh trước. Bạn có thể gửi cho tôi xem không?",
            timestamp: "10:33",
            senderName: "Bạn",
            senderRole: "Khách hàng",
        },
    ]);

    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage: Message = {
                id: String(messages.length + 1),
                sender: "customer",
                content: inputValue,
                timestamp: new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                senderName: "Bạn",
                senderRole: "Khách hàng",
            };
            setMessages([...messages, newMessage]);
            setInputValue("");

            // Simulate staff response
            setTimeout(() => {
                const staffResponse: Message = {
                    id: String(messages.length + 2),
                    sender: "staff",
                    content: "Tôi sẽ xem xét yêu cầu của bạn. Vui lòng chờ một chút!",
                    timestamp: new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    senderName: "Minh Nguyễn",
                    senderRole: "Chuyên viên tư vấn",
                };
                setMessages((prev) => [...prev, staffResponse]);
            }, 1500);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Conversation List Sidebar */}
            <div className="hidden lg:flex w-80 bg-card border-r border-border flex-col">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground mb-4">Tin nhắn</h2>
                    <Input
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        className="bg-muted border-border"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {listConversations.data?.data?.content?.map((conversation) => (
                        <div className="p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Minh" />
                                    <AvatarFallback>MN</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground text-sm">
                                        Minh Nguyễn
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Tôi sẽ xem xét yêu cầu của bạn...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 bg-background">
                {/* Header */}
                <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Minh" />
                            <AvatarFallback>MN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-bold text-foreground">Minh Nguyễn</h1>
                            <p className="text-sm text-muted-foreground">
                                Chuyên viên tư vấn bất động sản
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <Info className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-card border-t border-border px-6 py-4">
                    <div className="flex items-end gap-3">
                        <Input
                            placeholder="Nhập tin nhắn của bạn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="flex-1 bg-muted border-border resize-none"
                        />
                        <Button
                            onClick={handleSendMessage}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="icon"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
