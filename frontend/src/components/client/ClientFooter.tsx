import { Link } from "@tanstack/react-router";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from "lucide-react";
import Logo from "@/assets/logo.svg";

export default function ClientFooter() {
    const currentYear = new Date().getFullYear();

    const services = [
        { name: "Mua Bất Động Sản", href: "#" },
        { name: "Bán Bất Động Sản", href: "#" },
        { name: "Cho Thuê", href: "#" },
        { name: "Định Giá Bất Động Sản", href: "#" },
    ];

    const company = [
        { name: "Về Chúng Tôi", href: "#" },
        { name: "Tin Tức & Blog", href: "#" },
        { name: "Câu Hỏi Thường Gặp", href: "#" },
        { name: "Liên Hệ", href: "#" },
    ];

    const legal = [
        { name: "Chính Sách Bảo Mật", href: "#" },
        { name: "Điều Khoản Dịch Vụ", href: "#" },
        { name: "Chính Sách Cookie", href: "#" },
    ];

    const socialLinks = [
        { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    ];

    return (
        <footer className="w-full dark:bg-slate-900">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <img src={Logo} />
                        <div>
                            <p className="text-sm">
                                Nền tảng tư vấn bất động sản hàng đầu
                            </p>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Giúp bạn tìm ngôi nhà mơ ước hoặc đầu tư bất động sản thông minh
                            cùng những chuyên gia hàng đầu.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.label}
                                        className="rounded-full p-2 transition-colors hover:bg-blue-600"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold">Dịch Vụ</h3>
                        <ul className="space-y-3">
                            {services.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className="text-sm transition-colors hover:text-white"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold">Công Ty</h3>
                        <ul className="space-y-3">
                            {company.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className="text-sm transition-colors hover:text-white"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold">Liên Hệ</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Phone className="h-5 w-5 flex-shrink-0 text-blue-400" />
                                <a
                                    href="tel:+84912345678"
                                    className="text-sm transition-colors hover:text-white"
                                >
                                    +84 (867) 907-500
                                </a>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="h-5 w-5 flex-shrink-0 text-blue-400" />
                                <a
                                    className="text-sm transition-colors hover:text-white"
                                >
                                    dangnguyenhuyphong@gmail.com
                                </a>
                            </li>
                            <li className="flex gap-3">
                                <MapPin className="h-5 w-5 flex-shrink-0 text-blue-400" />
                                <span className="text-sm">
                                    Hàn Thuyên, khu phố 6 P, Thủ Đức, Thành phố Hồ Chí Minh, Việt
                                    Nam
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-12 border-t border-slate-700" />

                {/* Bottom Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        &copy; {currentYear} UITLAND. Tất cả quyền được bảo lưu.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        {legal.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-sm transition-colors hover:text-white text-neutral-500 dark:text-neutral-400"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
