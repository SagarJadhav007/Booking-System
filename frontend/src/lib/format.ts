export function formatEventDate(value?: string | null) {
    if (!value) return "Date to be announced";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date to be announced";

    return date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function formatCurrency(amount?: number | null) {
    if (amount == null || Number.isNaN(amount)) return "—";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function shortId(value?: string | null, length = 8) {
    if (!value) return "—";
    return value.slice(0, length).toUpperCase();
}
