import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Event } from "../../types/event";

import { getEvents } from "../../api/eventApi";

import EventCard from "../../components/events/EventCard";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EventsPage = () => {

    const navigate = useNavigate();

    const [events, setEvents] =
        useState<Event[]>([]);

    const [search, setSearch] =
        useState("");

    useEffect(() => {

        loadEvents();

    }, []);

    const loadEvents = async () => {

        try {

            const data =
                await getEvents();

            setEvents(data);

        } catch (error) {

            console.error(error);
        }
    };

    const filteredEvents =
        useMemo(() => {

            return events.filter(
                (event) =>
                    event.eventName
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    event.venue
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );

        }, [events, search]);

    const handleSelect = (
        eventId: string
    ) => {

        navigate(
            `/events/${eventId}/seats`
        );
    };

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto p-8">

                {/* Hero */}

                <div
                    className="
                    rounded-3xl
                    bg-gradient-to-r
                    from-slate-900
                    to-slate-700
                    text-white
                    p-10
                    mb-8
                    "
                >

                    <Badge
                        className="mb-4"
                    >
                        Featured Events
                    </Badge>

                    <h1
                        className="
                        text-5xl
                        font-bold
                        mb-4
                        "
                    >
                        Discover Amazing Events
                    </h1>

                    <p
                        className="
                        text-slate-300
                        text-lg
                        "
                    >
                        Book tickets, reserve seats and enjoy unforgettable experiences.
                    </p>

                </div>

                {/* Search */}

                <div className="mb-8">

                    <Input
                        placeholder="Search events or venues..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

                {/* Header */}

                <div
                    className="
                    flex
                    justify-between
                    items-center
                    mb-6
                    "
                >

                    <h2
                        className="
                        text-2xl
                        font-bold
                        "
                    >
                        Available Events
                    </h2>

                    <Badge variant="secondary">

                        {
                            filteredEvents.length
                        } Events

                    </Badge>

                </div>

                {/* Empty State */}

                {
                    filteredEvents.length === 0 && (

                        <div
                            className="
                            bg-white
                            rounded-xl
                            border
                            p-12
                            text-center
                            "
                        >

                            <h3
                                className="
                                text-xl
                                font-semibold
                                "
                            >
                                No events found
                            </h3>

                            <p
                                className="
                                text-muted-foreground
                                mt-2
                                "
                            >
                                Try searching with a different keyword.
                            </p>

                        </div>

                    )
                }

                {/* Events Grid */}

                <div
                    className="
                    grid
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-8
                    "
                >

                    {
                        filteredEvents.map(
                            (event) => (

                                <EventCard

                                    key={
                                        event.eventId
                                    }

                                    event={
                                        event
                                    }

                                    onSelect={
                                        handleSelect
                                    }

                                />

                            )
                        )
                    }

                </div>

            </div>

        </div>

    );
};

export default EventsPage;