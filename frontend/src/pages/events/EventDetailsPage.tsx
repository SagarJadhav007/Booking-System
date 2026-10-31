import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Ticket,
    ShieldCheck,
    Users,
    Sparkles,
    ArrowRight,
} from "lucide-react";

import type { Event } from "../../types/event";
import type { Seat } from "../../types/seat";
import { getEventById } from "../../api/eventApi";
import { getSeats } from "../../api/seatApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer, PageShell } from "@/components/layout/PageShell";
import { EventCover } from "@/components/events/EventCover";
import { FadeIn } from "@/components/motion/FadeIn";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { getAvailability } from "@/lib/seats";

const EventDetailsPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [seats, setSeats] = useState<Seat[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!eventId) return;
            try {
                const [eventData, seatData] = await Promise.all([
                    getEventById(eventId),
                    getSeats(eventId).catch(() => null),
                ]);
                setEvent(eventData);
                setSeats(seatData);
            } catch (error) {
                console.error("Failed to load event details", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [eventId]);

    const availability = useMemo(
        () => (seats ? getAvailability(seats) : null),
        [seats]
    );

    return (
        <PageShell>
            <PageContainer className="pb-20">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6 -ml-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => navigate("/events")}
                >
                    <ArrowLeft className="mr-1.5 size-3.5" />
                    Back to All Events
                </Button>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-8">
                        <Skeleton className="aspect-[21/9] max-h-[460px] w-full rounded-2xl" />
                        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-2/3" />
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    </div>
                )}

                {/* Not Found State */}
                {!loading && !event && (
                    <EmptyState
                        icon={Ticket}
                        title="Event Not Found"
                        description="This event may no longer exist or has been archived."
                        action={
                            <Button onClick={() => navigate("/events")}>
                                Browse All Events
                            </Button>
                        }
                    />
                )}

                {/* Loaded Content */}
                {!loading && event && (
                    <FadeIn>
                        {/* Widescreen Banner */}
                        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12151b] shadow-2xl">
                            <EventCover
                                eventId={event.eventId}
                                eventName={event.eventName}
                                className="aspect-[21/9] max-h-[440px] w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-black/40 to-transparent" />
                            <div className="absolute top-5 right-5">
                                <StatusBadge tone={event.active ? "success" : "neutral"}>
                                    {event.active ? "Booking Open" : "Closed"}
                                </StatusBadge>
                            </div>
                        </div>

                        {/* Main Layout: 2 Columns */}
                        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
                            {/* Left: Event Details */}
                            <div className="space-y-8">
                                <div>
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent-foreground">
                                            <Sparkles className="size-3 text-primary" />
                                            Featured Event
                                        </span>
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                                            {event.venue}
                                        </span>
                                    </div>
                                    <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
                                        {event.eventName}
                                    </h1>
                                </div>

                                {/* Information Cards */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3.5 rounded-xl border border-white/[0.08] bg-[#12151b] p-5">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Calendar className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase">
                                                Date & Time
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-foreground">
                                                {formatEventDate(event.eventDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5 rounded-xl border border-white/[0.08] bg-[#12151b] p-5">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <MapPin className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase">
                                                Venue
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-foreground">
                                                {event.venue}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Description */}
                                <div className="rounded-xl border border-white/[0.08] bg-[#12151b] p-6 sm:p-8">
                                    <h2 className="font-heading text-lg font-semibold text-white">
                                        About This Event
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-muted-foreground whitespace-pre-line sm:text-base">
                                        {event.description ||
                                            "Join us for an unforgettable live experience. Secure your seat through real-time interactive seat selection and direct booking confirmation."}
                                    </p>

                                    <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/[0.06] pt-5 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck className="size-4 text-emerald-400" />
                                            Verified Event Organizer
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="size-4 text-accent-foreground" />
                                            Doors open 1 hour prior
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Booking Summary Sidebar */}
                            <aside className="h-fit space-y-5 rounded-2xl border border-white/10 bg-[#12151b] p-6 shadow-xl lg:sticky lg:top-20">
                                <div>
                                    <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                                        Admission & Pricing
                                    </p>
                                    {availability?.minPrice != null ? (
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="font-heading text-3xl font-bold tracking-tight text-white">
                                                {availability.minPrice === availability.maxPrice
                                                    ? formatCurrency(availability.minPrice)
                                                    : `${formatCurrency(availability.minPrice)} – ${formatCurrency(availability.maxPrice)}`}
                                            </span>
                                            <span className="text-xs text-muted-foreground">/ seat</span>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-2xl font-bold text-white">
                                            Standard Admission
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 border-t border-white/[0.08] pt-4 text-xs text-muted-foreground">
                                    {availability && (
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Ticket className="size-4 text-accent-foreground" />
                                                Live Availability
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {availability.available} of {availability.total} seats left
                                            </span>
                                        </div>
                                    )}

                                    {event.totalSeats != null && !availability && (
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Users className="size-4 text-accent-foreground" />
                                                Total Capacity
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {event.totalSeats} seats
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Clock className="size-4 text-accent-foreground" />
                                            Seat Hold Duration
                                        </span>
                                        <span className="font-medium text-foreground">
                                            Real-time Redis Hold
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="h-12 w-full gap-2 text-sm font-semibold shadow-[0_4px_20px_rgb(124_108_255_/_0.35)]"
                                    disabled={event.active === false}
                                    onClick={() => navigate(`/events/${event.eventId}/seats`)}
                                >
                                    Select Seats & Book
                                    <ArrowRight className="size-4" />
                                </Button>

                                <p className="text-center text-[11px] text-muted-foreground">
                                    Interactive seat selection with immediate temporary lock.
                                </p>
                            </aside>
                        </div>
                    </FadeIn>
                )}
            </PageContainer>
        </PageShell>
    );
};

export default EventDetailsPage;
