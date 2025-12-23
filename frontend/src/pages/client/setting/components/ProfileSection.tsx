"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { PresignedUploadRequestPurpose, type BaseUserRequest } from "@/types";
import { useGetCurrentUser, useUpdateCurrentUser } from "@/services/auth/auth";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/utils/formUtil";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import SpiralLoader from "@/components/ui/SpiralLoader";
import { useFileUpload } from "@/hooks/useFileHook";
import { useFileSSE } from "@/hooks/useFileSse";

const MotionButton = motion(Button);

export function ProfileSection() {
    const currentUser = useGetCurrentUser();
    const [tempAvatar, setTempAvatar] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
    const form = useForm<BaseUserRequest>({
        defaultValues: {
            email: currentUser?.data?.data?.email,
            fullName: currentUser?.data?.data?.fullName,
            phone: currentUser?.data?.data?.phone,
            avatarId: currentUser?.data?.data?.avatar?.id,
        },
    });
    const fileEvent = useFileSSE(uploadedFileId);
    const { uploadFile } = useFileUpload();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleAvatarChange = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (tempAvatar) {
            URL.revokeObjectURL(tempAvatar);
        }
        const url = URL.createObjectURL(file);
        setTempAvatar(url);
        setIsUploading(true);
        const response = await uploadFile(
            file,
            PresignedUploadRequestPurpose.AVATAR,
        );
        setUploadedFileId(response.file?.objectName || null);
        form.setValue("avatarId", response.file?.id);
    };

    useEffect(() => {
        console.log("fileEvent", fileEvent);
        if (fileEvent && fileEvent.status === "ACTIVE") {
            const url = fileEvent.url;
            setTempAvatar(url);
            setIsUploading(false);
        }
    }, [fileEvent]);

    useEffect(() => {
        return () => {
            if (tempAvatar) {
                URL.revokeObjectURL(tempAvatar);
            }
        };
    }, [tempAvatar]);

    const updateCurrentUserMutation = useUpdateCurrentUser({
        mutation: {
            onSuccess: () => {
                toast.success("Cập nhật thông tin thành công");
                currentUser.refetch();
                if (tempAvatar) {
                    URL.revokeObjectURL(tempAvatar);
                    setTempAvatar(null);
                }
            },
            onError: () => {
                toast.error("Cập nhật thông tin thất bại");
            },
        },
    });

    const onSubmit = (data: BaseUserRequest) => {
        updateCurrentUserMutation.mutate({ data });
    };

    return (
        <div id="profile" className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Cài đặt tài khoản
                </h1>
                <p className="text-muted-foreground mt-1">
                    Quản lý hồ sơ và tùy chọn tài khoản của bạn
                </p>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                    Thông tin hồ sơ
                </h2>

                <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <Avatar className="w-24 h-24">
                            {tempAvatar ? (
                                <>
                                    <AvatarImage
                                        src={tempAvatar}
                                        alt={currentUser?.data?.data?.fullName || "User"}
                                    />
                                    {isUploading && (
                                        <SpiralLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10" />
                                    )}
                                </>
                            ) : (
                                <AvatarImage
                                    src={currentUser?.data?.data?.avatar?.url || ""}
                                    loading="lazy"
                                    alt={currentUser?.data?.data?.fullName || "User"}
                                />
                            )}

                            <AvatarFallback>
                                <UserIcon className="w-12 h-12 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-foreground">
                            {currentUser?.data?.data?.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {currentUser?.data?.data?.email}
                        </p>
                        <Button
                            variant={"link"}
                            onClick={handleAvatarChange}
                            className="text-sm text-primary mt-2"
                        >
                            Thay đổi ảnh đại diện
                        </Button>
                        <input
                            type="file"
                            accept={"image/png, image/jpeg, image/jpg"}
                            className="hidden"
                            onChange={onFileChange}
                            ref={fileInputRef}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Form {...form}>
                        <FormInput<BaseUserRequest>
                            name="fullName"
                            title="Họ và tên"
                            placeholder="Nhập họ và tên"
                        />
                        <FormInput<BaseUserRequest>
                            name="email"
                            title="Email"
                            placeholder="Nhập email"
                        />
                        <FormInput<BaseUserRequest>
                            name="phone"
                            title="Số điện thoại"
                            placeholder="Nhập số điện thoại"
                        />
                    </Form>

                    <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="flex-1 text-xl h-12 rounded-2xl transition-none w-full"
                        size="lg"
                        onClick={() => form.handleSubmit(onSubmit)()}
                    >
                        Lưu thay đổi
                    </MotionButton>
                </div>
            </Card>
        </div>
    );
}
