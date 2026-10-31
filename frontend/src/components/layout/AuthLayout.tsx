import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/brand/Logo";
import { FadeIn } from "@/components/motion/FadeIn";
import { Sparkles, ShieldCheck, Ticket } from "lucide-react";

const AUTH_PANEL =
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80";

export function AuthLayout({
    panelTitle,
    panelCopy,
    children,
}: {
    panelTitle: string;
    panelCopy: string;
    children: ReactNode;
}) {
    return (
        <div className="grid min-h-screen bg-[#0b0d10] lg:grid-cols-2">
            {/* Left Atmospheric Image Panel */}
            <div className="relative hidden overflow-hidden lg:block">
                <img
                    src={AUTH_PANEL}
                    alt="Concert Arena Lighting"
                    className="absolute inset-0 h-full w-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-[#0b0d10]/75 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/40 to-black/30" />

                <FadeIn className="relative flex h-full flex-col justify-between p-12 xl:p-16">
                    <Link to="/events" className="w-fit">
                        <Logo />
                    </Link>

                    <div className="max-w-md">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-accent-foreground backdrop-blur-md">
                            <Sparkles className="size-3 text-primary" />
                            <span>Premium Live Access</span>
                        </div>
                        <h1 className="font-heading text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl">
                            {panelTitle}
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                            {panelCopy}
                        </p>

                        <div className="mt-8 flex items-center gap-6 text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="size-4 text-emerald-400" />
                                Instant Seat Holds
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Ticket className="size-4 text-primary" />
                                Verified Passes
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-zinc-500">
                        Spark Events · High-concurrency live ticketing system
                    </p>
                </FadeIn>
            </div>

            {/* Right Interactive Form Area */}
            <div className="flex items-center justify-center px-6 py-12 sm:px-10">
                <FadeIn delay={60} className="w-full max-w-[24rem]">
                    <div className="mb-8 flex justify-center lg:hidden">
                        <Link to="/events">
                            <Logo />
                        </Link>
                    </div>
                    {children}
                </FadeIn>
            </div>
        </div>
    );
}
