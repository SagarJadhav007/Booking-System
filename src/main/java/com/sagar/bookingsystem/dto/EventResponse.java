package com.sagar.bookingsystem.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private String eventId;

    private String eventName;

    private String description;

    private String venue;

    private Instant eventDate;

    private Integer totalSeats;

    private Boolean active;
}