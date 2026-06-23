import api from "./axios";
import type { Booking } from "../types/booking";

export const getMyBookings =
    async (): Promise<Booking[]> => {

        const response =
            await api.get<Booking[]>(
                "/bookings/me"
            );

        return response.data;
    };

export const getAllBookings =
    async (): Promise<Booking[]> => {

        const response =
            await api.get<Booking[]>(
                "/admin/bookings"
            );

        return response.data;
    };