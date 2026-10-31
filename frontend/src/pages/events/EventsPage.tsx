import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowRight,
    Calendar,
    MapPin,
    Search,
    SlidersHorizontal,
    Sparkles,
    Ticket,
    X,
} from "lucide-react";

import type { Event } from "../../types/event";
import { getEvents } from "../../api/eventApi";
import EventCard from "../../components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer, PageShell } from "@/components/layout/PageShell";
import { EventCover } from "@/components/events/EventCover";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { formatEventDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const EventsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const search = searchParams.get("q") ?? "";
    const [venueFilter, setVenueFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState<"all" | "open">("all");

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (loadError) {
                console.error(loadError);
                setError("Unable to load events right now. Please check backend connection.");
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    const venues = useMemo(() => {
        const unique = Array.from(
            new Set(events.map((event) => event.venue).filter(Boolean))
        );
        return ["All", ...unique];
    }, [events]);

    const filteredEvents = useMemo(() => {
        const query = search.trim().toLowerCase();

        return events.filter((event) => {
            const matchesQuery =
                !query ||
                event.eventName.toLowerCase().includes(query) ||
                event.venue.toLowerCase().includes(query) ||
                (event.description && event.description.toLowerCase().includes(query));

            const matchesVenue = venueFilter === "All" || event.venue === venueFilter;
            const matchesStatus = statusFilter === "all" || (statusFilter === "open" && event.active);

            return matchesQuery && matchesVenue && matchesStatus;
        });
    }, [events, search, venueFilter, statusFilter]);

    // Choose the most upcoming active event as featured
    const featured = useMemo(() => {
        if (events.length === 0) return null;
        const activeEvents = events.filter((e) => e.active);
        const pool = activeEvents.length > 0 ? activeEvents : events;
        return [...pool].sort(
            (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        )[0];
    }, [events]);

    const onSearchChange = (value: string) => {
        if (value.trim()) {
            setSearchParams({ q: value.trim() });
        } else {
            setSearchParams({});
        }
    };

    return (
        <PageShell>
            <PageContainer wide className="pb-20">
                {/* HERO SECTION */}
                {loading && (
                    <div className="mb-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12151b] p-8 sm:p-12">
                        <Skeleton className="mb-4 h-6 w-32 rounded-full" />
                        <Skeleton className="mb-4 h-14 w-3/4 max-w-2xl" />
                        <Skeleton className="mb-8 h-6 w-1/2 max-w-xl" />
                        <Skeleton className="h-12 w-full max-w-md rounded-xl" />
                    </div>
                )}

                {!loading && featured && (
                    <FadeIn>
                        <section className="group relative mb-16 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#12151b] shadow-[0_20px_50px_rgb(0_0_0_/0.6)]">
                            {/* Background Cover */}
                            <EventCover
                                eventId={featured.eventId}
                                eventName={featured.eventName}
                                className="min-h-[30rem] sm:aspect-[21/9] sm:min-h-0"
                            />

                            {/* Gradient Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/60 to-black/30" />

                            {/* Hero Content Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12">
                                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent-foreground backdrop-blur-md">
                                    <Sparkles className="size-3 text-primary" />
                                    <span>Spark Featured Presentation</span>
                                </div>

                                <h1 className="max-w-3xl font-heading text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    Make room for unforgettable experiences.
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                                    Discover live events, lock in your preferred seat in real time, and complete checkout through a calm, friction-free booking journey.
                                </p>

                                {/* Prominent Search Bar */}
                                <div className="relative mt-8 max-w-md">
                                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        placeholder="Search by event, artist, or venue..."
                                        className="h-12 border-white/14 bg-[#12151b]/90 pr-10 pl-10 text-sm text-foreground shadow-lg backdrop-blur-md focus-visible:border-primary focus-visible:bg-[#151922]"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => onSearchChange("")}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Spotlight Card on Featured Event */}
                                <div className="mt-8 flex max-w-3xl flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                                            Upcoming Spotlight
                                        </p>
                                        <h2 className="mt-1 font-heading text-xl font-medium text-white sm:text-2xl">
                                            {featured.eventName}
                                        </h2>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-accent-foreground" />
                                                {formatEventDate(featured.eventDate)}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <MapPin className="size-3.5 text-accent-foreground" />
                                                {featured.venue}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/events/${featured.eventId}`)}
                                            className="h-10 border-white/15 bg-white/5 text-xs text-white backdrop-blur-md hover:bg-white/10"
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            onClick={() => navigate(`/events/${featured.eventId}/seats`)}
                                            className="h-10 gap-2 text-xs shadow-[0_2px_15px_rgb(124_108_255_/_0.4)]"
                                        >
                                            Book Tickets
                                            <ArrowRight className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </FadeIn>
                )}

                {!loading && !featured && !error && (
                    <FadeIn>
                        <section className="mb-14 max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent-foreground">
                                <Sparkles className="size-3 text-primary" />
                                <span>Spark Event Platform</span>
                            </div>
                            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                Make room for unforgettable experiences.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                                Browse live concerts, theatre, and sports. Lock in your seats instantly.
                            </p>
                        </section>
                    </FadeIn>
                )}

                {/* DISCOVERY HEADER & FILTERS */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Discover Events
                            </h2>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {loading ? "..." : `${filteredEvents.length} available`}
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                            Hand-picked live performances and experiences with real-time seat mapping.
                        </p>
                    </div>

                    {/* Status Pill Toggle */}
                    <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#12151b] p-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setStatusFilter("all")}
                            className={cn(
                                "rounded-md px-3 py-1 font-medium transition-colors",
                                statusFilter === "all"
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-muted-foreground hover:text-white"
                            )}
                        >
                            All Events
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("open")}
                            className={cn(
                                "rounded-md px-3 py-1 font-medium transition-colors",
                                statusFilter === "open"
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Booking Open
                        </button>
                    </div>
                </div>

                {/* Venue filter chips */}
                {venues.length > 1 && (
                    <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
                        <span className="flex items-center gap-1.5 pr-2 text-xs font-medium text-muted-foreground">
                            <SlidersHorizontal className="size-3" />
                            Venue:
                        </span>
                        {venues.map((venue) => (
                            <button
                                key={venue}
                                type="button"
                                onClick={() => setVenueFilter(venue)}
                                className={cn(
                                    "rounded-full border px-3.5 py-1 text-xs font-medium whitespace-nowrap transition-all",
                                    venueFilter === venue
                                        ? "border-primary/40 bg-primary/15 text-foreground shadow-[0_0_12px_rgb(124_108_255_/_0.2)]"
                                        : "border-white/[0.08] bg-[#12151b]/60 text-muted-foreground hover:border-white/20 hover:text-foreground"
                                )}
                            >
                                {venue}
                            </button>
                        ))}
                    </div>
                )}

                {/* Skeletons while loading */}
                {loading && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#12151b]"
                            >
                                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                                <div className="space-y-3 p-5">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <Skeleton className="h-9 w-full" />
                                        <Skeleton className="h-9 w-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <EmptyState
                        title="Unable to load events"
                        description={error}
                        action={
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </Button>
                        }
                    />
                )}

                {/* Empty State when no results match filter */}
                {!loading && !error && filteredEvents.length === 0 && (
                    <EmptyState
                        icon={Ticket}
                        title="No matching events found"
                        description="Try adjusting your search criteria or clearing venue filters."
                        action={
                            <Button
                                variant="outline"
                                onClick={() => {
                                    onSearchChange("");
                                    setVenueFilter("All");
                                    setStatusFilter("all");
                                }}
                            >
                                Clear all filters
                            </Button>
                        }
                    />
                )}

                {/* Event Grid */}
                {!loading && !error && filteredEvents.length > 0 && (
                    <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredEvents.map((event, index) => (
                            <StaggerItem key={event.eventId} index={index}>
                                <EventCard event={event} />
                            </StaggerItem>
                        ))}
                    </Stagger>
                )}
            </PageContainer>
        </PageShell>
    );
};

export default EventsPage;
