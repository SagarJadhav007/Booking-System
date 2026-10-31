import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    CreditCard,
    Lock,
    Loader2,
    MapPin,
    ShieldCheck,
    Sparkles,
    Ticket,
} from "lucide-react";

import { startPayment, confirmPayment } from "../../api/paymentApi";
import { getSeats, reserveSeat } from "../../api/seatApi";
import { getEventById } from "../../api/eventApi";
import { getMyBookings } from "../../api/bookingApi";
import type { Event } from "../../types/event";
import type { Seat } from "../../types/seat";
import { Button } from "@/components/ui/button";
import { PageContainer, PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { StatusBadge } from "@/components/ui/status-badge";
import { EventCover } from "@/components/events/EventCover";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { useToast } from "@/components/ui/toast";

const PaymentPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const eventId = localStorage.getItem("selectedEvent");

    // Retrieve multiple selected seat IDs (with backward compatibility)
    const [selectedSeatIds] = useState<string[]>(() => {
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

    const [event, setEvent] = useState<Event | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    // Processing animation states
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isSubmittingRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (!eventId || selectedSeatIds.length === 0) {
                navigate("/events");
                return;
            }
            try {
                const [eventData, allSeats] = await Promise.all([
                    getEventById(eventId),
                    getSeats(eventId),
                ]);
                if (isMounted) {
                    setEvent(eventData);
                    const matched = allSeats.filter((item) =>
                        selectedSeatIds.includes(item.seatId)
                    );
                    setSelectedSeats(matched);
                }
            } catch (error) {
                console.error("Failed to load payment details", error);
                if (isMounted) {
                    setErrorMessage("Unable to load reservation details. Please reselect your seats.");
                }
            } finally {
                if (isMounted) setInitialLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, [eventId, selectedSeatIds, navigate]);

    // Calculate total amount for all selected seats
    const totalAmount = useMemo(
        () => selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0),
        [selectedSeats]
    );

    const handlePayment = async () => {
        if (selectedSeats.length === 0 || !event) {
            toast.error("No active seats selected. Please return to seat selection.");
            return;
        }

        // Prevent duplicate submissions
        if (isSubmittingRef.current || isProcessing) return;
        isSubmittingRef.current = true;
        setIsProcessing(true);
        setErrorMessage(null);
        setProcessingStep(0);

        // Step progression timers for realistic 1.8s feedback
        const step1Timer = setTimeout(() => setProcessingStep(1), 600);
        const step2Timer = setTimeout(() => setProcessingStep(2), 1250);

        try {
            const startTime = Date.now();

            // Process every selected seat through the real backend payment flow
            for (const seat of selectedSeats) {
                // Ensure Redis hold is active (re-acquire if needed)
                try {
                    await reserveSeat(seat.seatId);
                } catch {
                    // Ignore if already held by current user
                }

                // 1. Start payment (transitions hold to PAYMENT_PENDING in Redis)
                await startPayment(seat.seatId);

                // 2. Confirm payment (calls Spring Boot MockPaymentGateway & creates PostgreSQL booking)
                await confirmPayment(seat.seatId);
            }

            // 3. Fetch newly created booking records from backend
            let confirmedBookingIds: string[] = [];
            try {
                const myBookings = await getMyBookings();
                const matchedBookings = myBookings.filter((b) =>
                    selectedSeats.some((s) => s.seatId === b.seatId)
                );
                if (matchedBookings.length > 0) {
                    confirmedBookingIds = matchedBookings.map((b) => b.bookingId);
                }
            } catch (fetchErr) {
                console.warn("Could not retrieve latest booking list immediately", fetchErr);
            }

            // Ensure minimum realistic 1.8 second duration
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 1850 - elapsed);
            if (remaining > 0) {
                await new Promise((resolve) => setTimeout(resolve, remaining));
            }

            // Clear temporary reservation hold from localStorage
            localStorage.removeItem("selectedSeat");
            localStorage.removeItem("selectedSeats");
            localStorage.removeItem("selectedEvent");

            const seatNumbers = selectedSeats.map((s) => s.seatNumber);
            const rowNumbers = Array.from(new Set(selectedSeats.map((s) => s.rowNumber)));

            // Redirect to booking success page with complete group information
            navigate("/booking-success", {
                state: {
                    bookingId:
                        confirmedBookingIds[0] ||
                        `SPARK-BK-${selectedSeats[0]?.seatId.slice(0, 8).toUpperCase()}`,
                    bookingIds: confirmedBookingIds,
                    seatCount: selectedSeats.length,
                    seatNumber: seatNumbers.join(", "),
                    rowNumber: rowNumbers.join(", "),
                    seatNumbers,
                    eventId: event.eventId,
                    eventName: event.eventName,
                    eventDate: event.eventDate,
                    venue: event.venue,
                    amount: totalAmount,
                },
                replace: true,
            });
        } catch (error: unknown) {
            clearTimeout(step1Timer);
            clearTimeout(step2Timer);
            console.error("Payment failure", error);

            const err = error as {
                response?: { data?: { message?: string } | string };
                message?: string;
            };

            const serverMsg =
                (typeof err?.response?.data === "object"
                    ? err.response?.data?.message
                    : err?.response?.data) || err?.message;

            const friendlyMsg =
                typeof serverMsg === "string" && serverMsg.includes("expired")
                    ? "Your temporary seat reservation expired. Please select the seats again."
                    : "The mock payment authorization could not be completed. Please retry.";

            setErrorMessage(friendlyMsg);
            toast.error(friendlyMsg);
            setIsProcessing(false);
            isSubmittingRef.current = false;
        }
    };

    return (
        <PageShell>
            {/* FULLSCREEN REALISTIC PROCESSING MODAL */}
            {isProcessing && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0d10]/85 p-4 backdrop-blur-md animate-in fade-in duration-300"
                >
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-[#12151b] p-8 text-center shadow-[0_10px_50px_rgb(0_0_0_/_0.8)]">
                        {/* Background radial glow */}
                        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

                        {/* Processing animation ring */}
                        <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary" />
                            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CreditCard className="size-6 animate-pulse" />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-accent-foreground">
                            <Sparkles className="size-3 text-primary" />
                            <span>Simulated Payment Gateway</span>
                        </div>

                        <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-white">
                            Processing your payment...
                        </h3>

                        <p className="mt-1.5 text-xs text-muted-foreground">
                            Authorizing {selectedSeats.length}{" "}
                            {selectedSeats.length === 1 ? "ticket" : "tickets"} (
                            {formatCurrency(totalAmount)}) with Mock Payment Gateway.
                        </p>

                        {/* Step checklist animation */}
                        <div className="mt-6 space-y-2.5 rounded-xl border border-white/[0.06] bg-[#0b0d10]/70 p-4 text-left text-xs">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                                <span className="text-zinc-200">
                                    Verifying {selectedSeats.length} seat locks on Redis cluster
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                {processingStep >= 1 ? (
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                                ) : (
                                    <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                                )}
                                <span className={processingStep >= 1 ? "text-zinc-200" : "text-muted-foreground"}>
                                    Authorizing transaction via Mock Payment Gateway
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                {processingStep >= 2 ? (
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                                ) : (
                                    <div className="size-4 shrink-0 rounded-full border border-white/20" />
                                )}
                                <span className={processingStep >= 2 ? "text-zinc-200" : "text-muted-foreground"}>
                                    Issuing confirmed tickets in database
                                </span>
                            </div>
                        </div>

                        <p className="mt-6 text-[11px] text-zinc-500">
                            Please do not refresh or close this browser window.
                        </p>
                    </div>
                </div>
            )}

            <PageContainer className="max-w-4xl pb-20">
                <FadeIn>
                    <BookingSteps current={2} />
                    <div className="mb-8">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            <ShieldCheck className="size-3" />
                            <span>Demo Simulation Checkout</span>
                        </div>
                        <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Complete Your Checkout
                        </h1>
                        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                            Review your selected seats. Your reservations are secured in real-time until confirmation.
                        </p>
                    </div>
                </FadeIn>

                {/* Inline Error Alert */}
                {errorMessage && (
                    <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200">
                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
                        <div className="flex-1">
                            <p className="font-semibold text-red-300">Transaction Not Completed</p>
                            <p className="mt-0.5 text-red-200/80">{errorMessage}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setErrorMessage(null);
                                navigate(`/events/${eventId}/seats`);
                            }}
                            className="h-8 border-red-500/30 bg-red-500/20 text-xs text-white hover:bg-red-500/30"
                        >
                            Return to Seats
                        </Button>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Left: Booking Details & Security */}
                    <div className="space-y-6">
                        {/* Event Summary Card */}
                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-heading text-base font-semibold text-white">
                                    Event Overview
                                </h2>
                                <StatusBadge tone="warning">Temporary Holds Active</StatusBadge>
                            </div>

                            {event && (
                                <div className="flex gap-4">
                                    <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10">
                                        <EventCover
                                            eventId={event.eventId}
                                            eventName={event.eventName}
                                            className="h-full w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5 text-xs">
                                        <h3 className="font-heading text-base font-semibold text-foreground">
                                            {event.eventName}
                                        </h3>
                                        <p className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="size-3 text-accent-foreground" />
                                            {formatEventDate(event.eventDate)}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin className="size-3 text-accent-foreground" />
                                            {event.venue}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Reserved Multiple Seats Breakdown */}
                            <div className="mt-6 border-t border-white/[0.08] pt-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Assigned Seats ({selectedSeats.length})
                                    </p>
                                    <span className="text-xs text-primary font-medium">
                                        {selectedSeats.length} {selectedSeats.length === 1 ? "Ticket" : "Tickets"}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {selectedSeats.map((seat) => (
                                        <div
                                            key={seat.seatId}
                                            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0b0d10]/60 p-3.5 text-xs"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Ticket className="size-3.5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        Seat {seat.seatNumber}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Row {seat.rowNumber} · General Reserved Admission
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-sm font-semibold text-foreground">
                                                {formatCurrency(seat.price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Security & Simulation Banner */}
                        <div className="rounded-xl border border-white/[0.08] bg-[#12151b] p-5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                                <div className="text-xs">
                                    <p className="font-semibold text-foreground">
                                        Guaranteed Seat Allocation & Simulated Gateway
                                    </p>
                                    <p className="mt-1 text-muted-foreground leading-relaxed">
                                        All your seat holds are protected against race conditions by the distributed Redis locking layer. This checkout uses an integrated Spring Boot mock payment gateway — no actual funds are charged.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Cumulative Price Breakdown & Payment Action */}
                    <aside className="h-fit space-y-6 rounded-2xl border border-white/10 bg-[#12151b] p-6 shadow-xl lg:sticky lg:top-20">
                        <div>
                            <h2 className="font-heading text-lg font-semibold text-white">
                                Order Summary
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Review the itemized charges before completing checkout.
                            </p>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>{selectedSeats.length}x Admission Tickets</span>
                                <span className="font-medium text-foreground">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Gateway Processing Fee</span>
                                <span className="font-medium text-emerald-400">Demo (₹0)</span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Estimated Taxes & GST</span>
                                <span className="font-medium text-muted-foreground">Included</span>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
                                <span className="text-sm font-semibold text-foreground">
                                    Total Amount
                                </span>
                                <span className="font-heading text-2xl font-bold text-primary">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#0b0d10]/60 p-3.5 text-xs text-muted-foreground">
                            <Lock className="size-4 shrink-0 text-accent-foreground" />
                            <span>Simulated 256-bit sandbox payment session</span>
                        </div>

                        <Button
                            size="lg"
                            className="h-12 w-full gap-2 text-sm font-semibold shadow-[0_4px_25px_rgb(124_108_255_/_0.4)]"
                            disabled={isProcessing || initialLoading || selectedSeats.length === 0}
                            onClick={handlePayment}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Processing Payment...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="size-4" />
                                    <span>
                                        Pay {formatCurrency(totalAmount)} & Confirm (
                                        {selectedSeats.length}{" "}
                                        {selectedSeats.length === 1 ? "Seat" : "Seats"})
                                    </span>
                                </>
                            )}
                        </Button>

                        <p className="text-center text-[11px] text-muted-foreground">
                            Simulated transaction · Finalizes all {selectedSeats.length} seat reservations and issues digital passes.
                        </p>
                    </aside>
                </div>
            </PageContainer>
        </PageShell>
    );
};

export default PaymentPage;
