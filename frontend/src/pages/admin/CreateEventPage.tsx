import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import {
    Input
} from "@/components/ui/input";

import {
    Label
} from "@/components/ui/label";

import {
    Button
} from "@/components/ui/button";

const CreateEventPage = () => {

    const navigate =
        useNavigate();

    const [eventName, setEventName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [venue, setVenue] =
        useState("");

    const [eventDate, setEventDate] =
        useState("");

    const [rows, setRows] =
        useState(5);

    const [seatsPerRow, setSeatsPerRow] =
        useState(10);

    const [loading, setLoading] =
        useState(false);

    const handleCreate =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();

            try {

                setLoading(true);

                await api.post(
                    "/events",
                    {
                        eventName,
                        description,
                        venue,

                        eventDate:
                            new Date(
                                eventDate
                            ).toISOString(),

                        rows,
                        seatsPerRow
                    }
                );

                console.log({
                    eventName,
                    description,
                    venue,
                    eventDate:
                        new Date(
                            eventDate
                        ).toISOString(),
                    rows,
                    seatsPerRow
                });

                alert(
                    "Event Created Successfully"
                );

                navigate(
                    "/events"
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to create event"
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div className="min-h-screen bg-slate-50 p-8">

            <div className="max-w-2xl mx-auto">

                <Card>

                    <CardContent className="p-8">

                        <h1 className="text-3xl font-bold mb-6">
                            Create Event
                        </h1>

                        <form
                            onSubmit={handleCreate}
                            className="space-y-5"
                        >

                            <div>

                                <Label>
                                    Event Name
                                </Label>

                                <Input
                                    value={eventName}
                                    onChange={(e) =>
                                        setEventName(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div>

                                <Label>
                                    Description
                                </Label>

                                <Input
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div>

                                <Label>
                                    Venue
                                </Label>

                                <Input
                                    value={venue}
                                    onChange={(e) =>
                                        setVenue(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div>

                                <Label>
                                    Event Date
                                </Label>

                                <Input
                                    type="datetime-local"
                                    value={eventDate}
                                    onChange={(e) =>
                                        setEventDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>

                                    <Label>
                                        Rows
                                    </Label>

                                    <Input
                                        type="number"
                                        value={rows}
                                        onChange={(e) =>
                                            setRows(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                </div>

                                <div>

                                    <Label>
                                        Seats Per Row
                                    </Label>

                                    <Input
                                        type="number"
                                        value={seatsPerRow}
                                        onChange={(e) =>
                                            setSeatsPerRow(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            <Button
                                className="w-full"
                                disabled={loading}
                            >
                                {
                                    loading
                                        ? "Creating..."
                                        : "Create Event"
                                }
                            </Button>

                        </form>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
};

export default CreateEventPage;