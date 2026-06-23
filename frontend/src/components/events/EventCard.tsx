import type { Event } from "../../types/event";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {

    event: Event;

    onSelect: (
        eventId: string
    ) => void;
}

const EventCard = ({
                       event,
                       onSelect
                   }: Props) => {

    return (

        <Card
            className="
            overflow-hidden
            hover:shadow-xl
            transition-all
            duration-300
            hover:-translate-y-1
            "
        >

            <div
                className="
                h-48
                bg-gradient-to-r
                from-slate-900
                to-slate-700
                flex
                items-center
                justify-center
                text-white
                text-2xl
                font-bold
                "
            >
                🎉 Event
            </div>

            <CardContent className="p-6">

                <div
                    className="
                    flex
                    items-start
                    justify-between
                    mb-4
                    "
                >

                    <h2
                        className="
                        text-xl
                        font-bold
                        "
                    >
                        {event.eventName}
                    </h2>

                    <Badge>
                        Live
                    </Badge>

                </div>

                <p
                    className="
                    text-muted-foreground
                    text-sm
                    line-clamp-3
                    mb-4
                    "
                >
                    {event.description}
                </p>

                <div
                    className="
                    space-y-2
                    text-sm
                    mb-6
                    "
                >

                    <p>
                        📍 {event.venue}
                    </p>

                    <p>
                        🎟 {event.totalSeats} seats available
                    </p>

                </div>

                <Button
                    className="w-full"
                    onClick={() =>
                        onSelect(
                            event.eventId
                        )
                    }
                >
                    Book Tickets
                </Button>

            </CardContent>

        </Card>

    );
};

export default EventCard;