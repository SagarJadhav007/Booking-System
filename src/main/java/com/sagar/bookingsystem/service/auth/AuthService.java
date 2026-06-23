package com.sagar.bookingsystem.service.auth;

import com.sagar.bookingsystem.dto.auth.*;
import com.sagar.bookingsystem.model.Role;
import com.sagar.bookingsystem.model.User;
import com.sagar.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public void register(
            RegisterRequest request
    ) {

        if (userRepository.findByEmail(
                request.email()
        ).isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = User.builder()

                .userId(
                        UUID.randomUUID().toString()
                )

                .username(
                        request.username()
                )

                .email(
                        request.email()
                )

                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )

                .role(
                        Role.USER
                )

                .build();

        userRepository.save(
                user
        );
    }

    public AuthResponse login(
            LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(
                        request.email()
                )
                .orElseThrow();

        boolean valid =
                passwordEncoder.matches(

                        request.password(),

                        user.getPassword()
                );

        if (!valid) {

            throw new RuntimeException(
                    "Invalid credentials"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(
                token,
                user.getRole().name()
        );
    }
}