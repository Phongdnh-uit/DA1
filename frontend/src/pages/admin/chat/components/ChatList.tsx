"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useFindAllConversations } from "@/services/conversation/conversation";
import { timeAgo } from "@/utils/formatDate";
import { User } from "lucide-react";
import { ConversationResponseStatus } from "@/types/conversationResponseStatus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

interface ChatListProps {
    selectedConversation: number | null;
    onSelectConversation: (id: number) => void;
    tab: ConversationResponseStatus;
    onTabChange: (tab: ConversationResponseStatus) => void;
}

export default function ChatList({
    selectedConversation,
    onSelectConversation,
    tab,
    onTabChange,
}: ChatListProps) {
    const user = useAuthStore((state) => state.user);
    const conversations = useFindAllConversations({
        sort: ["lastMessageAt,desc"],
        filter: `status==${tab}`,
    });

    useEffect(() => {
        const firstConversationId = conversations.data?.data?.content?.[0]?.id;
        if (firstConversationId && !selectedConversation) {
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

            {/* Tabs */}
            <div className="flex border-b border-border">
                {Object.keys(ConversationResponseStatus).map((status, idx) => (
                    <button
                        key={idx}
                        onClick={() => onTabChange(status as ConversationResponseStatus)}
                        className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${tab === status
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span>{status}</span>
                            {/* {isPending && ( */}
                            {/*     <Badge className="bg-yellow-500 text-white text-xs"> */}
                            {/*         {chats.length} */}
                            {/*     </Badge> */}
                            {/* )} */}
                        </div>
                    </button>
                ))}
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
                                    ?.filter((participant) => participant.user?.id !== user?.id)
                                    .map((participant) => (
                                        <>
                                            <AvatarImage
                                                key={participant.user.id}
                                                src={participant.user?.avatarUrl}
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
                                        {conversation.participants
                                            ?.filter((p) => p.user?.id !== user?.id)
                                            ?.map((p) => p.user?.fullName)
                                            .join(", ")}
                                    </h3>
                                    {tab === "PENDING" && (
                                        <Badge className="bg-yellow-400 text-gray-800 text-xs flex-shrink-0">
                                            Mới
                                        </Badge>
                                    )}
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
