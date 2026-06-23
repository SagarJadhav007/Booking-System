package com.sagar.bookingsystem.dto;

public record DashboardStats(

        long totalUsers,

        long totalBookings,

        long totalPayments,

        long totalSeats

) {
}