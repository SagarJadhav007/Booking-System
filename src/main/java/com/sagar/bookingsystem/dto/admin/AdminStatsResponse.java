package com.sagar.bookingsystem.dto.admin;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUsers;

    private long totalEvents;

    private long totalBookings;

    private double revenue;
}