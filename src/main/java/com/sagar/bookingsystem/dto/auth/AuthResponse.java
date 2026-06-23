package com.sagar.bookingsystem.dto.auth;

public record AuthResponse(
        String token,
        String role
) {
}