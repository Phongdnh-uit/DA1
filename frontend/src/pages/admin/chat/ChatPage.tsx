"use client";

import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import LeadPanel from "./components/LeadPanel";
import { Card } from "@/components/ui/card";
import type { ConversationResponseStatus } from "@/types";
import ChatWindow from "@/components/chat/ChatWindow";
import { useGetMessagesByConversationIdForManager } from "@/services/chat-message/chat-message";

export default function ChatPage() {
    const [tab, setTab] = useState<ConversationResponseStatus>("PENDING");
    const [selectedConversation, setSelectedConversation] = useState<
        number | null
    >(null);

    const messages = useGetMessagesByConversationIdForManager(
        selectedConversation as number,
        {
            sort: ["createdAt,desc"],
        },
        {
            query: {
                enabled: !!selectedConversation,
                refetchOnWindowFocus: false,
            },
        },
    );

    useEffect(() => {
        setSelectedConversation(null);
    }, [tab]);

    const onLeadChange = ({
        conversationId,
        change,
    }: {
        conversationId: number;
        change: "accepted" | "closed";
    }) => {
        if (change === "closed") {
            setTab("PENDING");
            setSelectedConversation(null);
            return;
        }
        if (change === "accepted") {
            setTab("OPEN");
            setSelectedConversation(conversationId);
        }
    };

    return (
        <Card className="h-full w-full p-0 overflow-hidden rounded-[24px] shadow-md">
            <div className="flex h-full">
                {/* Left Column - Chat List */}
                <ChatList
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    tab={tab}
                    onTabChange={setTab}
                />

                {/* Middle Column - Chat Window */}
                <ChatWindow
                    conversationId={selectedConversation}
                    messages={messages.data?.data?.content || []}
                />

                {/* Right Column - Lead Panel */}
                <LeadPanel
                    selectedConversation={selectedConversation}
                    onLeadChange={onLeadChange}
                />
            </div>
        </Card>
    );
}
