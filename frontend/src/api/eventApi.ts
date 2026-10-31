import api from "./axios";
import type { Event } from "../types/event";

export const getEvents =
    async (): Promise<Event[]> => {

        const response =
            await api.get<Event[]>(
                "/events"
            );

        return response.data;
    };

export const getEventById = async (
    eventId: string
): Promise<Event | null> => {
    const events = await getEvents();
    return events.find((event) => event.eventId === eventId) ?? null;
};