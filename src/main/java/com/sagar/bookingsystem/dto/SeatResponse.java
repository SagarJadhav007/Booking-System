package com.sagar.bookingsystem.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {

    private String seatId;

    private String eventId;

    private String status;

    private boolean ownedByCurrentUser;

    private String seatNumber;

    private String rowNumber;

    private Double price;
}