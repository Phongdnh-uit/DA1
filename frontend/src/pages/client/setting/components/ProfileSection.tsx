"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export function ProfileSection() {
    const [profile, setProfile] = useState({
        name: "Alex Johnson",
        email: "alex@example.com",
        bio: "Nhà thiết kế sản phẩm & Doanh nhân",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
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
                            <AvatarImage src="/profile-avatar.png" alt={profile.name} />
                            <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-foreground">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <button className="text-sm text-primary hover:underline mt-2">
                            Thay đổi ảnh đại diện
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Họ và tên
                        </label>
                        <Input
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên của bạn"
                            className="bg-background"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Email
                        </label>
                        <Input
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="bg-background"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Giới thiệu bản thân
                        </label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            placeholder="Hãy chia sẻ đôi điều về bạn..."
                            className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                            rows={3}
                        />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                        Lưu thay đổi
                    </Button>
                </div>
            </Card>
        </div>
    );
}
