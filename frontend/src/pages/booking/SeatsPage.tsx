import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {Seat} from "../../types/seat";

import {
    getSeats,
    reserveSeat
} from "../../api/seatApi";

import SeatGrid
    from "../../components/seats/SeatGrid";
import { useParams } from "react-router-dom";

const SeatsPage = () => {

    const navigate =
        useNavigate();

    const [seats, setSeats] =
        useState<Seat[]>([]);

    const [loading, setLoading] =
        useState(true);

    const {eventId} =
        useParams();

    useEffect(() => {

        loadSeats();

        const interval =
            setInterval(
                loadSeats,
                3000
            );

        return () =>
            clearInterval(
                interval
            );

    }, []);

    const loadSeats =
        async () => {

            try {

                if (!eventId) return;

                const data =
                    await getSeats(
                        eventId
                    );

                setSeats(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        };

    const handleSeatClick = async (
        seat: Seat
    ) => {

        if (
            seat.status === "HELD" &&
            seat.ownedByCurrentUser
        ) {

            localStorage.setItem(
                "selectedSeat",
                seat.seatId
            );

            localStorage.setItem(
                "selectedEvent",
                seat.eventId
            );

            navigate("/payment");

            return;
        }

        try {

            await reserveSeat(
                seat.seatId
            );

            localStorage.setItem(
                "selectedSeat",
                seat.seatId
            );

            navigate("/payment");

        } catch {

            alert(
                "Seat already reserved"
            );
        }
    };

    if (loading) {

        return (

            <div className="p-10">

                Loading Seats...

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto p-8">

                <div
                    className="
                bg-gradient-to-r
                from-slate-900
                to-slate-700
                text-white
                rounded-3xl
                p-8
                mb-8
                "
                >

                    <h1 className="text-4xl font-bold">
                        Select Your Seat
                    </h1>

                    <p className="text-slate-300 mt-2">
                        Choose an available seat to continue.
                    </p>

                </div>

                <div
                    className="
                grid
                lg:grid-cols-4
                gap-8
                "
                >

                    {/* Left */}

                    <div className="lg:col-span-3">

                        <div
                            className="
                        bg-white
                        border
                        rounded-2xl
                        p-8
                        "
                        >

                            <div
                                className="
                            bg-slate-900
                            text-white
                            text-center
                            py-3
                            rounded-lg
                            mb-10
                            "
                            >
                                SCREEN
                            </div>

                            <SeatGrid
                                seats={seats}
                                onSeatClick={handleSeatClick}
                            />

                        </div>

                    </div>

                    {/* Right */}

                    <div>

                        <div
                            className="
                        bg-white
                        border
                        rounded-2xl
                        p-6
                        sticky
                        top-24
                        "
                        >

                            <h2
                                className="
                            text-xl
                            font-bold
                            mb-6
                            "
                            >
                                Seat Status
                            </h2>

                            <div className="space-y-4">

                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-emerald-500"/>
                                    Available
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-blue-500"/>
                                    Your Hold
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-amber-500"/>
                                    Held
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-red-500"/>
                                    Confirmed
                                </div>

                            </div>

                            <div className="mt-8">

                                <p className="text-sm text-muted-foreground">
                                    Click an available seat to continue to payment.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SeatsPage;