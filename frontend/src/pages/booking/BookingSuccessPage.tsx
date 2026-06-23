import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BookingSuccessPage = () => {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">

            <Card className="max-w-xl w-full">

                <CardContent className="p-10 text-center">

                    <div className="text-7xl mb-6">
                        🎉
                    </div>

                    <h1 className="text-4xl font-bold mb-4">
                        Booking Confirmed
                    </h1>

                    <p className="text-muted-foreground mb-8">
                        Your booking has been successfully confirmed.
                        A confirmation email has been sent.
                    </p>

                    <div className="grid gap-4">

                        <Button
                            onClick={() =>
                                navigate("/bookings")
                            }
                        >
                            View My Bookings
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() =>
                                navigate("/events")
                            }
                        >
                            Browse More Events
                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
};

export default BookingSuccessPage;