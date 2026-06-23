package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.dto.admin.AdminStatsResponse;
import com.sagar.bookingsystem.service.AdminService;
import com.sagar.bookingsystem.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.sagar.bookingsystem.dto.booking.BookingResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {

        return adminService.getStats();
    }
    @GetMapping("/bookings")
    public List<BookingResponse>
    getAllBookings() {

        return bookingService
                .getAllBookings();
    }
}