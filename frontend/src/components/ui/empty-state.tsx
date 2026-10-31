import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-[#12151b] px-6 py-16 text-center shadow-lg",
                className
            )}
        >
            {Icon && (
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground shadow-inner">
                    <Icon className="size-6 text-accent-foreground" />
                </div>
            )}
            <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
            {description && (
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
