export function formatDate(date: Date | string | number, withTime = false): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    throw new Error("Invalid date");
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(d);
}
