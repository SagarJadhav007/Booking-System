import type { Seat } from "@/types/seat";

export function isSeatOccupied(seat: Seat) {
    return seat.status === "CONFIRMED" || (seat.status === "HELD" && !seat.ownedByCurrentUser);
}

export function isSeatHeldByOthers(seat: Seat) {
    return seat.status === "HELD" && !seat.ownedByCurrentUser;
}

export function isOwnedHold(seat: Seat) {
    return seat.status === "HELD" && seat.ownedByCurrentUser;
}

export function getAvailability(seats: Seat[]) {
    const available = seats.filter((seat) => seat.status === "AVAILABLE").length;
    const prices = seats.map((seat) => seat.price).filter((price) => price != null);
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;

    return {
        available,
        total: seats.length,
        minPrice,
        maxPrice,
    };
}
