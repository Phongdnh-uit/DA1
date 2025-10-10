export function formatDate(date: Date, withTime = false): string {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    }).format(date);
}
