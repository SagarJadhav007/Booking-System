import api from "./axios";

import type {
    AdminStats
} from "../types/admin";

export const getStats =
    async (): Promise<AdminStats> => {

        const response =
            await api.get<AdminStats>(
                "/admin/stats"
            );

        return response.data;
    };