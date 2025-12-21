import { useState } from "react";
import {
    Home,
    Send,
    Phone,
    Mail,
    MessageSquare,
    HelpCircle,
    Upload,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ReportPage = () => {
    const [formData, setFormData] = useState({
        requestType: "",
        priority: "normal",
        subject: "",
        description: "",
    });

    const [charCount, setCharCount] = useState(0);

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const value = e.target.value;
        if (value.length <= 2000) {
            setFormData({ ...formData, description: value });
            setCharCount(value.length);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <a
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        <Home className="h-4 w-4" />
                        Trang chủ
                    </a>
                    <span className="text-muted-foreground">/</span>
                    <a
                        className="text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        Hỗ trợ
                    </a>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-foreground font-medium">Gửi Yêu Cầu</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Page Heading */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight">
                                    Gửi Yêu Cầu hoặc Khiếu Nại
                                </h1>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-3xl">
                                Chúng tôi luôn lắng nghe để cải thiện dịch vụ. Đội ngũ hỗ trợ sẽ
                                phản hồi yêu cầu của bạn trong vòng 24 giờ làm việc.
                            </p>
                        </div>

                        {/* Alert Box */}
                        <Card className="border-blue-200 bg-blue-50/50">
                            <CardContent className="flex gap-3 pt-6">
                                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-900">Lưu ý quan trọng</p>
                                    <p className="text-blue-700 mt-1">
                                        Vui lòng cung cấp thông tin chi tiết để chúng tôi có thể hỗ
                                        trợ bạn tốt nhất. Các yêu cầu khẩn cấp sẽ được ưu tiên xử
                                        lý.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Card */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Thông tin yêu cầu</CardTitle>
                                <CardDescription>
                                    Điền đầy đủ thông tin dưới đây để gửi yêu cầu của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Request Type & Priority */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="request-type">
                                                Loại yêu cầu <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={formData.requestType}
                                                onValueChange={(value) =>
                                                    setFormData({ ...formData, requestType: value })
                                                }
                                            >
                                                <SelectTrigger id="request-type">
                                                    <SelectValue placeholder="Chọn loại yêu cầu" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="complaint_post">
                                                        Khiếu nại tin đăng sai sự thật
                                                    </SelectItem>
                                                    <SelectItem value="complaint_service">
                                                        Khiếu nại dịch vụ/tài khoản
                                                    </SelectItem>
                                                    <SelectItem value="feature_request">
                                                        Đề xuất tính năng mới
                                                    </SelectItem>
                                                    <SelectItem value="bug_report">
                                                        Báo lỗi hệ thống
                                                    </SelectItem>
                                                    <SelectItem value="other">Khác</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="priority">Mức độ ưu tiên</Label>
                                            <Select
                                                value={formData.priority}
                                                onValueChange={(value) =>
                                                    setFormData({ ...formData, priority: value })
                                                }
                                            >
                                                <SelectTrigger id="priority">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="normal">Bình thường</SelectItem>
                                                    <SelectItem value="high">Cao</SelectItem>
                                                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">
                                            Tiêu đề <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="subject"
                                            placeholder="Tóm tắt ngắn gọn vấn đề của bạn"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({ ...formData, subject: e.target.value })
                                            }
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Mô tả chi tiết <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải. Bao gồm các bước để tái hiện lỗi nếu có."
                                            rows={6}
                                            value={formData.description}
                                            onChange={handleDescriptionChange}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">
                                            {charCount}/2000 ký tự
                                        </p>
                                    </div>

                                    {/* Attachment Upload */}
                                    <div className="space-y-2">
                                        <Label>Đính kèm tệp tin</Label>
                                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-sm font-medium">
                                                Kéo thả tệp vào đây hoặc{" "}
                                                <span className="text-primary">chọn từ máy tính</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Hỗ trợ: JPG, PNG, PDF (Tối đa 10MB)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Info Section */}
                                    <div className="border-t pt-6 space-y-4">
                                        <h3 className="text-base font-semibold">
                                            Thông tin liên hệ của bạn
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground uppercase">
                                                    Họ và tên
                                                </Label>
                                                <Input
                                                    disabled
                                                    value="Nguyễn Văn A"
                                                    className="bg-muted"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground uppercase">
                                                    Email
                                                </Label>
                                                <Input
                                                    disabled
                                                    value="nguyenvana@example.com"
                                                    className="bg-muted"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3 pt-4">
                                        <Button variant="outline" type="button">
                                            Hủy bỏ
                                        </Button>
                                        <Button type="submit" size="lg" className="gap-2">
                                            <span>Gửi Yêu Cầu</span>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Support Card */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Kênh Hỗ Trợ Khác</CardTitle>
                                <CardDescription>
                                    Liên hệ với chúng tôi qua nhiều kênh
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <a
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                                    href="#"
                                >
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Hotline 24/7</p>
                                        <p className="text-sm text-muted-foreground">
                                            1900 1234 (1000đ/phút)
                                        </p>
                                    </div>
                                </a>

                                <a
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                                    href="#"
                                >
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Email Hỗ Trợ</p>
                                        <p className="text-sm text-muted-foreground">
                                            hotro@batdongsan.vn
                                        </p>
                                    </div>
                                </a>

                                <a
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                                    href="#"
                                >
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors shrink-0">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Live Chat</p>
                                        <p className="text-sm text-muted-foreground">
                                            Chat trực tiếp với CSKH
                                        </p>
                                    </div>
                                </a>
                            </CardContent>
                        </Card>

                        {/* FAQ Mini Card */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-orange-500" />
                                    Câu hỏi thường gặp
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors block"
                                            href="#"
                                        >
                                            Làm sao để sửa tin đã đăng?
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors block"
                                            href="#"
                                        >
                                            Quy định về duyệt tin đăng mới
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors block"
                                            href="#"
                                        >
                                            Hướng dẫn nạp tiền vào tài khoản
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors block"
                                            href="#"
                                        >
                                            Chính sách bảo mật thông tin
                                        </a>
                                    </li>
                                </ul>
                                <Button variant="outline" className="w-full">
                                    Xem tất cả câu hỏi
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Promo Card */}
                        <Card className="overflow-hidden shadow-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/20 text-white border-0"
                                    >
                                        Khuyến mãi
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">
                                        Nâng cấp tài khoản VIP
                                    </h3>
                                    <p className="text-blue-100 text-sm">
                                        Tiếp cận khách hàng nhanh gấp 5 lần với gói VIP đặc biệt
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                                >
                                    Tìm hiểu thêm
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};
