package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.dto.booking.BookingResponse;
import com.sagar.bookingsystem.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/me")
    public List<BookingResponse> myBookings() {

        return bookingService
                .getMyBookings();
    }
}