package com.sagar.bookingsystem.dto;

import java.time.Instant;

public record CreateEventRequest(

        String eventName,

        String description,

        String venue,

        Instant eventDate,

        Integer rows,

        Integer seatsPerRow
) {
}