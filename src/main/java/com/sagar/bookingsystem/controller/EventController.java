package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.dto.CreateEventRequest;
import com.sagar.bookingsystem.dto.EventResponse;
import com.sagar.bookingsystem.dto.SeatResponse;
import com.sagar.bookingsystem.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public String createEvent(

            @RequestBody
            CreateEventRequest request
    ) {

        eventService.createEvent(
                request
        );

        return "Event Created";
    }

    @GetMapping
    public List<EventResponse> getEvents() {

        return eventService.getEvents();
    }

    @GetMapping("/{eventId}/seats")
    public List<SeatResponse> getSeatsForEvent(
            @PathVariable String eventId
    ) {

        return eventService.getSeatsForEvent(
                eventId
        );
    }
}