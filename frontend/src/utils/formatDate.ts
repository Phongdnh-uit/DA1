import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function formatDate(date: Date, withTime = false): string {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    const pattern = withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
    return format(date, pattern, { locale: vi });
}

export function timeAgo(timestamp: string | number | Date): string {
    return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: vi,
    });
}
