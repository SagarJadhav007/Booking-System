package com.sagar.bookingsystem.service;

import com.sagar.bookingsystem.dto.booking.BookingResponse;
import com.sagar.bookingsystem.model.Booking;
import com.sagar.bookingsystem.repository.BookingRepository;
import com.sagar.bookingsystem.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository
            bookingRepository;

    public List<BookingResponse>
    getMyBookings() {

        String email =
                SecurityUtils
                        .getCurrentUserEmail();

        return bookingRepository

                .findByUserId(
                        email
                )

                .stream()

                .map(this::mapBooking)

                .toList();
    }

    public List<BookingResponse>
    getAllBookings() {

        return bookingRepository

                .findAll()

                .stream()

                .map(this::mapBooking)

                .toList();
    }

    private BookingResponse
    mapBooking(
            Booking booking
    ) {

        return BookingResponse
                .builder()

                .bookingId(
                        booking.getBookingId()
                )

                .eventId(
                        booking.getEventId()
                )

                .seatId(
                        booking.getSeatId()
                )

                .amount(
                        booking.getAmount()
                )

                .bookedAt(
                        booking.getBookedAt()
                )

                .build();
    }
}