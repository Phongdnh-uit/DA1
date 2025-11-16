"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useGetMessagesByConversationId } from "@/services/chat-message/chat-message";

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] = useState<
        number | null
    >(null);

    const messages = useGetMessagesByConversationId(
        selectedConversation as number,
        {
            sort: ["createdAt,desc"],
        },
        {
            query: {
                enabled: !!selectedConversation,
            },
        },
    );
    return (
        <main className="flex h-[90vh] w-full p-4">
            <Card className="h-full w-full p-0 overflow-hidden rounded-[24px] shadow-md">
                <div className="flex h-full">
                    {/* Left Column - Chat List */}
                    <ChatList
                        selectedConversation={selectedConversation}
                        onSelectConversation={setSelectedConversation}
                    />

                    {/* Middle Column - Chat Window */}
                    <ChatWindow
                        messages={messages.data?.data?.content || []}
                        conversationId={selectedConversation}
                    />
                </div>
            </Card>
        </main>
    );
}
