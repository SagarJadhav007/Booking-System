import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Clock,
    MapPin,
    RefreshCw,
    Shield,
    Ticket,
    X,
} from "lucide-react";

import type { Seat } from "../../types/seat";
import type { Event } from "../../types/event";
import { getSeats, reserveSeat } from "../../api/seatApi";
import { getEventById } from "../../api/eventApi";
import SeatGrid from "../../components/seats/SeatGrid";
import { Button } from "@/components/ui/button";
import { PageContainer, PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { isSeatOccupied } from "@/lib/seats";

const SeatsPage = () => {
    const navigate = useNavigate();
    const { eventId } = useParams<{ eventId: string }>();
    const toast = useToast();
    const [seats, setSeats] = useState<Seat[]>([]);
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);
    const [isPolling, setIsPolling] = useState(false);

    // Multi-seat selection state
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem("selectedSeats");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
            const single = localStorage.getItem("selectedSeat");
            return single ? [single] : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        let mounted = true;
        if (!eventId) return;

        getEventById(eventId)
            .then((data) => {
                if (mounted) setEvent(data);
            })
            .catch(console.error);

        getSeats(eventId)
            .then((data) => {
                if (mounted) {
                    setSeats(data);
                    setLoading(false);
                }
            })
            .catch(console.error);

        const interval = setInterval(async () => {
            try {
                if (mounted) setIsPolling(true);
                const data = await getSeats(eventId);
                if (mounted) setSeats(data);
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) {
                    setTimeout(() => setIsPolling(false), 500);
                }
            }
        }, 3000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [eventId]);

    // Active selected seat models
    const selectedSeats = useMemo(
        () => seats.filter((seat) => selectedSeatIds.includes(seat.seatId)),
        [seats, selectedSeatIds]
    );

    // Cumulative price calculation
    const totalAmount = useMemo(
        () => selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0),
        [selectedSeats]
    );

    const handleSeatClick = async (seat: Seat) => {
        const isAlreadySelected = selectedSeatIds.includes(seat.seatId);

        // If seat is occupied or held by another user
        if (isSeatOccupied(seat) && !(seat.status === "HELD" && seat.ownedByCurrentUser)) {
            toast.info("This seat is currently held or occupied by another attendee.");
            return;
        }

        // TOGGLE OFF: User clicked an already selected seat to deselect it
        if (isAlreadySelected) {
            const nextIds = selectedSeatIds.filter((id) => id !== seat.seatId);
            setSelectedSeatIds(nextIds);
            localStorage.setItem("selectedSeats", JSON.stringify(nextIds));
            if (nextIds.length > 0) {
                localStorage.setItem("selectedSeat", nextIds[0]);
            } else {
                localStorage.removeItem("selectedSeat");
                localStorage.removeItem("selectedSeats");
            }
            toast.info(`Seat ${seat.seatNumber} unselected`);
            return;
        }

        // LIMIT CHECK
        if (selectedSeatIds.length >= 8) {
            toast.error("You can select up to 8 seats per booking session.");
            return;
        }

        // TOGGLE ON: User clicked an available seat to select it
        try {
            setReserving(true);

            // Reserve seat in Redis if not already held by this user
            if (!(seat.status === "HELD" && seat.ownedByCurrentUser)) {
                await reserveSeat(seat.seatId);
            }

            const nextIds = [...selectedSeatIds, seat.seatId];
            setSelectedSeatIds(nextIds);
            localStorage.setItem("selectedSeats", JSON.stringify(nextIds));
            localStorage.setItem("selectedSeat", seat.seatId);
            localStorage.setItem("selectedEvent", seat.eventId);

            toast.success(`Seat ${seat.seatNumber} reserved (${formatCurrency(seat.price)})`);

            if (eventId) {
                const updated = await getSeats(eventId);
                setSeats(updated);
            }
        } catch {
            toast.error("Seat was just reserved by another user. Please choose another.");
            if (eventId) {
                const updated = await getSeats(eventId);
                setSeats(updated);
            }
        } finally {
            setReserving(false);
        }
    };

    const handleRemoveSeat = (seatIdToRemove: string, seatNumber: string) => {
        const nextIds = selectedSeatIds.filter((id) => id !== seatIdToRemove);
        setSelectedSeatIds(nextIds);
        localStorage.setItem("selectedSeats", JSON.stringify(nextIds));
        if (nextIds.length > 0) {
            localStorage.setItem("selectedSeat", nextIds[0]);
        } else {
            localStorage.removeItem("selectedSeat");
            localStorage.removeItem("selectedSeats");
        }
        toast.info(`Seat ${seatNumber} removed from selection`);
    };

    const handleClearAll = () => {
        setSelectedSeatIds([]);
        localStorage.removeItem("selectedSeat");
        localStorage.removeItem("selectedSeats");
        toast.info("All selected seats cleared.");
    };

    const continueToPayment = () => {
        if (selectedSeatIds.length === 0) {
            toast.error("Please select at least one available seat.");
            return;
        }
        localStorage.setItem("selectedSeats", JSON.stringify(selectedSeatIds));
        localStorage.setItem("selectedSeat", selectedSeatIds[0]);
        localStorage.setItem("selectedEvent", eventId!);
        navigate("/payment");
    };

    return (
        <PageShell>
            <PageContainer wide className="pb-20">
                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(eventId ? `/events/${eventId}` : "/events")}
                >
                    <ArrowLeft className="mr-1.5 size-3.5" />
                    Back to Event Overview
                </Button>

                {/* Stepper & Header */}
                <FadeIn>
                    <BookingSteps current={1} />
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Select Your Seats
                            </h1>
                            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                                {event ? (
                                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span className="font-medium text-foreground">{event.eventName}</span>
                                        <span>·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="size-3 text-accent-foreground" />
                                            {formatEventDate(event.eventDate)}
                                        </span>
                                        <span>·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="size-3 text-accent-foreground" />
                                            {event.venue}
                                        </span>
                                    </span>
                                ) : (
                                    "Click on multiple seats to build your group booking."
                                )}
                            </p>
                        </div>

                        {/* Live Sync Badge */}
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#12151b] px-3 py-1 text-xs text-muted-foreground">
                            <RefreshCw
                                className={`size-3 text-primary transition-transform duration-700 ${
                                    isPolling ? "animate-spin text-accent-foreground" : ""
                                }`}
                            />
                            <span>Live Seating Sync</span>
                        </div>
                    </div>
                </FadeIn>

                {/* Main Seating Content */}
                {loading ? (
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
                        <Skeleton className="h-[440px] w-full rounded-2xl" />
                        <Skeleton className="h-[360px] w-full rounded-2xl" />
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
                        {/* Seating Amphitheater Card */}
                        <div className="relative rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-2xl sm:p-10">
                            {/* Stage Arc & Indicator */}
                            <div className="mb-10 text-center">
                                <div className="stage-arc mx-auto max-w-lg" />
                                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                                    <span>STAGE & SCREEN AREA</span>
                                </div>
                            </div>

                            {/* Multi-seat interactive grid */}
                            <div className="my-8">
                                <SeatGrid
                                    seats={seats}
                                    selectedSeatIds={selectedSeatIds}
                                    onSeatClick={handleSeatClick}
                                />
                            </div>

                            {/* Seat Status Legend */}
                            <div className="mt-10 border-t border-white/[0.06] pt-6">
                                <p className="mb-3 text-center text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    Seating Legend
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="seat-available size-3.5 rounded-[4px]" />
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="seat-selected size-3.5 rounded-[4px]" />
                                        <span className="font-medium text-foreground">Selected by You</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="seat-held size-3.5 rounded-[4px]" />
                                        <span>Held in Real Time</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="seat-occupied size-3.5 rounded-[4px]" />
                                        <span>Occupied</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Multi-seat Summary Sidebar */}
                        <aside className="h-fit space-y-6 rounded-2xl border border-white/10 bg-[#12151b] p-6 shadow-xl lg:sticky lg:top-20">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-heading text-lg font-semibold text-white">
                                        Selected Seats
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedSeats.length > 0
                                            ? `${selectedSeats.length} ${
                                                  selectedSeats.length === 1 ? "seat" : "seats"
                                              } held for your group`
                                            : "Click seats on the chart to select multiple."}
                                    </p>
                                </div>
                                {selectedSeats.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="text-[11px] text-muted-foreground transition-colors hover:text-red-400"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Selected Seats List */}
                            <div className="rounded-xl border border-white/[0.08] bg-[#0b0d10]/60 p-4">
                                {selectedSeats.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                                            {selectedSeats.map((seat) => (
                                                <div
                                                    key={seat.seatId}
                                                    className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 text-xs transition-colors hover:border-white/10"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex size-6 items-center justify-center rounded bg-primary/15 font-mono text-[11px] font-bold text-accent-foreground">
                                                            {seat.seatNumber}
                                                        </span>
                                                        <div>
                                                            <p className="font-semibold text-foreground">
                                                                Row {seat.rowNumber}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                Reserved Admission
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-foreground">
                                                            {formatCurrency(seat.price)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveSeat(seat.seatId, seat.seatNumber);
                                                            }}
                                                            className="text-muted-foreground hover:text-red-400"
                                                            title="Remove seat"
                                                        >
                                                            <X className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cumulative Price Breakdown */}
                                        <div className="border-t border-white/[0.08] pt-3 space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Ticket Quantity</span>
                                                <span className="font-medium text-foreground">
                                                    {selectedSeats.length}x
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Taxes & Fees</span>
                                                <span className="font-medium text-emerald-400">Included</span>
                                            </div>
                                            <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-foreground">
                                                    Total Price
                                                </span>
                                                <span className="font-heading text-xl font-bold text-primary">
                                                    {formatCurrency(totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-xs text-muted-foreground">
                                        <Ticket className="mx-auto mb-2 size-6 text-muted-foreground/40" />
                                        <p className="font-medium text-foreground">No seats selected</p>
                                        <p className="mt-1">
                                            Click on any available green seat. You can select multiple seats.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Shield className="size-4 shrink-0 text-emerald-400" />
                                    <span>High-concurrency anti-double-booking guarantee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 shrink-0 text-accent-foreground" />
                                    <span>All selected seats held for 10 minutes</span>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="h-12 w-full gap-2 text-sm font-semibold shadow-[0_4px_20px_rgb(124_108_255_/_0.35)]"
                                disabled={selectedSeats.length === 0 || reserving}
                                onClick={continueToPayment}
                            >
                                {reserving ? (
                                    "Holding Seats..."
                                ) : selectedSeats.length > 0 ? (
                                    <>
                                        <span>
                                            Continue ({selectedSeats.length}{" "}
                                            {selectedSeats.length === 1 ? "Seat" : "Seats"} ·{" "}
                                            {formatCurrency(totalAmount)})
                                        </span>
                                        <ArrowRight className="size-4" />
                                    </>
                                ) : (
                                    "Select Seats to Continue"
                                )}
                            </Button>
                        </aside>
                    </div>
                )}
            </PageContainer>
        </PageShell>
    );
};

export default SeatsPage;
