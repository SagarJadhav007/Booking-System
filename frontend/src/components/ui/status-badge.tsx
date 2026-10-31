import { cn } from "@/lib/utils";

export function StatusBadge({
    tone = "neutral",
    children,
    className,
}: {
    tone?: "success" | "warning" | "danger" | "neutral" | "primary";
    children: React.ReactNode;
    className?: string;
}) {
    const toneStyles = {
        success:
            "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        warning:
            "border-amber-500/25 bg-amber-500/10 text-amber-400",
        danger:
            "border-rose-500/25 bg-rose-500/10 text-rose-400",
        neutral:
            "border-white/10 bg-white/5 text-muted-foreground",
        primary:
            "border-primary/30 bg-primary/10 text-accent-foreground",
    };

    const dotStyles = {
        success: "bg-emerald-400",
        warning: "bg-amber-400",
        danger: "bg-rose-400",
        neutral: "bg-zinc-400",
        primary: "bg-primary",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-sm",
                toneStyles[tone],
                className
            )}
        >
            <span className={cn("size-1.5 rounded-full", dotStyles[tone])} />
            <span>{children}</span>
        </span>
    );
}
