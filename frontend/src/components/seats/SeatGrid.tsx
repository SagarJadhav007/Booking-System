import { useMemo } from "react";

import SeatCard from "./SeatCard";
import type { Seat } from "../../types/seat";

interface Props {
    seats: Seat[];
    selectedSeatId?: string | null;
    selectedSeatIds?: string[];
    onSeatClick: (seat: Seat) => void;
}

const SeatGrid = ({ seats, selectedSeatId, selectedSeatIds, onSeatClick }: Props) => {
    const rows = useMemo(() => {
        const grouped = new Map<string, Seat[]>();

        seats.forEach((seat) => {
            const key = seat.rowNumber || "A";
            const current = grouped.get(key) ?? [];
            current.push(seat);
            grouped.set(key, current);
        });

        // Sort rows alphabetically/numerically
        return Array.from(grouped.entries())
            .sort(([rowA], [rowB]) =>
                rowA.localeCompare(rowB, undefined, { numeric: true })
            )
            .map(([row, rowSeats]) => ({
                row,
                seats: rowSeats.sort((a, b) =>
                    a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })
                ),
            }));
    }, [seats]);

    const isSelected = (seat: Seat) => {
        if (selectedSeatIds && selectedSeatIds.length > 0) {
            return selectedSeatIds.includes(seat.seatId);
        }
        return selectedSeatId === seat.seatId;
    };

    return (
        <div className="space-y-3 overflow-x-auto p-2 pb-4">
            {rows.map(({ row, seats: rowSeats }) => {
                const splitAt = rowSeats.length > 6 ? Math.ceil(rowSeats.length / 2) : -1;
                const left = splitAt === -1 ? rowSeats : rowSeats.slice(0, splitAt);
                const right = splitAt === -1 ? [] : rowSeats.slice(splitAt);

                return (
                    <div
                        key={row}
                        className="flex min-w-max items-center justify-center gap-4"
                    >
                        {/* Row letter indicator left */}
                        <span className="w-5 shrink-0 text-center font-mono text-[11px] font-semibold text-muted-foreground/70">
                            {row}
                        </span>

                        {/* Left block of seats */}
                        <div className="flex gap-2">
                            {left.map((seat) => (
                                <SeatCard
                                    key={seat.seatId}
                                    seat={seat}
                                    selected={isSelected(seat)}
                                    onClick={onSeatClick}
                                />
                            ))}
                        </div>

                        {/* Center Aisle Indicator */}
                        {right.length > 0 && (
                            <div className="flex w-6 shrink-0 items-center justify-center">
                                <span className="h-4 w-px bg-white/10" />
                            </div>
                        )}

                        {/* Right block of seats */}
                        {right.length > 0 && (
                            <div className="flex gap-2">
                                {right.map((seat) => (
                                    <SeatCard
                                        key={seat.seatId}
                                        seat={seat}
                                        selected={isSelected(seat)}
                                        onClick={onSeatClick}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Row letter indicator right */}
                        <span className="w-5 shrink-0 text-center font-mono text-[11px] font-semibold text-muted-foreground/70">
                            {row}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default SeatGrid;
