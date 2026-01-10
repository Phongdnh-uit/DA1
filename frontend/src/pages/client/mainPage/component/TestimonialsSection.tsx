import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Star, Quote } from "lucide-react";

const reviews = [
    {
        name: "Sarah Johnson",
        username: "@sarah",
        body: "Đội ngũ tư vấn đã giúp tôi mua căn nhà đầu tiên một cách suôn sẻ. Kiến thức thị trường và kỹ năng đàm phán của họ giúp tôi tiết kiệm được 30.000 USD.",
        img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        rating: 5,
        role: "Người mua nhà lần đầu",
    },
    {
        name: "Michael Chen",
        username: "@michael",
        body: "Dịch vụ xuất sắc cùng hiểu biết sâu rộng về thị trường. Họ đã giúp tôi xây dựng danh mục đầu tư bất động sản sinh lời.",
        img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        rating: 5,
        role: "Nhà đầu tư",
    },
    {
        name: "Emily Rodriguez",
        username: "@emily",
        body: "Tôi đã bán được bất động sản cao hơn 20% so với giá đề nghị nhờ chiến lược tiếp thị và định giá của họ.",
        img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        rating: 5,
        role: "Người bán",
    },
    {
        name: "David Kim",
        username: "@david",
        body: "Chuyên nghiệp, nhanh chóng và luôn sẵn sàng hỗ trợ. Tôi đã tìm được căn hộ mơ ước chỉ sau 2 tuần.",
        img: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        rating: 5,
        role: "Người thuê",
    },
    {
        name: "Lisa Anderson",
        username: "@lisa",
        body: "Quy trình minh bạch và tư vấn tận tâm. Họ đã giúp gia đình tôi tìm được ngôi nhà hoàn hảo.",
        img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        rating: 5,
        role: "Gia đình trẻ",
    },
    {
        name: "James Wilson",
        username: "@james",
        body: "Dịch vụ tuyệt vời từ đầu đến cuối. Tôi đặc biệt ấn tượng với sự chú ý đến từng chi tiết.",
        img: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        rating: 5,
        role: "Doanh nhân",
    },
];

export function TestimonialsSection() {
    const firstRow = reviews.slice(0, reviews.length / 2);
    const secondRow = reviews.slice(reviews.length / 2);

    return (
        <section className="relative py-24 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Đánh giá 5 sao từ khách hàng</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        Cảm nhận từ khách hàng
                    </h2>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-pretty leading-relaxed">
                        Những câu chuyện thực tế từ các khách hàng hài lòng đã đạt được mục
                        tiêu bất động sản với sự đồng hành và tư vấn chuyên nghiệp của chúng
                        tôi.
                    </p>

                    <div className="flex items-center justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                500+
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Khách hàng
                            </div>
                        </div>
                        <div className="w-px h-12 bg-slate-300 dark:bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                4.9/5
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Đánh giá
                            </div>
                        </div>
                        <div className="w-px h-12 bg-slate-300 dark:bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                98%
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Hài lòng
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl">
                    <Marquee pauseOnHover className="[--duration:30s] w-full mb-4">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>

                    <Marquee reverse pauseOnHover className="[--duration:30s] w-full">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>

                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-slate-50 dark:from-slate-900"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-slate-50 dark:from-slate-900"></div>
                </div>
            </div>
        </section>
    );
}

const ReviewCard = ({
    img,
    name,
    username,
    body,
    rating,
    role,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
    rating: number;
    role: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-2xl border p-6",
                "border-slate-200 bg-white shadow-lg shadow-slate-200/50",
                "hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1",
                "dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-slate-900/50",
                "dark:hover:shadow-slate-800/50",
                "transition-all duration-300 ease-out backdrop-blur-sm",
            )}
        >
            <div className="absolute top-4 right-4 text-blue-500 opacity-10">
                <Quote className="w-12 h-12 fill-current" />
            </div>

            <div className="flex flex-row items-start gap-3 mb-4">
                <div className="relative">
                    <img
                        className="rounded-full ring-2 ring-blue-500/20"
                        width="48"
                        height="48"
                        alt={name}
                        src={img}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <figcaption className="text-base font-semibold text-slate-900 dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {role}
                    </p>
                    <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: rating }).map((_, i) => (
                            <Star
                                key={i}
                                className="w-3 h-3 text-yellow-500 fill-yellow-500"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                "{body}"
            </blockquote>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-500">{username}</p>
            </div>
        </figure>
    );
};
