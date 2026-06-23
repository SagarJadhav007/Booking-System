import type { Seat } from "../../types/seat";

interface Props {
    seat: Seat;
    onClick: (seat: Seat) => void;
}

const SeatCard = ({
                      seat,
                      onClick
                  }: Props) => {

    const disabled =

        seat.status === "CONFIRMED"

        ||

        (
            seat.status === "HELD"
            &&
            !seat.ownedByCurrentUser
        );

    let classes =
        "bg-emerald-500 hover:bg-emerald-600";

    let label =
        "Available";

    if (
        seat.status === "HELD" &&
        seat.ownedByCurrentUser
    ) {

        classes =
            "bg-blue-500 hover:bg-blue-600";

        label =
            "Yours";
    }

    else if (
        seat.status === "HELD"
    ) {

        classes =
            "bg-amber-500";

        label =
            "Held";
    }

    else if (
        seat.status === "CONFIRMED"
    ) {

        classes =
            "bg-red-500";

        label =
            "Booked";
    }

    return (

        <button

            disabled={disabled}

            onClick={() =>
                onClick(seat)
            }

            className={`
                ${classes}

                h-24
                rounded-xl

                text-white

                p-3

                flex
                flex-col
                justify-between

                transition
                duration-200

                disabled:cursor-not-allowed
                disabled:opacity-80
            `}
        >

            <div
                className="
                text-left
                font-bold
                "
            >
                {seat.seatNumber}
            </div>

            <div
                className="
                text-left
                text-xs
                "
            >
                ₹{seat.price}
            </div>

            <div
                className="
                text-left
                text-[10px]
                opacity-90
                "
            >
                {label}
            </div>

        </button>

    );
};

export default SeatCard;