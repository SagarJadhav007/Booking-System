import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Check,
    Copy,
    Printer,
    Ticket,
    ArrowRight,
    Sparkles,
    Calendar,
    MapPin,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer, PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { SuccessCheck } from "@/components/booking/SuccessCheck";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { useToast } from "@/components/ui/toast";

interface SuccessState {
    bookingId?: string;
    bookingIds?: string[];
    seatId?: string;
    seatIds?: string[];
    seatCount?: number;
    eventId?: string;
    eventName?: string;
    eventDate?: string;
    venue?: string;
    seatNumber?: string;
    seatNumbers?: string[];
    rowNumber?: string;
    amount?: number;
}

const BookingSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [copied, setCopied] = useState(false);
    const state = (location.state ?? {}) as SuccessState;

    const count = state.seatCount || (state.seatNumbers ? state.seatNumbers.length : 1);

    const bookingRef =
        state.bookingId ||
        (state.seatId ? `SPARK-BK-${state.seatId.slice(0, 8).toUpperCase()}` : "SPARK-BK-DEMO-01");

    const copyReference = () => {
        navigator.clipboard.writeText(bookingRef);
        setCopied(true);
        toast.success("Booking ID copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <PageShell>
            <PageContainer className="flex min-h-[75vh] flex-col items-center justify-center pb-20">
                <FadeIn className="w-full max-w-xl">
                    <BookingSteps current={3} />

                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12151b] p-8 text-center shadow-2xl sm:p-10">
                        {/* Animated Subtle Success Checkmark */}
                        <SuccessCheck />

                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            <ShieldCheck className="size-3.5" />
                            <span>Payment & Reservation Confirmed</span>
                        </div>

                        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            You&apos;re All Set!
                        </h1>

                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            Your reservation for {count} {count === 1 ? "seat" : "seats"} is finalized in the database. A digital ticket pass has been issued to your account.
                        </p>

                        {/* Digital Ticket Pass Card */}
                        <div className="relative mt-8 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0d10] p-6 text-left shadow-lg">
                            {/* Decorative Perforation Notches */}
                            <div className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full border-r border-white/10 bg-[#12151b]" />
                            <div className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full border-l border-white/10 bg-[#12151b]" />

                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                                <div>
                                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Confirmed Booking ID
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="font-mono text-sm font-bold text-foreground">
                                            {bookingRef}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={copyReference}
                                            className="text-muted-foreground transition-colors hover:text-foreground"
                                            title="Copy Booking ID"
                                        >
                                            {copied ? (
                                                <Check className="size-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="size-3.5" />
                                            )}
                                        </button>
                                    </div>
                                    {state.bookingIds && state.bookingIds.length > 1 && (
                                        <p className="mt-1 text-[10px] text-muted-foreground">
                                            +{state.bookingIds.length - 1} linked group seat reservations
                                        </p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent-foreground">
                                        ADMIT {count}
                                    </span>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="mt-4 space-y-3.5 text-xs">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Event Experience</p>
                                    <p className="mt-0.5 font-heading text-base font-semibold text-white">
                                        {state.eventName ?? "Live Event Experience"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {state.eventDate && (
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase">Date & Time</p>
                                            <p className="mt-0.5 flex items-center gap-1 font-medium text-foreground">
                                                <Calendar className="size-3 text-accent-foreground" />
                                                {formatEventDate(state.eventDate)}
                                            </p>
                                        </div>
                                    )}
                                    {state.venue && (
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase">Venue</p>
                                            <p className="mt-0.5 flex items-center gap-1 font-medium text-foreground">
                                                <MapPin className="size-3 text-accent-foreground" />
                                                {state.venue}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-dashed border-white/[0.08] pt-3.5">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase">
                                            Assigned {count === 1 ? "Seat" : "Seats"} ({count})
                                        </p>
                                        <p className="mt-0.5 font-mono font-semibold text-primary">
                                            {state.seatNumber
                                                ? `Seat ${state.seatNumber}`
                                                : "Reserved Seats"}
                                            {state.rowNumber ? ` (Row ${state.rowNumber})` : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase">Total Amount Paid</p>
                                        <p className="mt-0.5 font-mono font-semibold text-foreground">
                                            {formatCurrency(state.amount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-white/[0.06] pt-3">
                                    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                        <Sparkles className="size-3 text-primary" />
                                        <span>Demo mock payment simulated successfully via Spring Boot.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action CTA Buttons */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                className="h-11 flex-1 gap-2 text-xs font-semibold shadow-[0_4px_18px_rgb(124_108_255_/_0.35)]"
                                onClick={() => navigate("/bookings")}
                            >
                                <Ticket className="size-4" />
                                View My Bookings
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-11 border-white/10 text-xs text-muted-foreground hover:text-foreground"
                                onClick={handlePrint}
                            >
                                <Printer className="size-4" />
                                Print Ticket
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="h-11 border-white/10 text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => navigate("/events")}
                            >
                                Explore Events
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            </PageContainer>
        </PageShell>
    );
};

export default BookingSuccessPage;
