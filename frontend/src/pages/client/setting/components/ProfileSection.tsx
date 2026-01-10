"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Edit2, Save, UserIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { PresignedUploadRequestPurpose, type BaseUserRequest } from "@/types";
import { useGetCurrentUser, useUpdateCurrentUser } from "@/services/auth/auth";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/utils/formUtil";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import SpiralLoader from "@/components/ui/SpiralLoader";
import { useFileUpload } from "@/hooks/useFileHook";
import { useFileSSE } from "@/hooks/useFileSse";
import type { FileEvent } from "@/no-gen/types/fileEvent";
import { MotionButton } from "@/components/customs/MotionButton";
import { cn } from "@/lib/utils";

export function ProfileSection() {
    const [editMode, setEditMode] = useState(false);
    const currentUser = useGetCurrentUser();
    const [tempAvatar, setTempAvatar] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
    const form = useForm<BaseUserRequest>({
        defaultValues: currentUser.data?.data,
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
        form.setValue("avatarId", response.file?.id, { shouldDirty: true });
    };

    useEffect(() => {
        const event = fileEvent as FileEvent | null;
        if (event && event.status === "ACTIVE") {
            const url = event.url;
            setTempAvatar(url as string);
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
            onSuccess: (data) => {
                toast.success("Cập nhật thông tin thành công");
                currentUser.refetch();
                if (tempAvatar) {
                    URL.revokeObjectURL(tempAvatar);
                    setTempAvatar(null);
                }
                setEditMode(false);
                form.reset(data.data);
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
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        Thông tin hồ sơ
                    </h2>

                    <div className="flex items-center gap-3 text-base">
                        <MotionButton
                            onClick={() => setEditMode(!editMode)}
                            className={cn(
                                "rounded-md px-4 h-10 transition-all flex items-center gap-2",
                                editMode
                                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
                            )}
                        >
                            {editMode ? (
                                <>
                                    <X size={16} />
                                    <span>Hủy bỏ</span>
                                </>
                            ) : (
                                <>
                                    <Edit2 size={16} />
                                    <span>Chỉnh sửa hồ sơ</span>
                                </>
                            )}
                        </MotionButton>

                        {editMode && (
                            <MotionButton
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={!form.formState.isDirty}
                                className={cn(
                                    "rounded-md px-4 h-10 flex items-center gap-2 transition-all",
                                    "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
                                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300",
                                )}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Save size={16} />
                                Lưu thay đổi
                            </MotionButton>
                        )}
                    </div>
                </div>

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
                        {editMode && (
                            <Button
                                variant={"link"}
                                onClick={handleAvatarChange}
                                className="text-sm text-primary mt-2"
                            >
                                Thay đổi ảnh đại diện
                            </Button>
                        )}
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
                            disabled={!editMode}
                        />
                        <FormInput<BaseUserRequest>
                            name="email"
                            title="Email"
                            placeholder="Nhập email"
                            disabled={!editMode}
                        />
                        <FormInput<BaseUserRequest>
                            name="phone"
                            title="Số điện thoại"
                            placeholder="Nhập số điện thoại"
                            disabled={!editMode}
                        />
                    </Form>
                </div>
            </Card>
        </div>
    );
}
