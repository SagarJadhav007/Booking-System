import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
    id: number;
    message: string;
    tone: ToastTone;
}

interface ToastContextValue {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        info: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback((message: string, tone: ToastTone) => {
        setToasts((current) => {
            // Deduplicate: avoid pushing identical toasts simultaneously
            if (current.some((toast) => toast.message === message)) {
                return current;
            }
            const id = Date.now() + Math.random();
            window.setTimeout(() => {
                setToasts((c) => c.filter((toast) => toast.id !== id));
            }, 3600);
            return [...current, { id, message, tone }];
        });
    }, []);

    const value = useMemo<ToastContextValue>(
        () => ({
            toast: {
                success: (message) => push(message, "success"),
                error: (message) => push(message, "error"),
                info: (message) => push(message, "info"),
            },
        }),
        [push]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2.5">
                {toasts.map((item) => (
                    <div
                        key={item.id}
                        className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 text-xs font-medium shadow-[0_16px_40px_rgb(0_0_0_/0.5)] backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in-0 ${
                            item.tone === "error"
                                ? "border-rose-500/30 bg-[#161318]/95 text-rose-300"
                                : item.tone === "success"
                                  ? "border-emerald-500/30 bg-[#121815]/95 text-emerald-300"
                                  : "border-white/10 bg-[#12151b]/95 text-foreground"
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {item.tone === "success" && (
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                            )}
                            {item.tone === "error" && (
                                <AlertCircle className="size-4 shrink-0 text-rose-400" />
                            )}
                            {item.tone === "info" && (
                                <Info className="size-4 shrink-0 text-primary" />
                            )}
                            <span>{item.message}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(item.id)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("ToastProvider missing");
    }
    return context.toast;
}
