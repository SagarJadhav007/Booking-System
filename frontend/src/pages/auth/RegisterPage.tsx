import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { register } from "../../api/authApi";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const RegisterPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            alert(
                "Passwords do not match"
            );

            return;
        }

        try {

            setLoading(true);

            await register({
                username,
                email,
                password
            });

            navigate(
                "/login"
            );

        } catch {

            alert(
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen grid lg:grid-cols-2">

            <div className="hidden lg:flex flex-col justify-center bg-slate-950 text-white p-16">

                <h1 className="text-5xl font-bold mb-6">
                    Spark Events
                </h1>

                <p className="text-xl text-slate-300 mb-8">
                    Create your account and start booking events.
                </p>

                <div className="space-y-4 text-slate-300">

                    <p>
                        ✓ Secure booking experience
                    </p>

                    <p>
                        ✓ Real-time seat availability
                    </p>

                    <p>
                        ✓ Instant booking confirmations
                    </p>

                    <p>
                        ✓ Cloud-native AWS platform
                    </p>

                </div>

            </div>

            <div className="flex items-center justify-center p-8">

                <Card className="w-full max-w-md">

                    <CardContent className="p-8">

                        <div className="mb-8">

                            <h2 className="text-3xl font-bold">
                                Create Account
                            </h2>

                            <p className="text-muted-foreground mt-2">
                                Join Spark Events today
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>

                                <Label>
                                    Username
                                </Label>

                                <Input
                                    placeholder="john_doe"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div>

                                <Label>
                                    Email
                                </Label>

                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div>

                                <Label>
                                    Password
                                </Label>

                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div>

                                <Label>
                                    Confirm Password
                                </Label>

                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {
                                    loading
                                        ? "Creating Account..."
                                        : "Register"
                                }
                            </Button>

                        </form>

                        <p className="text-center mt-6 text-sm">

                            Already have an account?

                            <Link
                                to="/login"
                                className="ml-1 font-medium underline"
                            >
                                Login
                            </Link>

                        </p>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
};

export default RegisterPage;