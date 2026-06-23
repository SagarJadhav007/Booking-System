import { useEffect, useState } from "react";

import type { Booking }
    from "../../types/booking";

import { getMyBookings , getAllBookings }
    from "../../api/bookingApi";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

const BookingsPage = () => {

    const [bookings, setBookings] =
        useState<Booking[]>([]);

    const role =
        localStorage.getItem(
            "role"
        );

    useEffect(() => {

        loadBookings();

    }, []);

    const loadBookings =
        async () => {

            try {

                const data =

                    role === "ADMIN"

                        ? await getAllBookings()

                        : await getMyBookings();

                setBookings(
                    data
                );

            } catch (error) {

                console.error(
                    error
                );
            }
        };

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto p-8">

                <div className="mb-8">

                    <h1 className="text-4xl font-bold">

                        {

                            role === "ADMIN"

                                ? "All Bookings"

                                : "My Bookings"

                        }

                    </h1>

                    <p className="text-muted-foreground mt-2">

                        {

                            role === "ADMIN"

                                ? "View all bookings across the platform."

                                : "View all your confirmed bookings."

                        }

                    </p>

                </div>

                <Card>

                    <CardContent className="p-6">

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        Booking ID
                                    </TableHead>

                                    <TableHead>
                                        Seat
                                    </TableHead>

                                    <TableHead>
                                        Amount
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <TableHead>
                                        Date
                                    </TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>

                                {bookings.map(
                                    booking => (

                                        <TableRow
                                            key={
                                                booking.bookingId
                                            }
                                        >

                                            <TableCell>
                                                {
                                                    booking.bookingId.slice(
                                                        0,
                                                        8
                                                    )
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    booking.seatId
                                                }
                                            </TableCell>

                                            <TableCell>
                                                ₹
                                                {
                                                    booking.amount
                                                }
                                            </TableCell>

                                            <TableCell>

                                                <Badge
                                                    variant="default"
                                                >
                                                    Confirmed
                                                </Badge>

                                            </TableCell>

                                            <TableCell>

                                                {
                                                    new Date(
                                                        booking.bookedAt
                                                    )
                                                        .toLocaleString()
                                                }

                                            </TableCell>

                                        </TableRow>

                                    )
                                )}

                            </TableBody>

                        </Table>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
};

export default BookingsPage;