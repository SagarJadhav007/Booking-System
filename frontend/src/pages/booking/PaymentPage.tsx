import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    startPayment,
    confirmPayment
} from "../../api/paymentApi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PaymentPage = () => {

    const navigate = useNavigate();

    const seatId =
        localStorage.getItem(
            "selectedSeat"
        );

    const [loading, setLoading] =
        useState(false);

    const handlePayment =
        async () => {

            if (!seatId) {

                alert(
                    "No seat selected"
                );

                return;
            }

            try {

                setLoading(true);

                await startPayment(
                    seatId
                );

                await confirmPayment(
                    seatId
                );

                localStorage.removeItem(
                    "selectedSeat"
                );

                navigate("/booking-success");

            } catch (error) {

                console.error(error);

                alert(
                    "Payment failed"
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-6xl mx-auto p-8">

                <div
                    className="
                    bg-gradient-to-r
                    from-slate-900
                    to-slate-700
                    text-white
                    rounded-3xl
                    p-8
                    mb-8
                    "
                >

                    <Badge className="mb-4">
                        Secure Checkout
                    </Badge>

                    <h1 className="text-4xl font-bold">
                        Complete Your Booking
                    </h1>

                    <p className="text-slate-300 mt-2">
                        Confirm your seat and finalize your reservation.
                    </p>

                </div>

                <div
                    className="
                    grid
                    lg:grid-cols-3
                    gap-8
                    "
                >

                    {/* Left */}

                    <div className="lg:col-span-2">

                        <Card>

                            <CardContent className="p-8">

                                <h2
                                    className="
                                    text-2xl
                                    font-bold
                                    mb-6
                                    "
                                >
                                    Booking Summary
                                </h2>

                                <div className="space-y-6">

                                    <div>

                                        <p className="text-muted-foreground">
                                            Event
                                        </p>

                                        <p className="font-semibold">
                                            Spark Event
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-muted-foreground">
                                            Seat Number
                                        </p>

                                        <p className="font-semibold">
                                            {seatId}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-muted-foreground">
                                            Payment Method
                                        </p>

                                        <p className="font-semibold">
                                            Demo Payment Gateway
                                        </p>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                    {/* Right */}

                    <div>

                        <Card>

                            <CardContent className="p-8">

                                <h2
                                    className="
                                    text-xl
                                    font-bold
                                    mb-6
                                    "
                                >
                                    Price Details
                                </h2>

                                <div className="space-y-4">

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        "
                                    >
                                        <span>
                                            Ticket Price
                                        </span>

                                        <span>
                                            ₹500
                                        </span>
                                    </div>

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        "
                                    >
                                        <span>
                                            Convenience Fee
                                        </span>

                                        <span>
                                            ₹0
                                        </span>
                                    </div>

                                    <hr />

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        text-lg
                                        font-bold
                                        "
                                    >
                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            ₹500
                                        </span>
                                    </div>

                                </div>

                                <Button
                                    className="
                                    w-full
                                    mt-8
                                    "
                                    onClick={
                                        handlePayment
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    {

                                        loading

                                            ? "Processing Payment..."

                                            : "Confirm Booking"

                                    }

                                </Button>

                            </CardContent>

                        </Card>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default PaymentPage;