import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FadeIn({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <div
            className={cn("animate-in fade-in-0 slide-in-from-bottom-3 duration-500 fill-mode-both", className)}
            style={{ animationDelay: `${delay}ms` } as CSSProperties}
        >
            {children}
        </div>
    );
}

export function Stagger({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function StaggerItem({
    children,
    className,
    index = 0,
}: {
    children: ReactNode;
    className?: string;
    index?: number;
}) {
    return (
        <div
            className={cn("animate-in fade-in-0 slide-in-from-bottom-3 duration-500 fill-mode-both", className)}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {children}
        </div>
    );
}
