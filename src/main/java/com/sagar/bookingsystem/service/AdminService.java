package com.sagar.bookingsystem.service;

import com.sagar.bookingsystem.dto.admin.AdminStatsResponse;
import com.sagar.bookingsystem.model.Booking;
import com.sagar.bookingsystem.repository.BookingRepository;
import com.sagar.bookingsystem.repository.EventRepository;
import com.sagar.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    private final BookingRepository bookingRepository;

    public AdminStatsResponse getStats() {

        long totalUsers =
                userRepository.count();

        long totalEvents =
                eventRepository.count();

        long totalBookings =
                bookingRepository.count();

        double revenue =
                bookingRepository
                        .findAll()
                        .stream()
                        .mapToDouble(
                                Booking::getAmount
                        )
                        .sum();

        return AdminStatsResponse
                .builder()
                .totalUsers(
                        totalUsers
                )
                .totalEvents(
                        totalEvents
                )
                .totalBookings(
                        totalBookings
                )
                .revenue(
                        revenue
                )
                .build();
    }
}