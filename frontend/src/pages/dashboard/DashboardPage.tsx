import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Calendar,
    Compass,
    Sparkles,
    Ticket,
    User,
} from "lucide-react";

import { getEvents } from "../../api/eventApi";
import { getMyBookings } from "../../api/bookingApi";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
    const navigate = useNavigate();
    const { role, email } = useAuth();
    const [eventCount, setEventCount] = useState<number | null>(null);
    const [bookingCount, setBookingCount] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [events, bookings] = await Promise.all([
                    getEvents().catch(() => []),
                    getMyBookings().catch(() => []),
                ]);
                setEventCount(events.length);
                setBookingCount(bookings.length);
            } catch (error) {
                console.error("Dashboard metric error", error);
                setEventCount(0);
                setBookingCount(0);
            }
        };

        load();
    }, []);

    return (
        <PageShell>
            <PageContainer className="pb-20">
                <FadeIn>
                    <PageHeader
                        eyebrow="Account Dashboard"
                        title={email ? `Welcome back, ${email.split("@")[0]}` : "Your Booking Center"}
                        description="View your active reservations, explore upcoming events, and access your event tickets."
                        actions={
                            <Button
                                onClick={() => navigate("/events")}
                                className="h-10 gap-2 text-xs font-semibold shadow-[0_2px_15px_rgb(124_108_255_/_0.3)]"
                            >
                                <Compass className="size-4" />
                                Browse Events
                            </Button>
                        }
                    />
                </FadeIn>

                {/* 3 Overview Stat Cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Live Events
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Calendar className="size-4" />
                            </div>
                        </div>
                        {eventCount == null ? (
                            <Skeleton className="mt-3 h-8 w-16" />
                        ) : (
                            <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-white">
                                {eventCount}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                            Open for reservations
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                My Bookings
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Ticket className="size-4" />
                            </div>
                        </div>
                        {bookingCount == null ? (
                            <Skeleton className="mt-3 h-8 w-16" />
                        ) : (
                            <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-white">
                                {bookingCount}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                            Confirmed digital passes
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Account Role
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-accent-foreground">
                                <User className="size-4" />
                            </div>
                        </div>
                        <p className="mt-3 font-heading text-xl font-bold tracking-tight text-white capitalize">
                            {role?.toLowerCase() ?? "Member"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Verified session active
                        </p>
                    </div>
                </div>

                {/* Quick Action Navigation Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div
                        className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:border-white/16 hover:shadow-2xl"
                        onClick={() => navigate("/events")}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Sparkles className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-base font-semibold text-white group-hover:text-primary transition-colors">
                                        Explore Live Events
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Discover performances, concerts, and book seats in real time.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                    </div>

                    <div
                        className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#12151b] p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:border-white/16 hover:shadow-2xl"
                        onClick={() => navigate("/bookings")}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Ticket className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                        View My Bookings
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Access your confirmed passes and seat assignments.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                    </div>
                </div>
            </PageContainer>
        </PageShell>
    );
};

export default DashboardPage;
