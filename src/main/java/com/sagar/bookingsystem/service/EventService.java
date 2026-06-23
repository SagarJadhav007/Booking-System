package com.sagar.bookingsystem.service;

import com.sagar.bookingsystem.dto.CreateEventRequest;
import com.sagar.bookingsystem.dto.EventResponse;
import com.sagar.bookingsystem.model.Event;
import com.sagar.bookingsystem.model.Seat;
import com.sagar.bookingsystem.model.SeatStatus;
import com.sagar.bookingsystem.repository.EventRepository;
import com.sagar.bookingsystem.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.sagar.bookingsystem.dto.SeatHold;
import com.sagar.bookingsystem.dto.SeatResponse;
import com.sagar.bookingsystem.service.RedisSeatHoldService;
import com.sagar.bookingsystem.util.SecurityUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final RedisSeatHoldService redisSeatHoldService;

    private final EventRepository eventRepository;

    private final SeatRepository seatRepository;

    public List<SeatResponse> getSeatsForEvent(
            String eventId
    ) {

        String email =
                SecurityUtils.getCurrentUserEmail();

        List<Seat> seats =
                seatRepository
                        .findByEventId(eventId);

        seats.sort(
                java.util.Comparator
                        .comparing(
                                Seat::getRowNumber
                        )
                        .thenComparing(
                                seat -> Integer.parseInt(
                                        seat.getSeatNumber()
                                                .replaceAll("[A-Z]", "")
                                )
                        )
        );

        return seats.stream()
                .map(seat -> {

                    SeatHold hold =
                            redisSeatHoldService
                                    .getHold(
                                            seat.getSeatId()
                                    );

                    String status =
                            hold != null
                                    ? hold.getState()
                                    : seat.getStatus().name();

                    boolean ownedByCurrentUser =
                            hold != null
                                    &&
                                    hold.getUserId()
                                            .equals(email);

                    return SeatResponse.builder()

                            .seatId(
                                    seat.getSeatId()
                            )

                            .seatNumber(
                                    seat.getSeatNumber()
                            )

                            .rowNumber(
                                    seat.getRowNumber()
                            )

                            .price(
                                    seat.getPrice()
                            )

                            .eventId(
                                    seat.getEventId()
                            )

                            .status(
                                    status
                            )

                            .ownedByCurrentUser(
                                    ownedByCurrentUser
                            )

                            .build();

                })
                .toList();
    }

    public void createEvent(
            CreateEventRequest request
    ) {

        String eventId =
                UUID.randomUUID()
                        .toString();

        Event event =

                Event.builder()

                        .eventId(
                                eventId
                        )

                        .eventName(
                                request.eventName()
                        )

                        .description(
                                request.description()
                        )

                        .venue(
                                request.venue()
                        )

                        .eventDate(
                                request.eventDate()
                        )

                        .totalSeats(
                                request.rows()
                                        *
                                        request.seatsPerRow()
                        )

                        .active(
                                true
                        )

                        .build();

        eventRepository.save(
                event
        );

        generateSeats(
                eventId,
                request.rows(),
                request.seatsPerRow()
        );
    }

    public List<EventResponse> getEvents() {

        return eventRepository
                .findAll()
                .stream()
                .map(event ->

                        EventResponse.builder()

                                .eventId(
                                        event.getEventId()
                                )

                                .eventName(
                                        event.getEventName()
                                )

                                .description(
                                        event.getDescription()
                                )

                                .venue(
                                        event.getVenue()
                                )

                                .eventDate(
                                        event.getEventDate()
                                )

                                .totalSeats(
                                        event.getTotalSeats()
                                )

                                .active(
                                        event.getActive()
                                )

                                .build()

                )
                .toList();
    }

    private void generateSeats(

            String eventId,

            int rows,

            int seatsPerRow
    ) {

        for (

                int r = 0;

                r < rows;

                r++
        ) {

            String row =

                    String.valueOf(

                            (char)
                                    ('A' + r)
                    );

            for (

                    int s = 1;

                    s <= seatsPerRow;

                    s++
            ) {

                double price =

                        r < 2
                                ? 220

                                : r < 4
                                  ? 250

                                  : 300;

                seatRepository.save(

                        Seat.builder()

                                .seatId(
                                        UUID.randomUUID()
                                                .toString()
                                )

                                .seatNumber(
                                        row + s
                                )

                                .rowNumber(
                                        row
                                )

                                .price(
                                        price
                                )

                                .eventId(
                                        eventId
                                )

                                .status(
                                        SeatStatus.AVAILABLE
                                )

                                .build()
                );
            }
        }
    }
}