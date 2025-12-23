"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFilePreview } from "@/hooks/useFileHook";
import {
    useCloseConversation,
    useGetConversationById,
    useParticipateInConversation,
} from "@/services/conversation/conversation";
import { useFindPropertyById } from "@/services/property/property";
import { formatCurrency } from "@/utils/converter";
import { Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";

interface LeadPanelProps {
    selectedConversation: number | null;
    onLeadChange?: ({
        conversationId,
        change,
    }: {
        conversationId: number;
        change: "accepted" | "closed";
    }) => void;
}

export default function LeadPanel({
    selectedConversation,
    onLeadChange,
}: LeadPanelProps) {
    console.log(selectedConversation);
    const conversation = useGetConversationById(selectedConversation as number, {
        query: {
            enabled: selectedConversation !== null,
        },
    });
    const property = useFindPropertyById(
        conversation.data?.data?.contextId as number,
        {
            query: {
                enabled: !!conversation.data?.data?.contextId,
            },
        },
    );
    const acceptLeadMutation = useParticipateInConversation({
        mutation: {
            onSuccess: () => {
                toast.success("Bạn đã nhận lead thành công!");
                if (onLeadChange && selectedConversation) {
                    onLeadChange({
                        conversationId: selectedConversation,
                        change: "accepted",
                    });
                }
                conversation.refetch();
            },
            onError: () => {
                toast.error("Đã có lỗi xảy ra khi nhận lead.");
            },
        },
    });

    const closeConversationMutation = useCloseConversation({
        mutation: {
            onSuccess: () => {
                toast.success("Cuộc hội thoại đã được đóng thành công!");
                if (onLeadChange) {
                    onLeadChange({
                        conversationId: selectedConversation as number,
                        change: "closed",
                    });
                }
                conversation.refetch();
            },
            onError: () => {
                toast.error("Đã có lỗi xảy ra khi đóng cuộc hội thoại.");
            },
        },
    });

    const handleAcceptLead = () => {
        if (selectedConversation) {
            acceptLeadMutation.mutate({
                conversationId: selectedConversation,
            });
        }
    };

    const handleCloseConversation = () => {
        if (selectedConversation) {
            closeConversationMutation.mutate({
                conversationId: selectedConversation,
            });
        }
    };

    const thumbnailPreview = useFilePreview(
        property.data?.data?.thumbnail?.objectName,
    );

    const userInfo = conversation.data?.data?.participants?.find(
        (participant) => participant.user?.id === conversation.data.data?.createdBy,
    )?.user;

    return selectedConversation ? (
        <div className="w-80 border-l border-border bg-card overflow-y-auto flex flex-col">
            {/* Contact Info */}
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Thông tin liên hệ
                </h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Họ tên</p>
                        <p className="font-medium text-foreground">{userInfo?.fullName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">{userInfo?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">{userInfo?.phone}</p>
                    </div>
                </div>
            </div>

            {/* Property Card */}
            {property.data?.data && (
                <div className="p-6 border-b border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
                        Bất động sản quan tâm
                    </h3>
                    <Card className="overflow-hidden">
                        <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                            <img
                                src={thumbnailPreview.url || ""}
                                alt={property.data?.data.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="p-3 bg-background">
                            <h4 className="font-semibold text-foreground text-sm mb-2">
                                {property.data?.data.title}
                            </h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">Giá:</span>{" "}
                                    {formatCurrency(property.data?.data.price as number)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 space-y-2 flex-1 flex flex-col gap-3">
                {conversation.data?.data?.status === "PENDING" && (
                    <Button
                        onClick={handleAcceptLead}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        Nhận Lead
                    </Button>
                )}
                {conversation.data?.data?.status !== "CLOSED" && (
                    <Button
                        onClick={handleCloseConversation}
                        variant="outline"
                        className="w-full border-gray-300 text-foreground hover:bg-muted bg-transparent"
                    >
                        Đóng Hội thoại
                    </Button>
                )}
            </div>
        </div>
    ) : null;
}
