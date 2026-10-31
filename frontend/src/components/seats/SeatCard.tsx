import type { Seat } from "../../types/seat";
import { formatCurrency } from "@/lib/format";
import { isOwnedHold, isSeatHeldByOthers } from "@/lib/seats";
import { cn } from "@/lib/utils";

interface Props {
    seat: Seat;
    selected: boolean;
    onClick: (seat: Seat) => void;
}

const SeatCard = ({ seat, selected, onClick }: Props) => {
    const heldByOthers = isSeatHeldByOthers(seat);
    const occupied = seat.status === "CONFIRMED" || heldByOthers;
    const yours = isOwnedHold(seat);

    let label = "Available";
    let seatClass = "seat-available";

    if (selected || yours) {
        label = selected ? "Selected" : "Your hold";
        seatClass = "seat-selected";
    } else if (heldByOthers) {
        label = "Temporarily Held";
        seatClass = "seat-held";
    } else if (seat.status === "CONFIRMED") {
        label = "Occupied";
        seatClass = "seat-occupied";
    }

    const numberDisplay = seat.seatNumber.replace(/^[A-Za-z]+/, "") || seat.seatNumber;

    return (
        <button
            type="button"
            disabled={occupied && !yours && !selected}
            title={`Row ${seat.rowNumber}, Seat ${seat.seatNumber} · ${label} · ${formatCurrency(seat.price)}`}
            onClick={() => onClick(seat)}
            className={cn(
                "relative flex h-8 w-8 min-w-8 items-center justify-center rounded-[7px] text-[10px] font-semibold tracking-tight transition-all duration-200 select-none",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                seatClass
            )}
            aria-label={`Seat ${seat.seatNumber}, ${label}`}
        >
            {numberDisplay}
            {selected && (
                <span className="absolute -top-1 -right-1 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-white" />
                </span>
            )}
        </button>
    );
};

export default SeatCard;
