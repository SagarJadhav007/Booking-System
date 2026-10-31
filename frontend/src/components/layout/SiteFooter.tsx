import { Logo } from "@/components/brand/Logo";
import { Link } from "react-router-dom";

export function SiteFooter() {
    return (
        <footer className="border-t border-white/[0.06] bg-[#0b0d10]/50 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2">
                    <Logo />
                    <p className="text-xs text-muted-foreground">
                        Live seating held in real-time. Built for unforgettable event experiences.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                    <Link to="/events" className="transition-colors hover:text-foreground">
                        Explore Events
                    </Link>
                    <Link to="/bookings" className="transition-colors hover:text-foreground">
                        My Bookings
                    </Link>
                    <span className="text-zinc-600">·</span>
                    <span>High-concurrency distributed ticketing</span>
                </div>
            </div>
        </footer>
    );
}
