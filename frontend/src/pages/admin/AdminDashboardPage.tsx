import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStats } from "../../api/adminApi";

import type {
    AdminStats
} from "../../types/admin";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import {
    Button
} from "@/components/ui/button";

const AdminDashboardPage = () => {

    const navigate =
        useNavigate();

    const [stats, setStats] =
        useState<AdminStats | null>(
            null
        );

    useEffect(() => {

        loadStats();

    }, []);

    const loadStats =
        async () => {

            try {

                const data =
                    await getStats();

                setStats(data);

            } catch (error) {

                console.error(error);
            }
        };

    if (!stats) {

        return (

            <div className="p-10">

                Loading...

            </div>

        );
    }

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto p-8">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="text-muted-foreground mt-2">
                        Monitor platform performance and manage events.
                    </p>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">
                                Users
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                {stats.totalUsers}
                            </h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">
                                Events
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                {stats.totalEvents}
                            </h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">
                                Bookings
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                {stats.totalBookings}
                            </h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">
                                Revenue
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                                ₹{stats.revenue}
                            </h2>
                        </CardContent>
                    </Card>

                </div>

                <h2 className="text-2xl font-bold mb-6">
                    Quick Actions
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <Card>

                        <CardContent className="p-6">

                            <h3 className="font-semibold text-lg">
                                Create Event
                            </h3>

                            <p className="text-muted-foreground mt-2 mb-4">
                                Create a new event and automatically generate seats.
                            </p>

                            <Button
                                className="w-full"
                                onClick={() =>
                                    navigate(
                                        "/admin/create-event"
                                    )
                                }
                            >
                                Create Event
                            </Button>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="p-6">

                            <h3 className="font-semibold text-lg">
                                View Events
                            </h3>

                            <p className="text-muted-foreground mt-2 mb-4">
                                View all events currently available on the platform.
                            </p>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    navigate(
                                        "/events"
                                    )
                                }
                            >
                                Open Events
                            </Button>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboardPage;