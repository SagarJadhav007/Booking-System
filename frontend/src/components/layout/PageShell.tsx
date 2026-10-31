import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("min-h-[calc(100vh-3.5rem)]", className)}>
            {children}
        </div>
    );
}

export function PageContainer({
    children,
    className,
    wide = false,
}: {
    children: ReactNode;
    className?: string;
    wide?: boolean;
}) {
    return (
        <div
            className={cn(
                "mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-10",
                wide ? "max-w-7xl" : "max-w-6xl",
                className
            )}
        >
            {children}
        </div>
    );
}

export function PageHeader({
    eyebrow,
    title,
    description,
    actions,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
                {eyebrow && (
                    <p className="mb-2 text-xs font-medium tracking-[0.18em] text-accent-foreground uppercase">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {actions}
        </div>
    );
}
