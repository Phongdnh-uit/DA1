import {
    Home,
    Send,
    Phone,
    Mail,
    MessageSquare,
    Upload,
    AlertCircle,
    X,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useSupportVM } from "./SupportPage.vm";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect, FormTextArea } from "@/utils/formUtil";
import {
    SupportRequestSeverity,
    SupportRequestType,
    type SupportRequest,
} from "@/types";
import { supportTypeConverter } from "@/utils/converter";
import { getFileIcon } from "@/utils/renderUtil";
import { Badge } from "@/components/ui/badge";

export const SupportPage = () => {
    const {
        form,
        onSubmit,
        userName,
        userEmail,
        handleUpload,
        attachments,
        onAttachmentRemove,
        download,
    } = useSupportVM();
    return (
        <div className="min-h-screen">
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
                                <Form {...form}>
                                    <div className="space-y-6">
                                        {/* Request Type & Priority */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormSelect<SupportRequest>
                                                title="Loại yêu cầu"
                                                name="type"
                                                options={Object.values(SupportRequestType).map(
                                                    (type) => ({
                                                        key: type,
                                                        render: supportTypeConverter(type),
                                                    }),
                                                )}
                                            />

                                            <FormSelect<SupportRequest>
                                                title="Mức độ ưu tiên"
                                                name="severity"
                                                options={Object.values(SupportRequestSeverity).map(
                                                    (type) => ({
                                                        key: type,
                                                        render: supportTypeConverter(type),
                                                    }),
                                                )}
                                            />
                                        </div>
                                        <FormInput<SupportRequest>
                                            placeholder="Tóm tắt ngắn gọn vấn đề của bạn"
                                            title="Tiêu đề"
                                            name="title"
                                        />

                                        <FormTextArea<SupportRequest>
                                            placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải. Bao gồm các bước để tái hiện lỗi nếu có."
                                            title="Mô tả chi tiết"
                                            name="description"
                                            className="h-40"
                                        />

                                        {/* Attachment Upload */}
                                        <div className="space-y-2">
                                            <Label>Đính kèm tệp tin</Label>

                                            {/* Hidden file input */}
                                            <input
                                                type="file"
                                                id="attachment-upload"
                                                hidden
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={handleUpload}
                                            />

                                            {/* Clickable upload area */}
                                            <label
                                                htmlFor="attachment-upload"
                                                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group"
                                            >
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
                                            </label>
                                            {attachments.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="relative flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors"
                                                >
                                                    <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                        {getFileIcon(doc.originalName || "")}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                            {doc.originalName || "Tài liệu"}
                                                        </p>
                                                        <Badge
                                                            className={
                                                                doc.status === "PENDING"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : doc.status === "REJECTED"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-green-100 text-green-800"
                                                            }
                                                        >
                                                            {doc.status === "PENDING"
                                                                ? "Đang chờ hệ thống kiểm tra"
                                                                : doc.status === "REJECTED"
                                                                    ? "Bị từ chối do tiềm ẩn rủi ro"
                                                                    : "An toàn và được chấp nhận"}
                                                        </Badge>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => download(doc.objectName as string)}
                                                        className="flex-shrink-0"
                                                    >
                                                        <Eye className="size-5 text-gray-600" />
                                                    </Button>

                                                    {onAttachmentRemove && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onAttachmentRemove(index)}
                                                            className="flex-shrink-0 hover:bg-red-100 hover:text-red-600"
                                                        >
                                                            <X className="size-5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
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
                                                        value={userName}
                                                        className="bg-muted h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground uppercase">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        disabled
                                                        value={userEmail}
                                                        className="bg-muted h-12"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-3 pt-4">
                                            <Button variant="outline" type="button">
                                                Hủy bỏ
                                            </Button>
                                            <Button
                                                onClick={() => form.handleSubmit(onSubmit)()}
                                                size="lg"
                                                className="gap-2"
                                            >
                                                <span>Gửi Yêu Cầu</span>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
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
                    </div>
                </div>
            </main>
        </div>
    );
};
