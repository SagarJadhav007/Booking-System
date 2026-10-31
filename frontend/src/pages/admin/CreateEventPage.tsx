import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Plus,
    Sparkles,
    Ticket,
} from "lucide-react";

import api from "../../api/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer, PageHeader, PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { useToast } from "@/components/ui/toast";

const CreateEventPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [venue, setVenue] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [rows, setRows] = useState(5);
    const [seatsPerRow, setSeatsPerRow] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalSeats = rows * seatsPerRow;

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!eventName.trim() || !venue.trim() || !eventDate) {
            setError("Event name, venue, and date/time are required.");
            return;
        }

        if (rows < 1 || seatsPerRow < 1) {
            setError("Rows and seats per row must each be at least 1.");
            return;
        }

        try {
            setLoading(true);
            await api.post("/events", {
                eventName: eventName.trim(),
                description: description.trim(),
                venue: venue.trim(),
                eventDate: new Date(eventDate).toISOString(),
                rows: Number(rows),
                seatsPerRow: Number(seatsPerRow),
            });
            toast.success("Event created successfully with full seating configuration");
            navigate("/admin");
        } catch (createError) {
            console.error(createError);
            setError("Failed to create event. Please ensure the backend is running.");
            toast.error("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell>
            <PageContainer className="max-w-3xl pb-20">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => navigate("/admin")}
                >
                    <ArrowLeft className="mr-1.5 size-3.5" />
                    Back to Admin Dashboard
                </Button>

                <FadeIn>
                    <PageHeader
                        eyebrow="Event Management"
                        title="Create New Event"
                        description="Publish a live event and automatically generate the tiered seating layout."
                    />
                </FadeIn>

                <div className="rounded-2xl border border-white/10 bg-[#12151b] p-6 sm:p-10 shadow-2xl">
                    <form onSubmit={handleCreate} className="space-y-8">
                        {/* Section 1: Event Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                                <Sparkles className="size-4 text-primary" />
                                <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
                                    General Information
                                </h2>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="eventName" className="text-xs font-medium text-foreground">
                                    Event Name *
                                </Label>
                                <Input
                                    id="eventName"
                                    placeholder="e.g. Symphony of the Cosmos 2026"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    className="h-10 border-white/10 bg-[#0b0d10] text-xs focus-visible:border-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-medium text-foreground">
                                    Event Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide event details, performer info, schedule, and guidelines for attendees..."
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="border-white/10 bg-[#0b0d10] text-xs focus-visible:border-primary"
                                />
                            </div>
                        </div>

                        {/* Section 2: Venue & Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                                <MapPin className="size-4 text-primary" />
                                <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
                                    Schedule & Location
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="venue" className="text-xs font-medium text-foreground">
                                        Venue Name *
                                    </Label>
                                    <Input
                                        id="venue"
                                        placeholder="e.g. Royal Grand Theatre, Mumbai"
                                        value={venue}
                                        onChange={(e) => setVenue(e.target.value)}
                                        className="h-10 border-white/10 bg-[#0b0d10] text-xs focus-visible:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="eventDate" className="text-xs font-medium text-foreground">
                                        Date & Time *
                                    </Label>
                                    <Input
                                        id="eventDate"
                                        type="datetime-local"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="h-10 border-white/10 bg-[#0b0d10] text-xs focus-visible:border-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Seating Configuration */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                                <Ticket className="size-4 text-primary" />
                                <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
                                    Seating Layout Configuration
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="rows" className="text-xs font-medium text-foreground">
                                        Number of Rows
                                    </Label>
                                    <Input
                                        id="rows"
                                        type="number"
                                        min={1}
                                        max={26}
                                        value={rows}
                                        onChange={(e) => setRows(Number(e.target.value))}
                                        className="h-10 border-white/10 bg-[#0b0d10] text-xs focus-visible:border-primary"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Rows will be labeled alphabetically (A, B, C...).
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="seatsPerRow" className="text-xs font-medium text-foreground">
                                        Seats Per Row
                                    </Label>
                                    <Input
                                        id="seatsPerRow"
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={seatsPerRow}
                                        onChange={(e) => setSeatsPerRow(Number(e.target.value))}
                                        className="h-10 border-white/10 bg-[#0b0d10] text-xs focus-visible:border-primary"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Seats will be numbered sequentially (1, 2, 3...).
                                    </p>
                                </div>
                            </div>

                            {/* Live Seat Calculation Preview */}
                            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0b0d10] p-4 text-xs">
                                <span className="text-muted-foreground">
                                    Calculated Total Seating Capacity:
                                </span>
                                <span className="font-mono text-sm font-bold text-primary">
                                    {totalSeats} Seats ({rows} rows × {seatsPerRow} seats)
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin")}
                                className="h-10 text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                className="h-10 gap-2 text-xs font-semibold shadow-[0_2px_15px_rgb(124_108_255_/_0.35)]"
                                disabled={loading}
                            >
                                <Plus className="size-4" />
                                {loading ? "Publishing Event..." : "Publish Event"}
                            </Button>
                        </div>
                    </form>
                </div>
            </PageContainer>
        </PageShell>
    );
};

export default CreateEventPage;
