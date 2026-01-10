import {
    IconChartPie2,
    IconBrandWechat,
    IconUsers,
    IconKey,
    IconStar,
    IconMap,
    IconMapPin,
    IconTag,
    IconHome,
    IconSettings,
} from "@tabler/icons-react";

import { Building2, FlagTriangleRight } from "lucide-react";

export interface Module {
    code: string;
    title: string;
    href: string;
    icon: React.ReactNode;
}

export const ACCESSIBLE_MODULES: Module[] = [
    {
        code: "dashboard",
        title: "Bảng điều khiển",
        href: "/admin/dashboard",
        icon: <IconChartPie2 className="h-6 w-6" />,
    },
    {
        code: "permission",
        title: "Quản lý quyền",
        href: "/admin/permission",
        icon: <IconKey className="h-6 w-6" />,
    },
    {
        code: "role",
        title: "Quản lý vai trò",
        href: "/admin/role",
        icon: <IconStar className="h-6 w-6" />,
    },
    {
        code: "user",
        title: "Quản lý người dùng",
        href: "/admin/user",
        icon: <IconUsers className="h-6 w-6" />,
    },
    {
        code: "province",
        title: "Tỉnh thành",
        href: "/admin/province",
        icon: <IconMap className="h-6 w-6" />,
    },
    {
        code: "ward",
        title: "Xã phường",
        href: "/admin/ward",
        icon: <IconMapPin className="h-6 w-6" />,
    },
    {
        code: "price-reference",
        title: "Thống kê giá cả",
        href: "/admin/price-reference",
        icon: <IconTag className="h-6 w-6" />,
    },
    {
        code: "property-type",
        title: "Loại bất động sản",
        href: "/admin/property-type",
        icon: <IconHome className="h-6 w-6" />,
    },
    {
        code: "property",
        title: "Bất động sản",
        href: "/admin/property",
        icon: <Building2 className="h-6 w-6" />,
    },
    {
        code: "chat-advise",
        title: "Trò chuyện",
        href: "/admin/chat",
        icon: <IconBrandWechat className="h-6 w-6" />,
    },
    // {
    //     code: "booking",
    //     title: "Đặt lịch",
    //     href: "/admin/booking",
    //     icon: <IconCalendar className="h-6 w-6" />,
    // },
    {
        code: "settings",
        title: "Cài đặt",
        href: "/admin/settings",
        icon: <IconSettings className="h-6 w-6" />,
    },
    {
        code: "support",
        title: "Khiếu nại & phản hồi",
        href: "/admin/support",
        icon: <FlagTriangleRight className="h-6 w-6" />,
    },
];
