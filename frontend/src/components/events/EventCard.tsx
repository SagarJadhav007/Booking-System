import { Calendar, MapPin, Ticket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Event } from "../../types/event";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EventCover } from "@/components/events/EventCover";
import { formatEventDate } from "@/lib/format";

interface Props {
    event: Event;
}

const EventCard = ({ event }: Props) => {
    const navigate = useNavigate();

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#12151b] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:shadow-[0_20px_40px_rgb(0_0_0_/0.45)]">
            {/* Cover image container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                <EventCover
                    eventId={event.eventId}
                    eventName={event.eventName}
                    className="h-full w-full"
                />

                {/* Status indicator on top of image */}
                <div className="absolute top-3.5 right-3.5 z-10">
                    <StatusBadge tone={event.active ? "success" : "neutral"}>
                        {event.active ? "Booking Open" : "Closed"}
                    </StatusBadge>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-white">
                        {event.eventName}
                    </h3>

                    {event.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {event.description}
                        </p>
                    )}

                    <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-3.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-3.5 shrink-0 text-accent-foreground" />
                            <span>{formatEventDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-3.5 shrink-0 text-accent-foreground" />
                            <span className="truncate">{event.venue}</span>
                        </div>
                        {event.totalSeats != null && (
                            <div className="flex items-center gap-2">
                                <Ticket className="size-3.5 shrink-0 text-accent-foreground" />
                                <span>{event.totalSeats} seats total</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/events/${event.eventId}`)}
                        className="h-9 border-white/[0.08] bg-transparent text-xs hover:bg-white/[0.04]"
                    >
                        View Details
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => navigate(`/events/${event.eventId}/seats`)}
                        disabled={event.active === false}
                        className="h-9 gap-1.5 text-xs shadow-[0_2px_12px_rgb(124_108_255_/_0.3)] disabled:shadow-none"
                    >
                        Book Now
                        <ArrowRight className="size-3.5" />
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default EventCard;
