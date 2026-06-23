import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto p-8">

                {/* Hero Section */}

                <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-10 mb-8">

                    <Badge className="mb-4">
                        AWS Cloud Native
                    </Badge>

                    <h1 className="text-5xl font-bold mb-4">
                        Welcome Back 👋
                    </h1>

                    <p className="text-slate-300 text-lg">
                        Discover events, reserve seats and manage your bookings.
                    </p>

                    <div className="flex gap-4 mt-8">

                        <Button
                            variant="secondary"
                            onClick={() => navigate("/events")}
                        >
                            Browse Events
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate("/bookings")}
                        >
                            My Bookings
                        </Button>

                    </div>

                </div>

                {/* Stats */}

                <div className="grid md:grid-cols-3 gap-6 mb-10">

                    <Card>
                        <CardContent className="p-6">

                            <p className="text-muted-foreground">
                                Available Events
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                25+
                            </h2>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">

                            <p className="text-muted-foreground">
                                My Bookings
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                Active
                            </h2>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">

                            <p className="text-muted-foreground">
                                Platform
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                AWS
                            </h2>

                        </CardContent>
                    </Card>

                </div>

                {/* Quick Actions */}

                <div className="mb-10">

                    <h2 className="text-2xl font-bold mb-6">
                        Quick Actions
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <Card className="hover:shadow-lg transition cursor-pointer">

                            <CardContent
                                className="p-6"
                                onClick={() => navigate("/events")}
                            >

                                <h3 className="font-semibold text-lg">
                                    Browse Events
                                </h3>

                                <p className="text-muted-foreground mt-2">
                                    Discover upcoming experiences.
                                </p>

                            </CardContent>

                        </Card>

                        <Card className="hover:shadow-lg transition cursor-pointer">

                            <CardContent
                                className="p-6"
                                onClick={() => navigate("/bookings")}
                            >

                                <h3 className="font-semibold text-lg">
                                    My Bookings
                                </h3>

                                <p className="text-muted-foreground mt-2">
                                    View booking history.
                                </p>

                            </CardContent>

                        </Card>

                        <Card className="hover:shadow-lg transition cursor-pointer">

                            <CardContent
                                className="p-6"
                                onClick={() => navigate("/admin")}
                            >

                                <h3 className="font-semibold text-lg">
                                    Admin Dashboard
                                </h3>

                                <p className="text-muted-foreground mt-2">
                                    Manage platform operations.
                                </p>

                            </CardContent>

                        </Card>

                        <Card>

                            <CardContent className="p-6">

                                <h3 className="font-semibold text-lg">
                                    Profile
                                </h3>

                                <p className="text-muted-foreground mt-2">
                                    Coming soon.
                                </p>

                            </CardContent>

                        </Card>

                    </div>

                </div>

                {/* Platform Features */}

                <div>

                    <h2 className="text-2xl font-bold mb-6">
                        Platform Features
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-6">

                        <Card>
                            <CardContent className="p-6">

                                <h3 className="font-semibold">
                                    Real-time Seat Selection
                                </h3>

                                <p className="text-muted-foreground mt-3">
                                    Reserve seats instantly with live availability.
                                </p>

                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">

                                <h3 className="font-semibold">
                                    Email Notifications
                                </h3>

                                <p className="text-muted-foreground mt-3">
                                    Booking confirmations sent automatically via SES.
                                </p>

                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">

                                <h3 className="font-semibold">
                                    Cloud Native Architecture
                                </h3>

                                <p className="text-muted-foreground mt-3">
                                    ECS, RDS, Redis, SQS, SES and CloudFront powered.
                                </p>

                            </CardContent>
                        </Card>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default DashboardPage;