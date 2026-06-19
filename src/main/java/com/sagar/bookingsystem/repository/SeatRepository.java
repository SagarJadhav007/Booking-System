package com.sagar.bookingsystem.repository;

import com.sagar.bookingsystem.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository
        extends JpaRepository<Seat, String> {

    List<Seat> findByEventId(
            String eventId
    );

    Optional<Seat> findBySeatId(
            String seatId
    );
}