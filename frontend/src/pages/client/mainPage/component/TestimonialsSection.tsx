import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
    {
        name: "Sarah Johnson",
        username: "@sarah",
        body: "Đội ngũ tư vấn đã giúp tôi mua căn nhà đầu tiên một cách suôn sẻ. Kiến thức thị trường và kỹ năng đàm phán của họ giúp tôi tiết kiệm được 30.000 USD.",
        img: "/professional-woman-headshot.png",
    },
    {
        name: "Michael Chen",
        username: "@michael",
        body: "Dịch vụ xuất sắc cùng hiểu biết sâu rộng về thị trường. Họ đã giúp tôi xây dựng danh mục đầu tư bất động sản sinh lời.",
        img: "/professional-man-headshot.png",
    },
    {
        name: "Emily Rodriguez",
        username: "@emily",
        body: "Tôi đã bán được bất động sản cao hơn 20% so với giá đề nghị nhờ chiến lược tiếp thị và định giá của họ.",
        img: "/professional-woman-headshot.png",
    },
    {
        name: "Emily Rodriguez",
        username: "@emily",
        body: "Tôi đã bán được bất động sản cao hơn 20% so với giá đề nghị nhờ chiến lược tiếp thị và định giá của họ.",
        img: "/professional-woman-headshot.png",
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Cảm nhận từ khách hàng
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Những câu chuyện thực tế từ các khách hàng hài lòng đã đạt được mục
                        tiêu bất động sản với sự đồng hành và tư vấn chuyên nghiệp của chúng
                        tôi.
                    </p>
                </div>
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:20s] w-full">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:20s] w-full">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
                    <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8"></div>
            </div>
        </section>
    );
}

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};
