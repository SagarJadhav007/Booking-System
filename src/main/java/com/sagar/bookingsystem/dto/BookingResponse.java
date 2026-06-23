package com.sagar.bookingsystem.dto.booking;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private String bookingId;

    private String eventId;

    private String seatId;

    private Double amount;

    private Instant bookedAt;
}