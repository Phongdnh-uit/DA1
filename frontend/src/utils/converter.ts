import type {
    BookingRequestStatus,
    PropertyRequestStatus,
} from "@/types";

export const directionConverter = (direction: string): string => {
    const directions = [
        { key: "NORTH", value: "Bắc" },
        { key: "SOUTH", value: "Nam" },
        { key: "EAST", value: "Đông" },
        { key: "WEST", value: "Tây" },
        { key: "NORTHEAST", value: "Đông - Bắc" },
        { key: "NORTHWEST", value: "Tây - Bắc" },
        { key: "SOUTHEAST", value: "Đông - Nam" },
        { key: "SOUTHWEST", value: "Tây - Nam" },
    ];
    const found = directions.find((dir) => dir.key === direction.toUpperCase());
    return found ? found.value : direction;
};

export const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} tỷ`;
    }
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu`;
    }
    if (amount >= 1_000) {
        return `${(amount / 1_000).toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} nghìn`;
    }
    return `${amount.toLocaleString("vi-VN")} VNĐ`;
};

export const propertyStatusConverter = (status: string): string => {
    const statuses = [
        { key: "AVAILABLE", value: "Có sẵn" },
        { key: "SOLD", value: "Đã bán" },
        { key: "PENDING", value: "Đang chờ" },
        { key: "RENTED", value: "Đã cho thuê" },
        { key: "OFF_MARKET", value: "Ngừng giao dịch" },
        { key: "MAINTENANCE", value: "Bảo trì" },
        { key: "UNDER_CONSTRUCTION", value: "Đang xây dựng" },
    ] as { key: PropertyRequestStatus; value: string }[];
    const found = statuses.find((stat) => stat.key === status.toUpperCase());
    return found ? found.value : status;
};

export const bookingStatusConverter = (status: string): string => {
    const statuses = [
        { key: "PENDING", value: "Đang chờ" },
        { key: "CONFIRMED", value: "Đã xác nhận" },
        { key: "CANCELLED", value: "Đã hủy" },
        { key: "COMPLETED", value: "Hoàn thành" },
    ] as { key: BookingRequestStatus; value: string }[];
    const found = statuses.find((stat) => stat.key === status.toUpperCase());
    return found ? found.value : status;
};

export const supportTypeConverter = (type: string): string => {
    const types = [
        { key: "TECHNICAL_SUPPORT", value: "Hỗ trợ kỹ thuật" },
        { key: "COMPLAINT", value: "Khiếu nại" },
        { key: "BUG_REPORT", value: "Báo cáo lỗi" },
        { key: "FEATURE_REQUEST", value: "Yêu cầu tính năng" },
        { key: "OTHER", value: "Khác" },
    ] as { key: string; value: string }[];
    const found = types.find((t) => t.key === type.toUpperCase());
    return found ? found.value : type;
};

export const supportSeverityConverter = (severity: string): string => {
    const severities = [
        { key: "LOW", value: "Thấp" },
        { key: "MEDIUM", value: "Bình thường" },
        { key: "HIGH", value: "Cao" },
        { key: "URGENT", value: "Khẩn cấp" },
    ] as { key: string; value: string }[];
    const found = severities.find((s) => s.key === severity.toUpperCase());
    return found ? found.value : severity;
};

export const supportStatusConverter = (status: string): string => {
    const statuses = [
        { key: "OPEN", value: "Đang mở" },
        { key: "RESOLVED", value: "Đã giải quyết" },
        { key: "CLOSED", value: "Đóng" },
    ] as { key: string; value: string }[];
    const found = statuses.find((s) => s.key === status.toUpperCase());
    return found ? found.value : status;
};
