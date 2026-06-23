package com.sagar.bookingsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String bookingId;

    private String eventId;

    private String seatId;

    private String userId;

    private String paymentId;

    private Double amount;

    private Instant bookedAt;
}