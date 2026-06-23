import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {

    const navigate = useNavigate();

    const {
        login: saveToken
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response =
                await login({
                    email,
                    password
                });

            saveToken(
                response.token,
                response.role
            );

            if (
                response.role === "ADMIN"
            ) {

                navigate(
                    "/admin"
                );

            } else {

                navigate(
                    "/dashboard"
                );
            }

        } catch {

            alert(
                "Invalid credentials"
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
                    Book. Experience. Enjoy.
                </p>

                <div className="space-y-4 text-slate-300">

                    <p>
                        ✓ Real-time seat booking
                    </p>

                    <p>
                        ✓ Instant confirmations
                    </p>

                    <p>
                        ✓ Email notifications
                    </p>

                    <p>
                        ✓ AWS powered infrastructure
                    </p>

                </div>

            </div>

            <div className="flex items-center justify-center p-8">

                <Card className="w-full max-w-md">

                    <CardContent className="p-8">

                        <div className="mb-8">

                            <h2 className="text-3xl font-bold">
                                Welcome Back
                            </h2>

                            <p className="text-muted-foreground mt-2">
                                Login to continue
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

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

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {
                                    loading
                                        ? "Signing In..."
                                        : "Login"
                                }
                            </Button>

                        </form>

                        <p className="text-center mt-6 text-sm">

                            Don't have an account?

                            <Link
                                to="/register"
                                className="ml-1 font-medium underline"
                            >
                                Register
                            </Link>

                        </p>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
};

export default LoginPage;