import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login: saveToken } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Support redirect back to intended page if protected route directed here
    const redirectTarget =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
        new URLSearchParams(location.search).get("redirect");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setLoading(true);
            const response = await login({ email: email.trim(), password });
            saveToken(response.token, response.role);

            if (redirectTarget) {
                navigate(redirectTarget, { replace: true });
            } else {
                navigate(response.role === "ADMIN" ? "/admin" : "/events", {
                    replace: true,
                });
            }
        } catch {
            setError("Invalid credentials. Please verify your email and password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            panelTitle="Book the night. Keep the seat."
            panelCopy="Real-time seat holds, distributed reservation locks, and a distraction-free checkout experience built for world-class live events."
        >
            <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Welcome back
                </h2>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    Enter your credentials to access your tickets and reservations.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-foreground">
                        Email Address
                    </Label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-10 border-white/10 bg-[#12151b] pl-9 text-xs focus-visible:border-primary"
                            aria-invalid={Boolean(error)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-medium text-foreground">
                            Password
                        </Label>
                    </div>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 border-white/10 bg-[#12151b] pr-10 pl-9 text-xs focus-visible:border-primary"
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="size-3.5" />
                            ) : (
                                <Eye className="size-3.5" />
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    className="mt-2 h-11 w-full gap-2 text-xs font-semibold shadow-[0_4px_20px_rgb(124_108_255_/_0.35)]"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign In to Account"}
                    <ArrowRight className="size-3.5" />
                </Button>
            </form>

            <div className="mt-8 border-t border-white/[0.06] pt-6 text-center text-xs text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                    Create an account
                </Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
