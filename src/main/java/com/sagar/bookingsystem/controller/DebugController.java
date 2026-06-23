package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.model.Role;
import com.sagar.bookingsystem.model.User;
import com.sagar.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/debug")
@RequiredArgsConstructor
public class DebugController {

    private final UserRepository userRepository;

    @PostMapping("/promote")
    public String promote(
            @RequestParam String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();

        user.setRole(Role.ADMIN);

        userRepository.save(user);

        return "ADMIN CREATED";
    }
}