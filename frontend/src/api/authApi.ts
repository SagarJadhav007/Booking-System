import api from "./axios";
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse
} from "../types/auth";

export const login = async (
    request: LoginRequest
): Promise<AuthResponse> => {

    const response =
        await api.post<AuthResponse>(
            "/auth/login",
            request
        );

    return response.data;
};

export const register = async (
    request: RegisterRequest
) => {

    const response =
        await api.post(
            "/auth/register",
            request
        );

    return response.data;
};