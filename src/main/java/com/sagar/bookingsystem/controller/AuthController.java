package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.dto.auth.*;
import com.sagar.bookingsystem.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(

            @Valid
            @RequestBody
            RegisterRequest request
    ) {

        authService.register(
                request
        );

        return "User registered";
    }

    @PostMapping("/login")
    public AuthResponse login(

            @Valid
            @RequestBody
            LoginRequest request
    ) {

        return authService.login(
                request
        );
    }
}