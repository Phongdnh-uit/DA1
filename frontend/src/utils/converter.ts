import type { PropertyRequestStatus } from "@/types";

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
    ];
    const found = statuses.find((stat) => stat.key === status.toUpperCase());
    return found ? found.value : status;
}
