import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Shield, TrendingUp, Users, Award } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Chuyên môn đáng tin cậy",
        description:
            "Hơn 15 năm kinh nghiệm trong tư vấn bất động sản với hồ sơ thành công đã được chứng minh.",
    },
    {
        icon: TrendingUp,
        title: "Phân tích thị trường",
        description:
            "Cung cấp thông tin chuyên sâu và khuyến nghị dựa trên dữ liệu để tối đa hóa tiềm năng đầu tư của bạn.",
    },
    {
        icon: Users,
        title: "Dịch vụ cá nhân hóa",
        description:
            "Đội ngũ tư vấn tận tâm mang đến giải pháp phù hợp với nhu cầu và mục tiêu bất động sản riêng của bạn.",
    },
    {
        icon: Award,
        title: "Giải thưởng uy tín",
        description:
            "Đơn vị dẫn đầu ngành với nhiều giải thưởng ghi nhận sự xuất sắc trong dịch vụ tư vấn bất động sản.",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-[85rem] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Vì sao nên chọn dịch vụ tư vấn của chúng tôi
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Chúng tôi kết hợp hiểu biết sâu sắc về thị trường với dịch vụ cá
                        nhân hóa để mang đến kết quả vượt trội cho khách hàng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="text-center hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-pretty">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
