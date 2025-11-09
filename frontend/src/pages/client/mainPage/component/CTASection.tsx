import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Phone, Mail, MessageCircle } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-20 px-4 bg-blue-500 text-primary-foreground">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                    Sẵn sàng cho bước đi tiếp theo trong hành trình bất động sản của bạn?
                </h2>
                <p className="text-xl mb-12 text-primary-foreground/90 max-w-3xl mx-auto text-pretty">
                    Nhận tư vấn chuyên nghiệp từ đội ngũ cố vấn giàu kinh nghiệm của chúng
                    tôi. Đặt lịch tư vấn miễn phí ngay hôm nay.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
                        <CardHeader>
                            <Phone className="w-8 h-8 mx-auto mb-2" />
                            <CardTitle>Gọi cho chúng tôi</CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Trao đổi trực tiếp với chuyên viên tư vấn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full">
                                (555) 123-4567
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
                        <CardHeader>
                            <Mail className="w-8 h-8 mx-auto mb-2" />
                            <CardTitle>Gửi email</CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Nhận thông tin chi tiết qua email
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full">
                                Gửi Email
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
                        <CardHeader>
                            <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                            <CardTitle>Trò chuyện trực tiếp</CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Hỗ trợ tức thì qua chat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full">
                                Bắt đầu trò chuyện
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    Đặt lịch tư vấn miễn phí
                </Button>
            </div>
        </section>
    );
}
