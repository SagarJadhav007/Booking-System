import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";

import { register } from "../../api/authApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useToast } from "@/components/ui/toast";

const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!username.trim() || !email.trim() || !password) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await register({
                username: username.trim(),
                email: email.trim(),
                password,
            });
            toast.success("Account created successfully. Please sign in.");
            navigate("/login");
        } catch {
            setError("Registration failed. Email may already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            panelTitle="Create an account. Keep the seat."
            panelCopy="Join Spark to explore live events, lock in seats in real time, and manage tickets seamlessly."
        >
            <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Create an account
                </h2>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    Enter your details below to get started with instant ticketing.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-xs font-medium text-foreground">
                        Full Name / Username
                    </Label>
                    <div className="relative">
                        <User className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="username"
                            autoComplete="name"
                            placeholder="Alex Morgan"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-10 border-white/10 bg-[#12151b] pl-9 text-xs focus-visible:border-primary"
                        />
                    </div>
                </div>

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
                    <Label htmlFor="password" className="text-xs font-medium text-foreground">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
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

                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-10 border-white/10 bg-[#12151b] pl-9 text-xs focus-visible:border-primary"
                        />
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
                    {loading ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="size-3.5" />
                </Button>
            </form>

            <div className="mt-8 border-t border-white/[0.06] pt-6 text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                    Sign in instead
                </Link>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
