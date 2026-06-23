package com.sagar.bookingsystem.dto.sqs;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreatedEvent {

    private String bookingId;

    private String eventId;

    private String seatId;

    private String userEmail;

    private Double amount;
}