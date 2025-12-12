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
        gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
        iconColor: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
        icon: TrendingUp,
        title: "Phân tích thị trường",
        description:
            "Cung cấp thông tin chuyên sâu và khuyến nghị dựa trên dữ liệu để tối đa hóa tiềm năng đầu tư của bạn.",
        gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
        icon: Users,
        title: "Dịch vụ cá nhân hóa",
        description:
            "Đội ngũ tư vấn tận tâm mang đến giải pháp phù hợp với nhu cầu và mục tiêu bất động sản riêng của bạn.",
        gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
        iconColor: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
        icon: Award,
        title: "Giải thưởng uy tín",
        description:
            "Đơn vị dẫn đầu ngành với nhiều giải thưởng ghi nhận sự xuất sắc trong dịch vụ tư vấn bất động sản.",
        gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
        iconColor: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
    },
];

export function FeaturesSection() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Shield className="w-4 h-4" />
                        Ưu thế vượt trội
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                        Vì sao nên chọn dịch vụ tư vấn của{" "}
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            chúng tôi
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                        Chúng tôi kết hợp hiểu biết sâu sắc về thị trường với dịch vụ cá
                        nhân hóa để mang đến kết quả vượt trội cho khách hàng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />

                            <CardHeader className="relative space-y-4">
                                <div
                                    className={`inline-flex w-14 h-14 ${feature.bgColor} rounded-2xl items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                                >
                                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                                </div>

                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="relative">
                                <CardDescription className="text-base leading-relaxed text-pretty">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-muted/50 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">15+</div>
                            <div className="text-sm text-muted-foreground">
                                Năm kinh nghiệm
                            </div>
                        </div>
                        <div className="h-12 w-px bg-border" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">2000+</div>
                            <div className="text-sm text-muted-foreground">Khách hàng</div>
                        </div>
                        <div className="h-12 w-px bg-border" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">98%</div>
                            <div className="text-sm text-muted-foreground">Hài lòng</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
