import { cn } from "@/lib/utils";

const STEPS = ["Select seat", "Payment", "Confirmed"] as const;

export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
    return (
        <ol className="mb-8 flex items-center gap-2 text-xs text-muted-foreground sm:gap-3">
            {STEPS.map((step, index) => {
                const number = index + 1;
                const active = number === current;
                const done = number < current;

                return (
                    <li key={step} className="flex items-center gap-2 sm:gap-3">
                        <span
                            className={cn(
                                "flex size-5 items-center justify-center rounded-full text-[10px] font-medium",
                                active && "bg-primary text-primary-foreground",
                                done && "bg-primary/20 text-accent-foreground",
                                !active && !done && "bg-muted text-muted-foreground"
                            )}
                        >
                            {number}
                        </span>
                        <span className={cn(active && "text-foreground")}>{step}</span>
                        {index < STEPS.length - 1 && (
                            <span className="hidden h-px w-8 bg-border sm:block" />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
