import { useState } from "react";
import { cn } from "@/lib/utils";
import { getEventCover, FALLBACK_COVER } from "@/lib/eventCover";

export function EventCover({
    eventId,
    eventName,
    className,
    overlay = true,
}: {
    eventId: string;
    eventName: string;
    className?: string;
    overlay?: boolean;
}) {
    const [imgSrc, setImgSrc] = useState(() => getEventCover(eventId));
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={cn("relative overflow-hidden bg-[#12151B]", className)}>
            <img
                src={imgSrc}
                alt={eventName}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => {
                    if (imgSrc !== FALLBACK_COVER) {
                        setImgSrc(FALLBACK_COVER);
                    }
                }}
                className={cn(
                    "h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.045]",
                    loaded ? "opacity-100" : "opacity-0"
                )}
            />
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-[#171b24]" />
            )}
            {overlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-black/30 to-transparent" />
            )}
        </div>
    );
}
