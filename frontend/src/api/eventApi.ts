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