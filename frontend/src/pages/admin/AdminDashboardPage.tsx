import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    IndianRupee,
    Plus,
    Search,
    Ticket,
    Users,
    ExternalLink,
} from "lucide-react";

import { getStats } from "../../api/adminApi";
import { getEvents } from "../../api/eventApi";
import { getAllBookings } from "../../api/bookingApi";
import type { AdminStats } from "../../types/admin";
import type { Event } from "../../types/event";
import type { Booking } from "../../types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PageContainer, PageHeader, PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatEventDate, shortId } from "@/lib/format";

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"events" | "bookings">("events");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsData, eventData, bookingData] = await Promise.all([
                    getStats().catch(() => null),
                    getEvents().catch(() => []),
                    getAllBookings().catch(() => []),
                ]);
                setStats(statsData);
                setEvents(eventData);
                setBookings(bookingData);
            } catch (error) {
                console.error("Failed to load admin metrics", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredEvents = useMemo(() => {
        if (!search.trim()) return events;
        const q = search.trim().toLowerCase();
        return events.filter(
            (e) =>
                e.eventName.toLowerCase().includes(q) ||
                e.venue.toLowerCase().includes(q) ||
                e.eventId.toLowerCase().includes(q)
        );
    }, [events, search]);

    const eventMap = useMemo(
        () => new Map(events.map((e) => [e.eventId, e])),
        [events]
    );

    const metrics = [
        {
            label: "Registered Users",
            value: stats?.totalUsers,
            icon: Users,
            color: "text-blue-400",
        },
        {
            label: "Total Events",
            value: stats?.totalEvents ?? events.length,
            icon: Calendar,
            color: "text-purple-400",
        },
        {
            label: "Confirmed Bookings",
            value: stats?.totalBookings ?? bookings.length,
            icon: Ticket,
            color: "text-emerald-400",
        },
        {
            label: "Platform Revenue",
            value: stats ? formatCurrency(stats.revenue) : null,
            icon: IndianRupee,
            color: "text-amber-400",
        },
    ];

    return (
        <PageShell>
            <PageContainer wide className="pb-20">
                <FadeIn>
                    <PageHeader
                        eyebrow="Management Console"
                        title="Admin Dashboard"
                        description="Real-time operational metrics, event publishing, and ticket reservations across the platform."
                        actions={
                            <Button
                                onClick={() => navigate("/admin/create-event")}
                                className="h-10 gap-2 text-xs font-semibold shadow-[0_2px_15px_rgb(124_108_255_/_0.3)]"
                            >
                                <Plus className="size-4" />
                                Create New Event
                            </Button>
                        }
                    />
                </FadeIn>

                {/* 4 Metric Cards */}
                <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-lg transition-all hover:border-white/15"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {item.label}
                                </span>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-white/5">
                                    <item.icon className={`size-4 ${item.color}`} />
                                </div>
                            </div>
                            {loading || item.value == null ? (
                                <Skeleton className="mt-4 h-8 w-24" />
                            ) : (
                                <p className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    {item.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Management Section: Tabs & Search */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#12151b] shadow-2xl">
                    <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0b0d10] p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setActiveTab("events")}
                                className={`rounded-md px-3.5 py-1.5 font-medium transition-colors ${
                                    activeTab === "events"
                                        ? "bg-white/10 text-white"
                                        : "text-muted-foreground hover:text-white"
                                }`}
                            >
                                Events Catalog ({events.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("bookings")}
                                className={`rounded-md px-3.5 py-1.5 font-medium transition-colors ${
                                    activeTab === "bookings"
                                        ? "bg-white/10 text-white"
                                        : "text-muted-foreground hover:text-white"
                                }`}
                            >
                                Recent Bookings ({bookings.length})
                            </button>
                        </div>

                        {/* Search Input */}
                        {activeTab === "events" && (
                            <div className="relative max-w-xs flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Filter by name or venue..."
                                    className="h-8 border-white/10 bg-[#0b0d10] pl-8 text-xs"
                                />
                            </div>
                        )}
                    </div>

                    {/* Events Table View */}
                    {activeTab === "events" && (
                        <div>
                            {loading && (
                                <div className="space-y-2 p-6">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            )}

                            {!loading && filteredEvents.length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No events found. Click &quot;Create New Event&quot; to add one.
                                    </p>
                                </div>
                            )}

                            {!loading && filteredEvents.length > 0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/[0.06] hover:bg-transparent">
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Event Title
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Venue
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Date & Time
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Total Seats
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-right text-xs uppercase text-muted-foreground">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.map((event) => (
                                            <TableRow
                                                key={event.eventId}
                                                className="border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                                            >
                                                <TableCell className="font-medium text-foreground">
                                                    {event.eventName}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {event.venue}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatEventDate(event.eventDate)}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {event.totalSeats ?? "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge tone={event.active ? "success" : "neutral"}>
                                                        {event.active ? "Active" : "Archived"}
                                                    </StatusBadge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                                        onClick={() => navigate(`/events/${event.eventId}`)}
                                                    >
                                                        View Page
                                                        <ExternalLink className="size-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    )}

                    {/* Bookings Table View */}
                    {activeTab === "bookings" && (
                        <div>
                            {loading && (
                                <div className="space-y-2 p-6">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            )}

                            {!loading && bookings.length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No bookings recorded in the system yet.
                                    </p>
                                </div>
                            )}

                            {!loading && bookings.length > 0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/[0.06] hover:bg-transparent">
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Booking Ref
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Event
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Seat ID
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Amount
                                            </TableHead>
                                            <TableHead className="text-xs uppercase text-muted-foreground">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-right text-xs uppercase text-muted-foreground">
                                                Booked At
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => {
                                            const event = eventMap.get(booking.eventId);
                                            return (
                                                <TableRow
                                                    key={booking.bookingId}
                                                    className="border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                                                >
                                                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                                                        {shortId(booking.bookingId, 10)}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {event?.eventName ?? shortId(booking.eventId, 8)}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                                        {shortId(booking.seatId, 8)}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                                                        {formatCurrency(booking.amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge tone="success">
                                                            Confirmed
                                                        </StatusBadge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs text-muted-foreground">
                                                        {booking.bookedAt
                                                            ? new Date(booking.bookedAt).toLocaleString()
                                                            : "Recent"}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    )}
                </div>
            </PageContainer>
        </PageShell>
    );
};

export default AdminDashboardPage;
