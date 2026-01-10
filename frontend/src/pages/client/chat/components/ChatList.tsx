"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetCurrentUserConversations } from "@/services/conversation/conversation";
import { timeAgo } from "@/utils/formatDate";
import { User } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

interface ChatListProps {
    selectedConversation: number | null;
    onSelectConversation: (id: number) => void;
}

export default function ChatList({
    selectedConversation,
    onSelectConversation,
}: ChatListProps) {
    const user = useAuthStore((state) => state.user);
    const conversations = useGetCurrentUserConversations({
        sort: ["lastMessageAt,DESC"],
    });

    useEffect(() => {
        const firstConversationId = conversations.data?.data?.content?.[0]?.id;
        if (firstConversationId && selectedConversation === null) {
            onSelectConversation(firstConversationId);
        }
    }, [
        conversations.data?.data?.content,
        onSelectConversation,
        selectedConversation,
    ]);

    return (
        <div className="w-80 border-r border-border bg-card flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold text-foreground">Tin nhắn</h1>
            </div>

            {/* Chat Items */}
            <div className="flex-1 overflow-y-auto">
                {conversations.data?.data?.content?.map((conversation, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectConversation(conversation.id as number)}
                        className={`w-full p-3 border-b border-border transition-colors text-left hover:bg-muted ${selectedConversation === conversation.id
                                ? "bg-blue-50 dark:bg-blue-950"
                                : ""
                            }`}
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                                {conversation.participants
                                    ?.filter((participant) => participant?.user?.id !== user?.id)
                                    .map((participant) => (
                                        <>
                                            <AvatarImage
                                                key={participant.user?.id}
                                                src={participant.user?.avatar?.objectName}
                                                alt={participant.user?.fullName}
                                            />
                                            <AvatarFallback>
                                                <User />
                                            </AvatarFallback>
                                        </>
                                    ))}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-semibold text-foreground truncate">
                                        Phiên tư vấn #{conversation.id}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {/* {chat.lastMessage} */}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {timeAgo(conversation.lastMessageAt as string)}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
