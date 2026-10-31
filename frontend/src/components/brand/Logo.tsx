import { cn } from "@/lib/utils";

export function Logo({
    className,
    compact = false,
}: {
    className?: string;
    compact?: boolean;
}) {
    return (
        <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
            <span className="relative flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-[#6c5ce7] to-[#5b4be0] text-primary-foreground shadow-[0_2px_12px_rgb(124_108_255_/_0.35)] ring-1 ring-white/20 transition-transform group-hover:scale-105">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
            </span>
            {!compact && (
                <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-base font-semibold tracking-tight text-foreground">
                        Spark
                    </span>
                    <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                        Events
                    </span>
                </div>
            )}
        </span>
    );
}
