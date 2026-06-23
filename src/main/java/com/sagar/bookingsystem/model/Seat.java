package com.sagar.bookingsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    private String seatId;

    private String seatNumber;

    private String rowNumber;

    private Double price;

    private String eventId;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

    @Version
    private Long version;
}