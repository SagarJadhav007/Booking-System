import SeatCard from "./SeatCard";
import type { Seat } from "../../types/seat";

interface Props {

    seats: Seat[];

    onSeatClick: (
        seat: Seat
    ) => void;
}

const SeatGrid = ({
                      seats,
                      onSeatClick
                  }: Props) => {

    return (

        <div
            className="
                grid
                grid-cols-2
                md:grid-cols-4
                lg:grid-cols-6
                gap-4
                "
            >

            {seats.map(
                seat => (

                    <SeatCard

                        key={
                            seat.seatId
                        }

                        seat={seat}

                        onClick={
                            onSeatClick
                        }

                    />

                )
            )}

        </div>
    );
};

export default SeatGrid;