import { useEffect, useMemo, useState } from "react";
import {
    Calendar,
    Copy,
    ExternalLink,
    MapPin,
    Search,
    Ticket,
    Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Booking } from "../../types/booking";
import type { Event } from "../../types/event";
import { getMyBookings, getAllBookings } from "../../api/bookingApi";
import { getEvents } from "../../api/eventApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader, PageShell } from "@/components/layout/PageShell";
import { EventCover } from "@/components/events/EventCover";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatEventDate, shortId } from "@/lib/format";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "@/components/ui/toast";

const BookingsPage = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const toast = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [bookingData, eventData] = await Promise.all([
                    role === "ADMIN" ? getAllBookings() : getMyBookings(),
                    getEvents().catch(() => []),
                ]);
                setBookings(bookingData);
                setEvents(eventData);
            } catch (error) {
                console.error("Failed to load bookings", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [role]);

    const eventMap = useMemo(
        () => new Map(events.map((event) => [event.eventId, event])),
        [events]
    );

    const filteredBookings = useMemo(() => {
        if (!search.trim()) return bookings;
        const q = search.trim().toLowerCase();
        return bookings.filter((booking) => {
            const event = eventMap.get(booking.eventId);
            return (
                booking.bookingId.toLowerCase().includes(q) ||
                booking.seatId.toLowerCase().includes(q) ||
                (event && event.eventName.toLowerCase().includes(q)) ||
                (event && event.venue.toLowerCase().includes(q))
            );
        });
    }, [bookings, search, eventMap]);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        toast.success("Reference copied");
        setTimeout(() => setCopiedId(null), 1500);
    };

    return (
        <PageShell>
            <PageContainer className="pb-20">
                <FadeIn>
                    <PageHeader
                        eyebrow={role === "ADMIN" ? "Platform Administration" : "Your Account"}
                        title={role === "ADMIN" ? "All Platform Bookings" : "My Bookings"}
                        description={
                            role === "ADMIN"
                                ? "Complete database of confirmed ticket orders across all live events."
                                : "Manage your confirmed tickets, event schedules, and digital passes."
                        }
                    />

                    {/* Search filter if bookings exist */}
                    {bookings.length > 2 && (
                        <div className="relative mb-6 max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by reference, event, or seat..."
                                className="h-9 border-white/10 bg-[#12151b] pl-8 text-xs"
                            />
                        </div>
                    )}
                </FadeIn>

                {/* Skeletons */}
                {loading && (
                    <div className="grid gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex h-36 w-full items-center gap-4 rounded-xl border border-white/[0.08] bg-[#12151b] p-4"
                            >
                                <Skeleton className="h-full w-40 rounded-lg" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && bookings.length === 0 && (
                    <EmptyState
                        icon={Ticket}
                        title="No confirmed bookings yet"
                        description="Once you complete a seat reservation and payment, your official passes will appear here."
                        action={
                            <Button
                                className="shadow-[0_2px_12px_rgb(124_108_255_/_0.3)]"
                                onClick={() => navigate("/events")}
                            >
                                Explore Live Events
                            </Button>
                        }
                    />
                )}

                {/* Filter Empty State */}
                {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
                    <EmptyState
                        title="No bookings match your search"
                        description="Try searching with a different booking reference or event name."
                        action={
                            <Button variant="outline" onClick={() => setSearch("")}>
                                Clear Search
                            </Button>
                        }
                    />
                )}

                {/* Bookings List */}
                {!loading && filteredBookings.length > 0 && (
                    <Stagger className="grid gap-4">
                        {filteredBookings.map((booking, index) => {
                            const event = eventMap.get(booking.eventId);
                            const refCode = shortId(booking.bookingId, 12);

                            return (
                                <StaggerItem key={booking.bookingId} index={index}>
                                    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#12151b] transition-all duration-200 hover:border-white/16 hover:shadow-[0_8px_30px_rgb(0_0_0_/0.35)] sm:flex-row">
                                        {/* Event thumbnail */}
                                        <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48">
                                            <EventCover
                                                eventId={booking.eventId}
                                                eventName={event?.eventName ?? "Event"}
                                                className="h-full w-full"
                                            />
                                        </div>

                                        {/* Booking Information */}
                                        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                                            <div>
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                                                            REF: {refCode}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(booking.bookingId)}
                                                            className="text-muted-foreground hover:text-foreground"
                                                            title="Copy Reference"
                                                        >
                                                            {copiedId === booking.bookingId ? (
                                                                <Check className="size-3 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="size-3" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge tone="success">
                                                            Confirmed & Paid
                                                        </StatusBadge>
                                                    </div>
                                                </div>

                                                <h3 className="mt-2 font-heading text-lg font-semibold text-white">
                                                    {event?.eventName ?? `Event ID: ${shortId(booking.eventId)}`}
                                                </h3>

                                                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                                                    {event?.eventDate && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="size-3.5 text-accent-foreground" />
                                                            {formatEventDate(event.eventDate)}
                                                        </span>
                                                    )}
                                                    {event?.venue && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="size-3.5 text-accent-foreground" />
                                                            {event.venue}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Strip: Seat & Amount */}
                                            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-3.5 text-xs">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                                                        <Ticket className="size-3.5 text-primary" />
                                                        <span>Seat: {shortId(booking.seatId, 8)}</span>
                                                    </div>
                                                    <span className="text-zinc-600">·</span>
                                                    <span className="font-semibold text-foreground">
                                                        {formatCurrency(booking.amount)}
                                                    </span>
                                                </div>

                                                {booking.eventId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                                        onClick={() => navigate(`/events/${booking.eventId}`)}
                                                    >
                                                        View Event Page
                                                        <ExternalLink className="size-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                )}
            </PageContainer>
        </PageShell>
    );
};

export default BookingsPage;
