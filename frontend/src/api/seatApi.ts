import api from "./axios";
import type { Seat } from "../types/seat";

export const getSeats =
    async (
        eventId: string
    ): Promise<Seat[]> => {

        const response =
            await api.get<Seat[]>(
                `/events/${eventId}/seats`
            );

        return response.data;
    };

export const reserveSeat =
    async (
        seatId: string
    ) => {

        return api.post(
            "/seats/reserve",
            {
                seatId
            }
        );
    };